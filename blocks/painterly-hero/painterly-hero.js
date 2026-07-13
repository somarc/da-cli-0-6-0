/**
 * Painterly collage hero — Renderaissance collage depth.
 * Static images first; optional mouse parallax when motion is allowed.
 */

function classifyCopy(copy) {
  let sawHeading = false;
  [...copy.children].forEach((el) => {
    if (el.tagName === 'H1' || el.tagName === 'H2') {
      sawHeading = true;
      return;
    }
    if (el.tagName === 'P') {
      if (!sawHeading && !el.classList.contains('ph-lede')) {
        el.classList.add('ph-eyebrow');
      } else {
        el.classList.add('ph-lede');
      }
    }
  });
}

function wrapLayer(picture, className, depth) {
  const layer = document.createElement('div');
  layer.className = `ph-layer ${className}`;
  layer.style.setProperty('--rr-depth', depth);
  layer.append(picture);
  return layer;
}

/**
 * Accepts either:
 *  - one row, two columns: [copy | art]
 *  - two rows: [copy], [art]
 */
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

function buildStructure(block) {
  const { copyCell, artCell } = splitCopyAndArt(block);

  const inner = document.createElement('div');
  inner.className = 'ph-inner';

  const copy = document.createElement('div');
  copy.className = 'ph-copy';
  if (copyCell) {
    copy.append(...copyCell.childNodes);
    classifyCopy(copy);
  }

  const art = document.createElement('div');
  art.className = 'ph-art';

  const pictures = [];
  if (artCell) {
    pictures.push(...artCell.querySelectorAll('picture'));
    // bare imgs without picture
    artCell.querySelectorAll('img').forEach((img) => {
      if (!img.closest('picture')) {
        const pic = document.createElement('picture');
        pic.append(img);
        pictures.push(pic);
      }
    });
  }
  // fallback: any remaining pictures in block
  if (!pictures.length) {
    pictures.push(...block.querySelectorAll('picture'));
  }

  const depths = ['8px', '18px', '10px'];
  const classes = ['layer-bg', 'layer-focal', 'layer-object'];

  const limited = pictures.slice(0, 3);
  if (limited.length === 1) {
    block.classList.add('ph-single');
    // Single plate sits as focal (skip empty bg)
    art.append(wrapLayer(limited[0], 'layer-focal', '14px'));
  } else {
    limited.forEach((pic, i) => {
      if (i === 0) {
        const img = pic.querySelector('img');
        if (img) img.alt = '';
      }
      art.append(wrapLayer(pic, classes[i] || `layer-${i}`, depths[i] || '8px'));
    });
  }

  inner.append(copy, art);
  block.replaceChildren(inner);
}

function armParallax(block) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const layers = [...block.querySelectorAll('.ph-layer')].map((el) => ({
    el,
    depth: parseFloat(getComputedStyle(el).getPropertyValue('--rr-depth')) || 0,
  })).filter((l) => l.depth);

  if (!layers.length) return;

  let armed = false;
  const arm = () => { armed = true; };
  const lastImg = block.querySelector('.layer-focal img, .layer-object img, .ph-layer img');
  if (lastImg) lastImg.addEventListener('animationend', arm, { once: true });
  window.setTimeout(arm, 1200);

  window.addEventListener('mousemove', (e) => {
    if (!armed) return;
    const mx = (e.clientX / window.innerWidth) * 2 - 1;
    layers.forEach(({ el, depth }) => {
      el.style.transform = `translateX(${(mx * depth).toFixed(2)}px)`;
    });
  }, { passive: true });
}

export default function decorate(block) {
  buildStructure(block);
  armParallax(block);
}
