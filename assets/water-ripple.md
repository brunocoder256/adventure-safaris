<canvas id="c"></canvas>
<div id="cursor"></div>
 
<div class="overlay">
  <div class="title">Ripple</div>
  <p class="hint">Click or move to create waves</p>
</div>
 
<div class="corner tl">Canvas · Water Simulation</div>
<div class="corner br">No Library</div>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
 
  body {
    min-height: 100vh;
    background: #05090f;
    overflow: hidden;
    cursor: none;
    font-family: 'DM Mono', monospace;
  }
 
  canvas { position: fixed; inset: 0; width: 100%; height: 100%; }
 
  #cursor {
    position: fixed; width: 6px; height: 6px;
    background: rgba(255,255,255,.8); border-radius: 50%;
    pointer-events: none; z-index: 100;
    transform: translate(-50%, -50%);
    mix-blend-mode: difference;
  }
 
  .overlay {
    position: fixed; inset: 0; z-index: 1; pointer-events: none;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center;
  }
 
  .title {
    font-size: clamp(3rem,10vw,8rem);
    font-weight: 300;
    letter-spacing: .08em;
    color: rgba(255,255,255,.06);
    text-transform: uppercase;
    line-height: 1;
    user-select: none;
  }
 
  .hint {
    margin-top: 2rem;
    font-size: .58rem;
    letter-spacing: .25em;
    text-transform: uppercase;
    color: rgba(255,255,255,.12);
    animation: breathe 3s ease-in-out infinite 1s;
  }
 
  @keyframes breathe { 0%,100%{opacity:.4;}50%{opacity:1;} }
 
  .corner {
    position: fixed; font-size:.52rem; letter-spacing:.18em;
    text-transform: uppercase; color: rgba(255,255,255,.1);
    z-index: 10; pointer-events: none;
  }
  .tl { top:1.8rem;left:2rem; }
  .br { bottom:1.8rem;right:2rem; }
    const canvas = document.getElementById('c');
  const ctx    = canvas.getContext('2d');
  const curEl  = document.getElementById('cursor');
 
  let W, H;
 
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
 
  // Mouse
  const mouse = { x: W/2, y: H/2 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    curEl.style.left = e.clientX + 'px';
    curEl.style.top  = e.clientY + 'px';
  });
 
  // ── Ripple class ──
  class Ripple {
    constructor(x, y, color) {
      this.x    = x;
      this.y    = y;
      this.r    = 0;
      this.maxR = 120 + Math.random() * 180;
      this.speed= 2.5 + Math.random() * 2;
      this.life = 1;
      this.decay= .012 + Math.random() * .008;
      this.color= color;
      this.rings= Math.floor(2 + Math.random() * 3);
      this.alive= true;
    }
 
    update() {
      this.r    += this.speed;
      this.life -= this.decay;
      if (this.life <= 0 || this.r > this.maxR) this.alive = false;
    }
 
    draw() {
      for (let i = 0; i < this.rings; i++) {
        const rOff    = (i / this.rings) * 40;
        const rCur    = Math.max(0, this.r - rOff);
        const alpha   = this.life * (1 - i / this.rings) * .7;
        if (rCur <= 0) continue;
 
        ctx.beginPath();
        ctx.arc(this.x, this.y, rCur, 0, Math.PI * 2);
        ctx.strokeStyle = this.color.replace('ALPHA', alpha.toFixed(2));
        ctx.lineWidth   = 1.5 - i * .3;
        ctx.stroke();
      }
    }
  }
 
  // ── Passive float ripples ──
  class FloatRipple {
    constructor() { this.reset(); }
 
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.r     = 0;
      this.maxR  = 30 + Math.random() * 60;
      this.speed = .4 + Math.random() * .6;
      this.life  = 1;
      this.decay = .004 + Math.random() * .004;
      this.delay = Math.random() * 300;
      this.alive = true;
    }
 
    update() {
      if (this.delay > 0) { this.delay--; return; }
      this.r    += this.speed;
      this.life -= this.decay;
      if (this.life <= 0) { this.reset(); }
    }
 
    draw() {
      if (this.delay > 0) return;
      const alpha = this.life * .15;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100,180,255,${alpha.toFixed(2)})`;
      ctx.lineWidth   = .8;
      ctx.stroke();
    }
  }
 
  // Colors for click ripples
  const COLORS = [
    'rgba(100,180,255,ALPHA)',
    'rgba(120,200,255,ALPHA)',
    'rgba(80,160,240,ALPHA)',
    'rgba(140,220,255,ALPHA)',
    'rgba(180,230,255,ALPHA)',
  ];
 
  const ripples = [];
  const floaters = Array.from({ length: 12 }, () => new FloatRipple());
 
  // Click / mousemove
  let lastMove = 0;
  window.addEventListener('click', e => {
    for (let i = 0; i < 3; i++) {
      ripples.push(new Ripple(
        e.clientX + (Math.random()-0.5)*20,
        e.clientY + (Math.random()-0.5)*20,
        COLORS[Math.floor(Math.random()*COLORS.length)]
      ));
    }
  });
 
  window.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastMove > 120) {
      ripples.push(new Ripple(e.clientX, e.clientY, COLORS[0]));
      lastMove = now;
    }
  });
 
  // ── Render ──
  function loop() {
    requestAnimationFrame(loop);
 
    // Dark blue water bg with trail
    ctx.fillStyle = 'rgba(5,9,15,.25)';
    ctx.fillRect(0, 0, W, H);
 
    // Base water color
    ctx.fillStyle = 'rgba(10,20,40,.08)';
    ctx.fillRect(0, 0, W, H);
 
    // Floating ripples
    floaters.forEach(f => { f.update(); f.draw(); });
 
    // Click ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].draw();
      if (!ripples[i].alive) ripples.splice(i, 1);
    }
  }
 
  loop();
  implement this water ripple animation into the hero section