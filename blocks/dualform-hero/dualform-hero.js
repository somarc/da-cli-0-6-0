/**
 * Dualform hero — paired silhouette cutouts + CSS mask superimposition.
 * Mask is driven by pointer position on the page (reference dual-image craft).
 * Static mid wipe when motion is reduced or pointer is coarse.
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

function setPointerVars(stage, x, y) {
  // 0–1 across the viewport
  const nx = Math.min(1, Math.max(0, x));
  const ny = Math.min(1, Math.max(0, y));
  stage.style.setProperty('--df-mx', nx.toFixed(4));
  stage.style.setProperty('--df-my', ny.toFixed(4));
  // Combined wipe 0–1 for simple 1D gradients
  stage.style.setProperty('--df-reveal', (0.2 + nx * 0.6).toFixed(4));
}

/**
 * Page-level pointer drives the dual-state mask (like reference demos).
 * Defaults to a mid wipe until the first move.
 */
function setupPointerMask(stage) {
  setPointerVars(stage, 0.5, 0.45);

  if (prefersReducedMotion() || isCoarsePointer()) {
    stage.classList.add('df-static-mask');
    return;
  }

  stage.classList.add('df-pointer-mask');

  let raf = 0;
  let latest = null;

  const apply = () => {
    raf = 0;
    if (!latest) return;
    const { clientX, clientY } = latest;
    setPointerVars(
      stage,
      clientX / window.innerWidth,
      clientY / window.innerHeight,
    );
  };

  const onMove = (e) => {
    latest = e;
    if (!raf) raf = window.requestAnimationFrame(apply);
  };

  window.addEventListener('pointermove', onMove, { passive: true });

  // Touch / pen leave: ease back toward center
  window.addEventListener('pointerleave', () => {
    setPointerVars(stage, 0.5, 0.45);
  }, { passive: true });
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
    setupPointerMask(stage);
  } else {
    stage.classList.add('df-static-mask');
    setPointerVars(stage, 0.5, 0.45);
  }
}
