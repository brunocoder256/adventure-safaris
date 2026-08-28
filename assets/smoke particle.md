A

 /RTYUIOP[']

+—Æ '<canvas id="c"></canvas> 
<p class="note">
  Smoke where no particle stores a direction. Velocity is read from a shared
  <strong>flow field</strong> each frame, so 1400 sprites cost one noise lookup each and the
  whole look is retuned by changing the field, not the emitter.
  Move the pointer to push the field around.
  <br><a href="https://nixiefx.com/pixijs-particle-effects/" target="_blank" rel="noopener">PixiJS notes on the same technique</a>
</p>
* { box-sizing: border-box; }
body { margin:0; background:#07070c; color:#cfd3e2;
  font:14px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
#c { display:block; width:100%; height:320px; background:#07070c; cursor:crosshair; touch-action:none; }
.note { margin:10px 12px; max-width:64ch; color:#8f96ad; }
.note strong { color:#cfd3e2; }
.note a { color:#7fd4ff; }
const c = document.getElementById("c");
const ctx = c.getContext("2d");
const DPR = Math.min(devicePixelRatio || 1, 2);
let W = 0, H = 0;

function resize() {
  W = c.clientWidth; H = c.clientHeight;
  c.width = W * DPR; c.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
addEventListener("resize", resize);

// --- a cheap value-noise flow field -------------------------------------
// The point of this demo: particles hold position and age, nothing else.
// Direction is sampled from a field shared by every particle, so the motion
// is retuned by editing the field rather than by touching the emitter.
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
for (let i = 0; i < N; i++) { const p = {}; spawn(p); p.age = Math.random() * p.life; P.push(p); }

let t = 0, last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now; t += dt;

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(7,7,12,0.16)";
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = "lighter";

  for (const p of P) {
    p.age += dt;
    if (p.age >= p.life || p.y < -20) { spawn(p); continue; }

    const a = fieldAngle(p.x, p.y, t);
    let vx = Math.cos(a) * 34;
    let vy = Math.sin(a) * 34 - 26;   // steady lift, like warm air

    const dx = p.x - pointer.x, dy = p.y - pointer.y;
    const d2 = dx * dx + dy * dy;
    if (d2 < 14000) {                 // pointer shoves the field locally
      const f = (1 - d2 / 14000) * 190;
      const d = Math.sqrt(d2) || 1;
      vx += (dx / d) * f; vy += (dy / d) * f;
    }

    p.x += vx * dt; p.y += vy * dt;

    const k = p.age / p.life;
    const alpha = Math.sin(Math.PI * k) * 0.16;   // fade in and out over life
    const hue = 190 + k * 70;
    ctx.fillStyle = "hsla(" + hue + ",85%,68%," + alpha + ")";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(frame);
}

resize();
c.addEventListener("pointermove", (e) => {
  const b = c.getBoundingClientRect();
  pointer.x = e.clientX - b.left; pointer.y = e.clientY - b.top;
});
c.addEventListener("pointerleave", () => { pointer.x = pointer.y = -999; });
requestAnimationFrame(frame);
use the above code to implement the smoke particle animation in the section above the footer