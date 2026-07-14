/**
 * n8n-form stub — webhook / edge submit pattern.
 * Production blocks often POST to a webhook or worker URL.
 * Dogfood: render authorable fields + document worker dependency.
 */
export default function decorate(block) {
  const rows = [...block.children];
  const submitHref = block.querySelector('a[href]')?.href || '';

  const note = document.createElement('p');
  note.className = 'n8n-form-stub-note';
  note.innerHTML = submitHref
    ? `Stub form. Submit target: <code>${submitHref}</code>. Run a worker or n8n webhook to complete delivery — see <code>workers/README.md</code>.`
    : 'Stub form. Author a webhook/worker URL in the block. Edge delivery is not on the code bus — see <code>workers/README.md</code>.';

  const form = document.createElement('form');
  form.className = 'n8n-form-stub';
  form.setAttribute('novalidate', '');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = form.querySelector('.n8n-form-status');
    if (status) {
      status.textContent = submitHref
        ? 'Stub: would POST to worker/webhook (not sent). Start wrangler or n8n to exercise a real path.'
        : 'Stub: no submit URL authored.';
    }
  });

  rows.forEach((row, i) => {
    if (i === 0 && row.querySelector('a')) return; // submit URL row
    const cells = [...row.children];
    if (cells.length < 1) return;
    const labelText = cells[0]?.textContent?.trim() || `Field ${i}`;
    const name = labelText.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `field-${i}`;
    const wrap = document.createElement('div');
    wrap.className = 'field-wrapper';
    const label = document.createElement('label');
    label.textContent = labelText;
    label.setAttribute('for', name);
    const input = document.createElement('input');
    input.id = name;
    input.name = name;
    input.type = 'text';
    wrap.append(label, input);
    form.append(wrap);
  });

  const actions = document.createElement('div');
  actions.className = 'button-wrapper';
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'button';
  btn.textContent = 'Submit (stub)';
  actions.append(btn);
  form.append(actions);

  const status = document.createElement('p');
  status.className = 'n8n-form-status';
  status.setAttribute('aria-live', 'polite');

  block.replaceChildren(note, form, status);
}
