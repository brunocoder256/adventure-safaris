export function initSmokeParticles() {
  const c = document.getElementById('smokeCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0;

  function resize() {
    W = c.clientWidth;
    H = c.clientHeight;
    c.width = W * DPR;
    c.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  addEventListener('resize', resize);

  function hash(x, y) {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return n - Math.floor(n);
  }
  function noise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi);
    const d = hash(xi, yi + 1), e = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (d - a) * v + (a - b - d + e) * u * v;
  }
  function fieldAngle(x, y, t) {
    const n = noise(x * 0.005, y * 0.005 + t * 0.06) * 1.6
            + noise(x * 0.013, y * 0.013 - t * 0.04) * 0.4;
    return n * Math.PI * 3;
  }

  const N = 1400;
  const P = [];
  const pointer = { x: -999, y: -999 };

  function spawn(p) {
    p.x = Math.random() * W;
    p.y = H * 0.72 + Math.random() * H * 0.3;
    p.age = 0;
    p.life = 2.2 + Math.random() * 3.2;
    p.r = 0.8 + Math.random() * 2.2;
  }
  for (let i = 0; i < N; i++) {
    const p = {};
    spawn(p);
    p.age = Math.random() * p.life;
    P.push(p);
  }

  let t = 0, last = performance.now();
  let running = true;

  function frame(now) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    t += dt;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(7,7,12,0.16)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (const p of P) {
      p.age += dt;
      if (p.age >= p.life || p.y < -20) { spawn(p); continue; }

      const a = fieldAngle(p.x, p.y, t);
      let vx = Math.cos(a) * 34;
      let vy = Math.sin(a) * 34 - 26;

      const dx = p.x - pointer.x, dy = p.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 14000) {
        const f = (1 - d2 / 14000) * 190;
        const d = Math.sqrt(d2) || 1;
        vx += (dx / d) * f;
        vy += (dy / d) * f;
      }

      p.x += vx * dt;
      p.y += vy * dt;

      const k = p.age / p.life;
      const alpha = Math.sin(Math.PI * k) * 0.16;
      const hue = 190 + k * 70;
      ctx.fillStyle = 'hsla(' + hue + ',85%,68%,' + alpha + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  resize();
  c.addEventListener('pointermove', e => {
    const b = c.getBoundingClientRect();
    pointer.x = e.clientX - b.left;
    pointer.y = e.clientY - b.top;
  });
  c.addEventListener('pointerleave', () => { pointer.x = pointer.y = -999; });
  requestAnimationFrame(frame);

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
    } else {
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    }
  });
}
