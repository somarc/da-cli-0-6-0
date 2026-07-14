/**
 * Boilerplate utility hero.
 * Valid module required — an empty hero.js fails decorate and breaks the block.
 * Kitchen-sink uses h2 so the page keeps a single H1 on the painterly title.
 * @param {Element} block
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  if (!picture) {
    block.classList.add('no-image');
  }

  const heading = block.querySelector('h1, h2, h3');
  if (!heading) return;

  const contentDiv = heading.closest('div');
  if (!contentDiv) return;

  const textRow = contentDiv.parentElement;
  if (textRow) textRow.classList.add('hero-text');

  // First plain paragraph before the heading → optional tagline
  const children = [...contentDiv.children];
  const headingIndex = children.indexOf(heading);
  for (let i = 0; i < headingIndex; i += 1) {
    const el = children[i];
    if (el.tagName === 'P' && !el.querySelector('picture, img') && !el.classList.contains('button-container')) {
      el.classList.add('hero-tagline');
      break;
    }
  }
}
