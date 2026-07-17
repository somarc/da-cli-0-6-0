/**
 * VF specimen — one font file, infinite voices.
 *
 * A variable-font playground: the browser interpolates between masters on
 * live axes (weight, optical size, softness, wonk). The font stylesheet is
 * injected only when this block decorates, so the global LCP path never
 * pays for it. With JS off the specimen renders in the site serif — still
 * a readable specimen. Authors edit the specimen text and pick a starting
 * voice; the axis registry lives here in code.
 *
 * Author shape (DA): row 1 = specimen text. Optional rows: "voice | Poster".
 *
 * Lab: Frontier (dogfood/LAB-FRONTIER.md). Study: FRONTIER/26 chapter 04.
 */

const FONTS = {
  fraunces: {
    label: 'Fraunces',
    css: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,100..900,0..100,0..1;1,9..144,100..900,0..100,0..1&display=swap',
    family: '"Fraunces", "Cormorant Garamond", georgia, serif',
    axes: [
      { tag: 'wght', label: 'weight', min: 100, max: 900, step: 1 },
      { tag: 'opsz', label: 'optical size', min: 9, max: 144, step: 1 },
      { tag: 'SOFT', label: 'softness', min: 0, max: 100, step: 1 },
      { tag: 'WONK', label: 'wonk', min: 0, max: 1, step: 1 },
    ],
    voices: {
      Display: { wght: 620, opsz: 144, SOFT: 0, WONK: 0 },
      'Old style': { wght: 470, opsz: 26, SOFT: 45, WONK: 1 },
      Poster: { wght: 900, opsz: 144, SOFT: 100, WONK: 0 },
      Wonky: { wght: 560, opsz: 144, SOFT: 20, WONK: 1 },
      Text: { wght: 380, opsz: 12, SOFT: 0, WONK: 0 },
    },
  },
};

function ensureFontCss(key, href) {
  if (document.querySelector(`link[data-vf-font="${key}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.dataset.vfFont = key;
  document.head.append(link);
}

function readAuthoring(block) {
  const rows = [...block.children];
  const config = { fontKey: 'fraunces', voice: 'Display', text: 'Grumpy wizards make toxic brew' };
  rows.forEach((row, i) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      if (key === 'voice') config.voice = value;
      if (key === 'font' && FONTS[value.toLowerCase()]) config.fontKey = value.toLowerCase();
      return;
    }
    if (i === 0) {
      const text = row.textContent.trim();
      if (text) config.text = text;
    }
  });
  return config;
}

export default function decorate(block) {
  const config = readAuthoring(block);
  const font = FONTS[config.fontKey];
  block.textContent = '';

  const stage = document.createElement('div');
  stage.className = 'vf-stage';

  // --- specimen ---
  const specimen = document.createElement('p');
  specimen.className = 'vf-text';
  specimen.textContent = config.text;
  specimen.setAttribute('contenteditable', 'plaintext-only');
  specimen.setAttribute('spellcheck', 'false');
  specimen.setAttribute('aria-label', 'Editable type specimen');
  specimen.style.fontFamily = font.family;

  const hint = document.createElement('p');
  hint.className = 'vf-hint';
  hint.textContent = 'Drag the axes — or click into the specimen and type your own.';

  // --- state ---
  const state = { ...(font.voices[config.voice] || font.voices.Display) };
  const apply = () => {
    specimen.style.fontVariationSettings = font.axes
      .map(({ tag }) => `"${tag}" ${state[tag]}`)
      .join(', ');
  };

  // --- voices ---
  const voicesBar = document.createElement('div');
  voicesBar.className = 'vf-voices';
  voicesBar.setAttribute('role', 'group');
  voicesBar.setAttribute('aria-label', 'Named voices');
  const sliders = {};
  const outputs = {};

  const setVoiceActive = (name) => {
    [...voicesBar.children].forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.voice === name));
    });
  };

  Object.entries(font.voices).forEach(([name, settings]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = name;
    btn.dataset.voice = name;
    btn.setAttribute('aria-pressed', String(name === config.voice));
    btn.addEventListener('click', () => {
      Object.assign(state, settings);
      font.axes.forEach(({ tag }) => {
        sliders[tag].value = state[tag];
        outputs[tag].textContent = state[tag];
      });
      setVoiceActive(name);
      apply();
    });
    voicesBar.append(btn);
  });

  // --- axes ---
  const axesGrid = document.createElement('div');
  axesGrid.className = 'vf-axes';
  font.axes.forEach(({
    tag, label, min, max, step,
  }) => {
    const rowEl = document.createElement('label');
    rowEl.className = 'vf-axis';

    const name = document.createElement('span');
    name.className = 'vf-axis-name';
    name.innerHTML = `${label} <code>${tag}</code>`;

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = state[tag];

    const out = document.createElement('output');
    out.textContent = state[tag];

    slider.addEventListener('input', () => {
      state[tag] = Number(slider.value);
      out.textContent = slider.value;
      setVoiceActive('');
      apply();
    });

    sliders[tag] = slider;
    outputs[tag] = out;
    rowEl.append(name, slider, out);
    axesGrid.append(rowEl);
  });

  const spec = document.createElement('p');
  spec.className = 'vf-spec';
  spec.innerHTML = `One file: <code>${font.label}</code> · ${font.axes.length} live axes · interpolated by the text engine, no extra weights shipped.`;

  stage.append(specimen, hint, voicesBar, axesGrid, spec);
  block.append(stage);

  ensureFontCss(config.fontKey, font.css);
  apply();
}
