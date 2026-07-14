# Edge workers (Wrangler stubs) — da-cli 0.6.0 dogfood

**scdemos/demo** backs several block types with **Cloudflare Workers**
(`workers/*` + `wrangler.toml` + npm scripts). This dogfood site **stubs** that
layer so:

1. Code-bus still has the **block** (kitchen-sink / contracts can see it).  
2. Operators know **which surface needs a worker**.  
3. Local `wrangler dev` can prove submit/session **without** real Slack/Auth secrets.

This is **not** production CDN wiring. Routes and `account_id` are placeholders.

---

## scdemos worker map (oracle)

| Worker (scdemos) | Typical consumers | What it does |
|------------------|-------------------|--------------|
| `contact_us` | `form` submit URL | POST form JSON → e.g. Slack |
| `auth` | `auth-toggle`, gated chrome | Session / Access-style auth API |
| `feed` | dynamic / feed tools | Content feed proxy |
| `cdn` | gated pages | Edge HTML gating |
| `cloneit_token` | tools | Token mint for cloneit |

Dogfood stubs implement **shape**, not product integrations.

---

## Local stubs in this repo

```text
workers/
  README.md                 ← you are here
  form-submit/              ← stub POST endpoint for form block
    index.js
    wrangler.toml
  auth-session/             ← stub GET session JSON for auth-toggle
    index.js
    wrangler.toml
```

| Stub | Default local URL | Block consumers |
|------|-------------------|-----------------|
| `form-submit` | `http://127.0.0.1:8787/` | `form` (optional 2nd link = submit) |
| `auth-session` | `http://127.0.0.1:8788/` | `auth-toggle` stub |

---

## Prerequisites

```bash
# from repo root (optional — only when exercising workers)
npm install -D wrangler
```

Cloudflare account optional for **local** `wrangler dev`. Deploy needs account + routes.

---

## Dev commands

```bash
# Form submit stub (port 8787)
npm run worker:form-submit

# Auth session stub (port 8788)
npm run worker:auth-session
```

Smoke:

```bash
# form-submit
curl -s -X POST http://127.0.0.1:8787/ \
  -H 'content-type: application/json' \
  -d '{"data":{"name":"Marc","email":"m@example.com","message":"dogfood"}}'

# auth-session
curl -s http://127.0.0.1:8788/auth/session
```

Both return JSON with `"stub": true`.

---

## Wiring form block to the stub

Kitchen-sink form currently loads definition only (sheet). To exercise submit:

1. Run `npm run worker:form-submit`.  
2. Author form block with **two** links:
   - definition: `/data/contact-form.json`
   - submit: `http://127.0.0.1:8787/` (local) or your deployed worker URL  
3. Preview page; submit; expect `{ ok: true, stub: true, … }`.

Production scdemos uses a real route (e.g. `demo.bbird.live/contact-us/*`) and secrets (`SLACK_WEBHOOK_URL`). **Do not** commit secrets here — use `wrangler secret put`.

---

## Deploy sketch (optional)

```bash
# set account_id + routes in wrangler.toml first
npx wrangler deploy --config ./workers/form-submit/wrangler.toml
npx wrangler secret put SLACK_WEBHOOK_URL --config ./workers/form-submit/wrangler.toml
```

Custom domain routes require zone access in the Cloudflare account (same pattern as scdemos).

---

## What 0.6.0 validates vs stubs

| Layer | Validated by da-cli dogfood? |
|-------|------------------------------|
| Block decorate + code-bus assets | **Yes** — kitchen-sink + `audit contracts` |
| DA sheet → form fields | **Yes** — `/data/contact-form.json` |
| Worker POST contract (local stub) | **Optional** — wrangler dev smoke |
| Real Slack / Cloudflare Access / CDN gate | **Out of scope** — document only |
| `da` surface for deploy workers | Future — not a Wave 2 required-core gate |

Wave 2 cut = **blocks + contracts**. Worker stubs are **documented PE** so form/auth types stay honest about edge dependencies.

---

## Adding another stub

1. Copy `workers/form-submit/` → `workers/<name>/`.  
2. Implement CORS + JSON shape matching the block.  
3. Add `npm run worker:<name>` scripts.  
4. Row in `dogfood/BLOCK-COVERAGE.md` (Worker column).  
5. Learning page if CLI friction appears while wiring.

---

## Reference

- Oracle workers: `aem-code/scdemos/demo/workers/`  
- Oracle package scripts: `scdemos/demo/package.json` (`dev:*` / `deploy:*`)  
- Block matrix: `dogfood/BLOCK-COVERAGE.md`  
