/**
 * Dualform Ionic gutters — bare column (A) + living dual-state (B)
 * with morphing pointer hole (same PE language as dualform-hero).
 */

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches;
}

function setHole(el, {
  mx, my, rx, ry, soft,
}) {
  el.style.setProperty('--df-mx', `${(mx * 100).toFixed(2)}%`);
  el.style.setProperty('--df-my', `${(my * 100).toFixed(2)}%`);
  el.style.setProperty('--df-rx', `${rx.toFixed(2)}%`);
  el.style.setProperty('--df-ry', `${ry.toFixed(2)}%`);
  el.style.setProperty('--df-soft', soft.toFixed(3));
}

function defaultHole(el) {
  setHole(el, {
    mx: 0.5, my: 0.4, rx: 54, ry: 46, soft: 0.55,
  });
}

function buildGutter(side) {
  const gutter = document.createElement('div');
  gutter.className = `df-gutter df-gutter-${side}`;
  gutter.setAttribute('aria-hidden', 'true');

  const inner = document.createElement('div');
  inner.className = 'df-gutter-inner';

  const a = document.createElement('div');
  a.className = 'df-gutter-layer df-gutter-a';

  const b = document.createElement('div');
  b.className = 'df-gutter-layer df-gutter-b';

  inner.append(a, b);
  gutter.append(inner);
  document.body.append(gutter);
  defaultHole(gutter);
  return gutter;
}

function armPointer(gutters) {
  if (prefersReducedMotion() || isCoarsePointer()) {
    gutters.forEach((g) => g.classList.add('is-static'));
    return;
  }

  let raf = 0;
  let pending = null;
  let prevX = null;
  let prevY = null;
  let prevT = 0;

  // Per-gutter smoothed state
  const state = gutters.map(() => ({
    mx: 0.5, my: 0.4, rx: 54, ry: 46, soft: 0.55,
  }));

  const apply = () => {
    raf = 0;
    if (!pending) return;
    const { clientX, clientY, timeStamp } = pending;

    let vx = 0;
    let vy = 0;
    if (prevX !== null && timeStamp > prevT) {
      const dt = Math.max(8, timeStamp - prevT);
      vx = (clientX - prevX) / dt;
      vy = (clientY - prevY) / dt;
    }
    prevX = clientX;
    prevY = clientY;
    prevT = timeStamp;

    const speed = Math.hypot(vx, vy); // px/ms
    const speedClamped = clamp(speed * 16, 0, 2.5);

    gutters.forEach((gutter, i) => {
      const rect = gutter.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;

      // Right gutter is visually flipped — mirror X so hole tracks under cursor
      let tx = (clientX - rect.left) / rect.width;
      const ty = (clientY - rect.top) / rect.height;
      if (gutter.classList.contains('df-gutter-right')) {
        tx = 1 - tx;
      }
      tx = clamp(tx, -0.05, 1.05);
      const tyC = clamp(ty, -0.05, 1.05);

      const bloom = 1 + speedClamped * 0.3;
      const stretch = clamp(speedClamped * 0.5, 0, 0.8);
      const ax = Math.abs(vx);
      const ay = Math.abs(vy);
      const denom = ax + ay + 0.0001;
      const hx = ax / denom;
      const hy = ay / denom;

      const targetRx = clamp((46 + hx * stretch * 36) * bloom, 30, 80);
      const targetRy = clamp((40 + hy * stretch * 36) * bloom, 26, 74);
      const targetSoft = clamp(0.42 + speedClamped * 0.16, 0.38, 0.78);

      const s = state[i];
      const k = 0.2;
      s.mx += (tx - s.mx) * k;
      s.my += (tyC - s.my) * k;
      s.rx += (targetRx - s.rx) * 0.16;
      s.ry += (targetRy - s.ry) * 0.16;
      s.soft += (targetSoft - s.soft) * 0.14;

      setHole(gutter, s);
    });
  };

  window.addEventListener('pointermove', (e) => {
    pending = e;
    if (!raf) raf = window.requestAnimationFrame(apply);
  }, { passive: true });
}

export default function initDualformGutters() {
  if (window.matchMedia('(width < 1100px)').matches) return;
  if (document.querySelector('.df-gutter')) return;

  const left = buildGutter('left');
  const right = buildGutter('right');
  armPointer([left, right]);
}
