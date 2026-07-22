# DESIGN.md — da-cli 0.6.0 dogfood site

## Visual direction: Renderaissance

**Provenance:** eds-renderaissance skill  
**Reference:** https://html.non.io/hydroponics/  
**Effect depth:** collage (static paper + painterly layers + mouse parallax)  
**Brand:** da-cli 0.6.0 — agent-first operator dogfood / proof site

### Intent

Academic paper editorial for a release-proof site: cream paper field, cobalt ink
typography, terracotta links, chartreuse as the “provably cut” highlighter.
Quiet authority — research journal of operations, not SaaS chrome.

### Personality

- Curious, precise, stewarding trust
- Evidence over assertion
- Calm operator craft

### Domain metaphors

- Provenance trails as botanical plates
- Contract envelopes as catalog entries
- Routes and previews as cultivated plots of evidence

### Tokens

See `:root` in `styles/styles.css` (`--rr-*` and boilerplate aliases).

### Type

- Display: Cormorant Garamond
- Body: Alegreya
- Labels / nav: Jost

### Imagery (collage)

- `media/renderaissance/hero-bg.webp` — paper wash + route/schematic stains
- `media/renderaissance/hero-figure.webp` — profile with provenance roots / botanical plates from the mind
- `media/renderaissance/hero-object.webp` — catalog book under glass with content-tree roots
- `media/renderaissance/mascot-cupid.webp` — classical marble Cupid (Eros) mark for header nav brand
- `media/renderaissance/cli-surface-ledger.webp` — unique ledger/survey desk plate for `/cli-surface` (not recycled wave chart)
- Block: `painterly-hero` with optional mouse parallax (`prefers-reduced-motion` safe)

### Site mascot

**Cupid** — quiet neoclassical marble putto as the cert-site logo mark. Academic plate
mood (cream paper, cobalt shadow, soft terracotta blush), not baroque gold kitsch.
Authored in the DA `/nav.html` source with an absolute content.da.live media URL.

### Dualform lab (`/dualform`)

Sibling aesthetic lab for **eds-dualform**: paired silhouette cutouts + CSS mask.

- Block: `blocks/dualform-hero/`
- Assets: `media/dualform/form-a.webp` (substrate), `form-b.webp` (expression)
- Skill: `~/.grok/skills/eds-dualform` (mirrored to agents/claude)
- PE: morphing soft hole under the cursor reveals expression through substrate

### Site chrome (Dualform Ionic gutters)

Quiet dual-state columns in the side margins (≥1100px), not document-stretched plates:

| Layer | Asset | Role |
|-------|-------|------|
| A (substrate) | `media/dualform/column-a.webp` | Bare Ionic cutout |
| B (expression) | `media/dualform/column-b.webp` | Living dual-state of the same silhouette |

- Injected by `scripts/dualform-gutters.js` + `styles/dualform-gutters.css`
- Same morphing-hole PE as dualform-hero (stage-local; velocity stretches the hole)
- Fixed-height fragments near the header; soft dissolve into paper
- Right gutter is a horizontal flip of the left pair

### Multi-agent

Skill `eds-renderaissance` is model-agnostic (prompts + EDS contracts). This site’s
first asset pack was produced with Grok Imagine + the Hydroponics style reference;
any agent with image generation can regenerate layers from the same briefs.

### Anti-goals

- Glassmorphism, neon cyber, baroque gold
- WebGL / ink shaders on this pass (collage depth only — no `lit`)
- Rewriting dogfood narrative content for “marketing voice”

### Media delivery note

Homepage collage assets live in git (`media/renderaissance/`) and on the DA
content bus. DA source uses **absolute same-site URLs** so Helix
media rewrite can register them (relative `/media/...` was rewriting to
`about:error` in preview). After rewrite, delivery uses `media_<hash>.webp`.

