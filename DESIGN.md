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
- Block: `painterly-hero` with optional mouse parallax (`prefers-reduced-motion` safe)

### Dualform lab (`/dualform`)

Sibling aesthetic lab for **eds-dualform**: paired silhouette cutouts + CSS mask.

- Block: `blocks/dualform-hero/`
- Assets: `media/dualform/form-a.webp` (substrate), `form-b.webp` (expression)
- Skill: `~/.grok/skills/eds-dualform` (mirrored to agents/claude)

### Site chrome (Parthenon frame)

Three-part pillars (document-relative, grow with page height) in `styles/lazy-styles.css` (≥1100px):

| Member | Asset | Anchor |
|--------|-------|--------|
| Capital | `ionic-capital-{left,right}.jpg` | Top of page |
| Shaft | `ionic-column-{left,right}.jpg` | Grows with document between capital and base |
| Base | `ionic-base-{left,right}.jpg` | Bottom of page |

Horizontal members:

- `ionic-entablature-beam.jpg` — header lintel (`blocks/header/header.css`; Claude may refine)
- `ionic-stylobate-footer.jpg` — footer foundation (`blocks/footer/footer.css`)

Not authorable chrome. Open middle holds editorial content.

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
content bus. Fixtures currently reference **absolute same-site URLs** so Helix
media rewrite can register them (relative `/media/...` was rewriting to
`about:error` in preview). After rewrite, delivery uses `media_<hash>.webp`.

