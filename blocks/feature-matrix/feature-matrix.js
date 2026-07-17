/**
 * Feature matrix — live self-audit of the rendering engine.
 * Every row is a real CSS.supports() / API probe run right now, in this
 * browser, against features this lab actually uses. Authors never write
 * probes; the registry lives here. Optional authored rows filter by kind
 * ("css" / "js").
 *
 * Lab: Frontier (dogfood/LAB-FRONTIER.md). Study: FRONTIER/26 chapter 06.
 */

const PROBES = [
  ['Scroll timelines', 'css', () => CSS.supports('animation-timeline', 'scroll()')],
  ['View timelines', 'css', () => CSS.supports('animation-timeline', 'view()')],
  ['animation-range', 'css', () => CSS.supports('animation-range', 'entry 0% exit 100%')],
  ['ViewTransition API', 'js', () => 'startViewTransition' in document],
  ['view-transition-name', 'css', () => CSS.supports('view-transition-name', 'x')],
  ['WebGL2', 'js', () => !!document.createElement('canvas').getContext('webgl2')],
  ['WebGPU', 'js', () => 'gpu' in navigator],
  ['OKLCH color', 'css', () => CSS.supports('color', 'oklch(0.7 0.2 200)')],
  ['Display-P3', 'css', () => CSS.supports('color', 'color(display-p3 1 0 0)')],
  ['color-mix()', 'css', () => CSS.supports('background', 'color-mix(in oklch, red, blue)')],
  ['@property (typed vars)', 'js', () => 'registerProperty' in CSS],
  [':has() selector', 'css', () => CSS.supports('selector(:has(*))')],
  ['Container queries', 'css', () => CSS.supports('container-type', 'inline-size')],
  ['Anchor positioning', 'css', () => CSS.supports('anchor-name', '--a')],
  ['position-area', 'css', () => CSS.supports('position-area', 'block-start')],
  ['Popover API', 'js', () => 'popover' in HTMLElement.prototype],
  ['interpolate-size', 'css', () => CSS.supports('interpolate-size', 'allow-keywords')],
  ['calc-size()', 'css', () => CSS.supports('width', 'calc-size(auto, size)')],
  ['::details-content', 'css', () => CSS.supports('selector(::details-content)')],
  ['field-sizing', 'css', () => CSS.supports('field-sizing', 'content')],
  ['text-wrap: balance', 'css', () => CSS.supports('text-wrap', 'balance')],
  ['text-wrap: pretty', 'css', () => CSS.supports('text-wrap', 'pretty')],
  ['Individual transforms', 'css', () => CSS.supports('scale', '1') && CSS.supports('rotate', '1deg')],
  ['backdrop-filter', 'css', () => CSS.supports('backdrop-filter', 'blur(1px)')],
  ['ScrollTimeline class', 'js', () => 'ScrollTimeline' in window],
  ['IntersectionObserver', 'js', () => 'IntersectionObserver' in window],
];

function readFilter(block) {
  const kinds = new Set();
  [...block.children].forEach((row) => {
    const text = row.textContent.trim().toLowerCase();
    if (text === 'css' || text === 'js') kinds.add(text);
  });
  return kinds;
}

export default function decorate(block) {
  const kinds = readFilter(block);
  block.textContent = '';

  const probes = kinds.size
    ? PROBES.filter(([, kind]) => kinds.has(kind))
    : PROBES;

  const grid = document.createElement('div');
  grid.className = 'fm-grid';
  grid.setAttribute('role', 'list');

  let passed = 0;
  probes.forEach(([name, kind, test]) => {
    let ok = false;
    try {
      ok = !!test();
    } catch (e) {
      ok = false;
    }
    if (ok) passed += 1;

    const item = document.createElement('div');
    item.className = `fm-probe ${ok ? 'fm-pass' : 'fm-fail'}`;
    item.setAttribute('role', 'listitem');

    const dot = document.createElement('span');
    dot.className = 'fm-dot';
    dot.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'fm-label';
    label.textContent = name;

    const tag = document.createElement('small');
    tag.className = 'fm-kind';
    tag.textContent = kind.toUpperCase();

    const state = document.createElement('span');
    state.className = 'fm-state';
    state.textContent = ok ? 'active' : 'missing';

    item.append(dot, label, tag, state);
    grid.append(item);
  });

  const score = document.createElement('p');
  score.className = 'fm-score';
  const total = probes.length;
  score.innerHTML = `This engine passes <strong>${passed} / ${total}</strong> probes — every lit dot is a capability exercised live on this page.`;

  block.append(grid, score);
}
