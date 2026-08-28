import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class EarthExperience {
  constructor(canvasEl, stageEl) {
    this.canvas = canvasEl;
    this.stage = stageEl;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.globe = null;
    this.clouds = null;
    this.atmosphere = null;
    this.stars = null;
    this.sun = null;
    this.ambient = null;
    this.clock = new THREE.Clock();
    this.autoRotateSpeed = 0.48;
    this.isDestroyed = false;
    this.animationId = null;
    this.init();
  }

  init() {
    try {
      this.setupScene();
      this.setupCamera();
      this.setupRenderer();
      this.setupLighting();
      this.createStarField();
      this.createEarth();
      this.createClouds();
      this.createAtmosphere();
      this.setupControls();
      this.setupResize();
      this.animate();
    } catch (err) {
      console.error('Earth init failed:', err);
      this.showFallback();
    }
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020806);
  }

  setupCamera() {
    const aspect = this.stage.clientWidth / this.stage.clientHeight || 1;
    this.camera = new THREE.PerspectiveCamera(25, aspect, 0.1, 100);
    this.camera.position.set(0, 0.05, 4.2);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.stage.clientWidth, this.stage.clientHeight, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
  }

  setupLighting() {
    this.sun = new THREE.DirectionalLight(0xffffff, 2.7);
    this.sun.position.set(4, 1.8, 4);
    this.scene.add(this.sun);

    this.ambient = new THREE.AmbientLight(0x31506a, 0.18);
    this.scene.add(this.ambient);
  }

  createStarField() {
    const starCount = window.innerWidth < 768 ? 1600 : 2600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < positions.length; i += 3) {
      const r = 18 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.cos(phi);
      positions[i + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.stars = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.025,
        transparent: true,
        opacity: 0.72,
      })
    );
    this.scene.add(this.stars);
  }

  createEarth() {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const base = 'https://threejs.org/examples/textures/planets/';

    const dayTexture = loader.load(base + 'earth_day_4096.jpg');
    const nightTexture = loader.load(base + 'earth_night_4096.jpg');
    const reliefTexture = loader.load(base + 'earth_bump_roughness_clouds_4096.jpg');

    dayTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.colorSpace = THREE.SRGBColorSpace;
    dayTexture.anisotropy = 8;
    nightTexture.anisotropy = 8;
    reliefTexture.anisotropy = 8;

    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: dayTexture },
        nightMap: { value: nightTexture },
        reliefMap: { value: reliefTexture },
        sunDirection: { value: new THREE.Vector3().copy(this.sun.position).normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main(){
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 world = modelMatrix * vec4(position,1.0);
          vWorldPosition = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: `
        uniform sampler2D dayMap;
        uniform sampler2D nightMap;
        uniform sampler2D reliefMap;
        uniform vec3 sunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main(){
          vec3 day = texture2D(dayMap, vUv).rgb;
          vec3 night = texture2D(nightMap, vUv).rgb;
          float cloud = texture2D(reliefMap, vUv).b;
          float light = dot(normalize(vNormal), normalize(sunDirection));
          float dayFactor = smoothstep(-0.18, 0.28, light);
          float twilight = smoothstep(-0.28, 0.18, light) * (1.0 - smoothstep(0.18, 0.52, light));
          vec3 color = mix(night * 1.45, day, dayFactor);
          color += vec3(0.12,0.055,0.018) * twilight;
          color = mix(color, color + vec3(0.08), cloud * max(dayFactor,0.0) * 0.12);
          gl_FragColor = vec4(color,1.0);
        }
      `,
    });

    this.globe = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), earthMaterial);
    this.scene.add(this.globe);

    // Store texture refs for disposal
    this._textures = [dayTexture, nightTexture, reliefTexture];
  }

  createClouds() {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const cloudTexture = loader.load('https://threejs.org/examples/textures/planets/earth_bump_roughness_clouds_4096.jpg');

    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    this.clouds = new THREE.Mesh(new THREE.SphereGeometry(1.012, 96, 96), cloudMaterial);
    this.scene.add(this.clouds);
    this._cloudTexture = cloudTexture;
  }

  createAtmosphere() {
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        cameraPos: { value: this.camera.position },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main(){
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main(){
          float edge = pow(1.0 - max(dot(vNormal, vec3(0.0,0.0,1.0)), 0.0), 2.7);
          gl_FragColor = vec4(0.20, 0.67, 1.0, edge * 0.24);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.075, 96, 96), atmosphereMaterial);
    this.scene.add(this.atmosphere);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.045;
    this.controls.enablePan = false;
    this.controls.minDistance = 2.8;
    this.controls.maxDistance = 6.0;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = this.autoRotateSpeed;
    this.controls.rotateSpeed = 0.55;
    this.controls.zoomSpeed = 0.55;
  }

  setupResize() {
    const ro = new ResizeObserver(() => this.resize());
    ro.observe(this.stage);
    this._ro = ro;
    this.resize();
  }

  resize() {
    if (this.isDestroyed) return;
    const w = Math.max(1, Math.floor(this.stage.clientWidth));
    const h = Math.max(1, Math.floor(this.stage.clientHeight));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    if (this.isDestroyed) return;
    const delta = this.clock.getDelta();
    if (this.globe) this.globe.rotation.y += delta * 0.025;
    if (this.clouds) this.clouds.rotation.y += delta * 0.034;
    if (this.stars) this.stars.rotation.y += delta * 0.0015;
    if (this.controls) this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  showFallback() {
    if (!this.stage) return;
    this.stage.classList.add('earth-fallback');
  }

  destroy() {
    this.isDestroyed = true;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this._ro) this._ro.disconnect();
    if (this.controls) this.controls.dispose();
    if (this.renderer) this.renderer.dispose();

    // Dispose textures
    if (this._textures) this._textures.forEach(t => t.dispose());
    if (this._cloudTexture) this._cloudTexture.dispose();

    // Dispose geometries and materials
    this.scene?.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });
  }
}
