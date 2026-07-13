/**
 * Dualform hero — paired silhouette cutouts + CSS mask superimposition.
 * Static soft wipe always shows both states; optional light intersection PE.
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

/**
 * Map intersection → --df-reveal in [0.32, 0.68].
 * Never 0 or 1 — both substrate and expression must always read.
 */
function setupReveal(stage) {
  stage.style.setProperty('--df-reveal', '0.48');
  if (prefersReducedMotion()) return;
  if (!('IntersectionObserver' in window)) return;

  const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);
  const io = new IntersectionObserver(([entry]) => {
    if (!entry) return;
    // 0.32 at low visibility → 0.68 when fully in view (still dual)
    const t = 0.32 + (entry.intersectionRatio * 0.36);
    stage.style.setProperty('--df-reveal', t.toFixed(3));
  }, { threshold: thresholds });

  io.observe(stage);
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
  stage.style.setProperty('--df-reveal', '0.48');
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

  // Always arm light PE unless author opts into .static only
  if (!block.classList.contains('static')) {
    setupReveal(stage);
  }
}
