/**
 * Dualform hero — paired silhouette cutouts + CSS mask superimposition.
 * Morphing soft hole under the pointer reveals expression (B) through
 * substrate (A) — reference dual-image craft / Norris-like reveal language.
 */

function classifyCopy(copy) {
  let sawHeading = false;
  [...copy.children].forEach((el) => {
    if (el.tagName === 'H1' || el.tagName === 'H2') {
      sawHeading = true;
      return;
    }
    if (el.tagName === 'P') {
      if (!sawHeading && !el.classList.contains('df-lede')) {
        el.classList.add('df-eyebrow');
      } else {
        el.classList.add('df-lede');
      }
    }
  });
}

function splitCopyAndArt(block) {
  const rows = [...block.children];
  if (!rows.length) return { copyCell: null, artCell: null };

  const firstRow = rows[0];
  const cols = [...firstRow.children];

  if (cols.length >= 2) {
    return { copyCell: cols[0], artCell: cols[1] };
  }

  if (rows.length >= 2) {
    const copyCell = rows[0].querySelector(':scope > div') || rows[0];
    const artCell = rows[1].querySelector(':scope > div') || rows[1];
    return { copyCell, artCell };
  }

  return { copyCell: cols[0] || firstRow, artCell: null };
}

function collectPictures(artCell) {
  if (!artCell) return [];
  const pictures = [...artCell.querySelectorAll('picture')];
  artCell.querySelectorAll('img').forEach((img) => {
    if (!img.closest('picture')) {
      const pic = document.createElement('picture');
      pic.append(img);
      pictures.push(pic);
    }
  });
  return pictures;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isCoarsePointer() {
  return window.matchMedia('(pointer: coarse)').matches;
}

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

/**
 * Morphing hole params under the cursor (stage-local %).
 * rx/ry and softness evolve with motion so the hole is not a fixed circle.
 */
function setHole(stage, {
  mx, my, rx, ry, soft, angle,
}) {
  stage.style.setProperty('--df-mx', `${(mx * 100).toFixed(2)}%`);
  stage.style.setProperty('--df-my', `${(my * 100).toFixed(2)}%`);
  stage.style.setProperty('--df-rx', `${rx.toFixed(2)}%`);
  stage.style.setProperty('--df-ry', `${ry.toFixed(2)}%`);
  stage.style.setProperty('--df-soft', soft.toFixed(3));
  stage.style.setProperty('--df-angle', `${angle.toFixed(1)}deg`);
}

function defaultHole(stage) {
  setHole(stage, {
    mx: 0.52,
    my: 0.48,
    rx: 48,
    ry: 40,
    soft: 0.55,
    angle: -12,
  });
}

function setupMorphingHole(stage) {
  defaultHole(stage);

  if (prefersReducedMotion() || isCoarsePointer()) {
    stage.classList.add('df-static-mask');
    return;
  }

  stage.classList.add('df-pointer-mask');

  let raf = 0;
  let prevX = null;
  let prevY = null;
  let prevT = 0;
  let smx = 0.52;
  let smy = 0.48;
  let srx = 48;
  let sry = 40;
  let ssoft = 0.55;
  let sangle = -12;
  let pending = null;

  const apply = () => {
    raf = 0;
    if (!pending) return;

    const { clientX, clientY, timeStamp } = pending;
    const rect = stage.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;

    // Hole center = pointer relative to the stage (under the cursor on the form)
    const rawX = (clientX - rect.left) / rect.width;
    const rawY = (clientY - rect.top) / rect.height;
    // Allow slight overshoot so the hole can edge-bleed
    const tx = clamp(rawX, -0.05, 1.05);
    const ty = clamp(rawY, -0.05, 1.05);

    // Velocity in stage units / ms → morph axes (not a rigid circle)
    let vx = 0;
    let vy = 0;
    if (prevX !== null && timeStamp > prevT) {
      const dt = Math.max(8, timeStamp - prevT);
      vx = ((clientX - prevX) / rect.width) / dt;
      vy = ((clientY - prevY) / rect.height) / dt;
    }
    prevX = clientX;
    prevY = clientY;
    prevT = timeStamp;

    const speed = Math.hypot(vx, vy) * 1000; // ~ stage-widths per second
    const speedClamped = clamp(speed, 0, 2.5);

    // Base blob + stretch along motion direction + size bloom with speed
    const bloom = 1 + speedClamped * 0.35;
    const stretch = clamp(speedClamped * 0.55, 0, 0.85);
    const ang = Math.atan2(vy, vx) * (180 / Math.PI);

    // Prefer horizontal vs vertical stretch from velocity components
    const ax = Math.abs(vx);
    const ay = Math.abs(vy);
    const denom = ax + ay + 0.0001;
    const hx = ax / denom;
    const hy = ay / denom;

    const targetRx = clamp((42 + hx * stretch * 38) * bloom, 28, 78);
    const targetRy = clamp((36 + hy * stretch * 38) * bloom, 24, 72);
    // Faster motion → softer feather (more morph-like, less hard circle)
    const targetSoft = clamp(0.42 + speedClamped * 0.18, 0.38, 0.78);
    const targetAngle = Number.isFinite(ang) ? ang * 0.35 : sangle;

    // Light smoothing so the hole feels alive, not jittery
    const k = 0.22;
    smx += (tx - smx) * k;
    smy += (ty - smy) * k;
    srx += (targetRx - srx) * 0.18;
    sry += (targetRy - sry) * 0.18;
    ssoft += (targetSoft - ssoft) * 0.15;
    // Angle unwrap-ish blend
    sangle += (targetAngle - sangle) * 0.12;

    setHole(stage, {
      mx: smx,
      my: smy,
      rx: srx,
      ry: sry,
      soft: ssoft,
      angle: sangle,
    });
  };

  const onMove = (e) => {
    pending = e;
    if (!raf) raf = window.requestAnimationFrame(apply);
  };

  window.addEventListener('pointermove', onMove, { passive: true });

  // When pointer leaves the window, ease hole back to a resting morph
  document.documentElement.addEventListener('mouseleave', () => {
    pending = null;
    const rest = () => {
      smx += (0.52 - smx) * 0.12;
      smy += (0.48 - smy) * 0.12;
      srx += (48 - srx) * 0.1;
      sry += (40 - sry) * 0.1;
      ssoft += (0.55 - ssoft) * 0.1;
      sangle += (-12 - sangle) * 0.1;
      setHole(stage, {
        mx: smx, my: smy, rx: srx, ry: sry, soft: ssoft, angle: sangle,
      });
      if (Math.abs(smx - 0.52) > 0.01) {
        raf = window.requestAnimationFrame(rest);
      } else {
        raf = 0;
        defaultHole(stage);
      }
    };
    if (!raf) raf = window.requestAnimationFrame(rest);
  });
}

export default function decorate(block) {
  const { copyCell, artCell } = splitCopyAndArt(block);
  const pictures = collectPictures(artCell);

  const inner = document.createElement('div');
  inner.className = 'df-inner';

  const copy = document.createElement('div');
  copy.className = 'df-copy';
  if (copyCell) {
    copy.append(...copyCell.childNodes);
    classifyCopy(copy);
  }

  const stage = document.createElement('div');
  stage.className = 'df-stage';
  stage.setAttribute('role', 'img');
  stage.setAttribute(
    'aria-label',
    pictures[1]?.querySelector('img')?.alt
      || pictures[0]?.querySelector('img')?.alt
      || 'Dual-state form composite',
  );

  pictures.slice(0, 2).forEach((pic, i) => {
    const layer = document.createElement('div');
    layer.className = `df-layer ${i === 0 ? 'df-a' : 'df-b'}`;
    const img = pic.querySelector('img');
    if (img && i === 0) {
      img.setAttribute('fetchpriority', 'high');
      img.loading = 'eager';
    } else if (img) {
      img.loading = 'lazy';
    }
    layer.append(pic);
    stage.append(layer);
  });

  inner.append(copy, stage);
  block.replaceChildren(inner);

  if (!block.classList.contains('static')) {
    setupMorphingHole(stage);
  } else {
    stage.classList.add('df-static-mask');
    defaultHole(stage);
  }
}
