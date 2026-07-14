/**
 * auth-toggle stub — scdemos spectrum (session / Access).
 * Real scdemos implementation talks to workers/auth.
 * Dogfood: show anonymous state + document wrangler path.
 */
export default async function decorate(block) {
  const endpoint = block.querySelector('a[href]')?.href
    || 'http://127.0.0.1:8788/auth/session';

  const root = document.createElement('div');
  root.className = 'auth-toggle-stub';

  const status = document.createElement('p');
  status.className = 'auth-toggle-status';
  status.textContent = 'Checking session stub…';

  const hint = document.createElement('p');
  hint.className = 'auth-toggle-hint';
  hint.innerHTML = `Worker endpoint: <code>${endpoint}</code>. Local: <code>npm run worker:auth-session</code>. See <code>workers/README.md</code>.`;

  root.append(status, hint);
  block.replaceChildren(root);

  try {
    const resp = await fetch(endpoint, { credentials: 'omit' });
    const data = await resp.json().catch(() => ({}));
    if (data.stub || data.anonymous || data.authenticated === false) {
      status.textContent = data.message
        || 'Anonymous (stub). Deploy real auth worker for signed-in state.';
    } else if (data.authenticated) {
      status.textContent = `Signed in as ${data.user?.email || data.user?.name || 'user'}.`;
    } else {
      status.textContent = `Session response HTTP ${resp.status} (not a known stub shape).`;
    }
  } catch {
    status.textContent = 'Worker unreachable — start npm run worker:auth-session or update endpoint.';
  }
}
