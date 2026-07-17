/**
 * Scroll rail — the scrollbar is a timeline.
 *
 * Vertical scroll drives a horizontal card rail through a named CSS view
 * timeline (animation-timeline) — the animation runs on the compositor,
 * zero scroll listeners. Engines without scroll-driven animations (and
 * reduced-motion users) get the same cards as a static stack.
 *
 * Author shape (DA): each row = one card (index line / heading / body).
 *
 * Lab: Frontier (dogfood/LAB-FRONTIER.md). Study: FRONTIER/26 chapter 02.
 */

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function supportsViewTimeline() {
  return CSS.supports('animation-timeline', 'view()')
    && CSS.supports('animation-range', 'entry 0% exit 100%');
}

function classifyCard(cell) {
  let sawHeading = false;
  [...cell.children].forEach((el) => {
    if (/^H[2-4]$/.test(el.tagName)) {
      sawHeading = true;
      el.classList.add('sr-title');
      return;
    }
    if (el.tagName === 'P') {
      el.classList.add(sawHeading ? 'sr-body' : 'sr-index');
    }
  });
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const track = document.createElement('div');
  track.className = 'sr-track';

  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    classifyCard(cell);
    const card = document.createElement('article');
    card.className = 'sr-card';
    card.append(...cell.childNodes);
    track.append(card);
  });

  block.textContent = '';

  const rail = supportsViewTimeline() && !prefersReducedMotion();
  if (!rail) {
    block.classList.add('sr-static');
    block.append(track);
    return;
  }

  block.classList.add('sr-rail');

  const sticky = document.createElement('div');
  sticky.className = 'sr-sticky';

  const progress = document.createElement('div');
  progress.className = 'sr-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.append(document.createElement('i'));

  sticky.append(progress, track);
  block.append(sticky);
}
