/**
 * Painterly collage hero — Renderaissance.
 * Depth collage by default; lit PE when focal maps are present.
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

/**
 * Collect optional map URLs from the art cell.
 *
 * Authoring contracts (order survives Helix media rewrite):
 *  1. Four images → [plate, normal, roughness, height] = single plate + lit maps
 *  2. Filename/data-role hints when present (dev / local fixtures)
 *  3. One–three images → collage layers (bg, focal, object)
 */
function extractMaps(artCell) {
  const maps = { normal: null, rough: null, height: null };
  if (!artCell) return { pictures: [], maps };

  const allPics = [];
  artCell.querySelectorAll('picture').forEach((p) => allPics.push(p));
  artCell.querySelectorAll('img').forEach((img) => {
    if (!img.closest('picture')) {
      const pic = document.createElement('picture');
      pic.append(img);
      allPics.push(pic);
    }
  });

  // Preferred: plate + 3 maps by order (hashes lose -normal suffixes)
  if (allPics.length === 4) {
    const srcOf = (pic) => {
      const img = pic.querySelector('img');
      return img?.currentSrc || img?.src || '';
    };
    maps.normal = srcOf(allPics[1]);
    maps.rough = srcOf(allPics[2]);
    maps.height = srcOf(allPics[3]);
    return { pictures: [allPics[0]], maps };
  }

  const pictures = [];
  allPics.forEach((pic) => {
    const img = pic.querySelector('img');
    const src = (img?.currentSrc || img?.src || '').toLowerCase();
    const role = (img?.dataset.role || '').toLowerCase();
    const alt = (img?.alt || '').toLowerCase();
    if (role === 'normal' || src.includes('-normal') || alt === 'normal map') {
      maps.normal = img.currentSrc || img.src;
    } else if (role === 'roughness' || role === 'rough'
      || src.includes('-roughness') || src.includes('-rough')
      || alt === 'roughness map') {
      maps.rough = img.currentSrc || img.src;
    } else if (role === 'height' || src.includes('-height') || alt === 'height map') {
      maps.height = img.currentSrc || img.src;
    } else {
      pictures.push(pic);
    }
  });

  return { pictures, maps };
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

  const { pictures, maps } = extractMaps(artCell);

  // fallback: any remaining pictures in block
  if (!pictures.length) {
    pictures.push(...block.querySelectorAll('picture'));
  }

  const depths = ['8px', '18px', '10px'];
  const classes = ['layer-bg', 'layer-focal', 'layer-object'];

  const limited = pictures.slice(0, 3);
  if (limited.length === 1) {
    block.classList.add('ph-single');
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

  // Stash maps on focal for PE (URLs already rewritten to media_* when live)
  const focalImg = art.querySelector('.layer-focal img');
  if (focalImg && maps.normal) {
    focalImg.dataset.normal = maps.normal;
    if (maps.rough) focalImg.dataset.rough = maps.rough;
    if (maps.height) focalImg.dataset.height = maps.height;
  }

  inner.append(copy, art);
  block.replaceChildren(inner);
}

function armParallax(block) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  // Skip layer parallax when WebGL lighting owns pointer response
  if (block.querySelector('.is-webgl')) return;

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
    if (!armed || block.querySelector('.is-webgl')) return;
    const mx = (e.clientX / window.innerWidth) * 2 - 1;
    layers.forEach(({ el, depth }) => {
      el.style.transform = `translateX(${(mx * depth).toFixed(2)}px)`;
    });
  }, { passive: true });
}

function armLighting(block) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Still allow static soft light at rest? Skip entirely for simplicity.
    return;
  }
  const img = block.querySelector('.layer-focal img');
  if (!img?.dataset.normal) return;

  const maps = {
    normal: img.dataset.normal,
    rough: img.dataset.rough || img.dataset.normal,
    height: img.dataset.height || img.dataset.normal,
  };

  // Idle-import so LCP is the static plate
  const run = () => {
    import('./lite-lighting.js')
      .then((m) => m.default(img, maps))
      .catch(() => {});
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 1800 });
  } else {
    window.setTimeout(run, 400);
  }
}

export default function decorate(block) {
  buildStructure(block);
  armParallax(block);
  armLighting(block);
}
