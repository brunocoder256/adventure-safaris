export function initWaterRipple() {
  const canvas = document.getElementById('heroRipple');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0;

  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  addEventListener('resize', resize);

  class Ripple {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.r = 0;
      this.maxR = 120 + Math.random() * 180;
      this.speed = 2.5 + Math.random() * 2;
      this.life = 1;
      this.decay = .012 + Math.random() * .008;
      this.color = color;
      this.rings = Math.floor(2 + Math.random() * 3);
      this.alive = true;
    }
    update() {
      this.r += this.speed;
      this.life -= this.decay;
      if (this.life <= 0 || this.r > this.maxR) this.alive = false;
    }
    draw() {
      for (let i = 0; i < this.rings; i++) {
        const rOff = (i / this.rings) * 40;
        const rCur = Math.max(0, this.r - rOff);
        const alpha = this.life * (1 - i / this.rings) * .7;
        if (rCur <= 0) continue;
        ctx.beginPath();
        ctx.arc(this.x, this.y, rCur, 0, Math.PI * 2);
        ctx.strokeStyle = this.color.replace('ALPHA', alpha.toFixed(2));
        ctx.lineWidth = 2 - i * .4;
        ctx.stroke();
      }
    }
  }

  class FloatRipple {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = 0;
      this.maxR = 30 + Math.random() * 60;
      this.speed = .4 + Math.random() * .6;
      this.life = 1;
      this.decay = .004 + Math.random() * .004;
      this.delay = Math.random() * 300;
      this.alive = true;
    }
    update() {
      if (this.delay > 0) { this.delay--; return; }
      this.r += this.speed;
      this.life -= this.decay;
      if (this.life <= 0) this.reset();
    }
    draw() {
      if (this.delay > 0) return;
      const alpha = this.life * .3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180,220,255,${alpha.toFixed(2)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  const COLORS = [
    'rgba(200,230,255,ALPHA)',
    'rgba(180,220,255,ALPHA)',
    'rgba(220,240,255,ALPHA)',
    'rgba(160,210,255,ALPHA)',
    'rgba(240,250,255,ALPHA)',
  ];

  const ripples = [];
  const floaters = Array.from({ length: 12 }, () => new FloatRipple());

  let lastMove = 0;
  canvas.addEventListener('pointermove', e => {
    const now = Date.now();
    if (now - lastMove > 120) {
      const b = canvas.getBoundingClientRect();
      ripples.push(new Ripple(e.clientX - b.left, e.clientY - b.top, COLORS[0]));
      lastMove = now;
    }
  });

  canvas.addEventListener('click', e => {
    const b = canvas.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      ripples.push(new Ripple(
        e.clientX - b.left + (Math.random() - .5) * 20,
        e.clientY - b.top + (Math.random() - .5) * 20,
        COLORS[Math.floor(Math.random() * COLORS.length)]
      ));
    }
  });

  let running = true;

  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);

    ctx.clearRect(0, 0, W, H);

    floaters.forEach(f => { f.update(); f.draw(); });

    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].draw();
      if (!ripples[i].alive) ripples.splice(i, 1);
    }
  }

  resize();
  loop();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
    } else {
      running = true;
      requestAnimationFrame(loop);
    }
  });
}
