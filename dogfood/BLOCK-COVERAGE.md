# Block coverage oracle — scdemos/demo → da-cli 0.6.0

**Oracle:** https://github.com/scdemos/demo (local: `aem-code/scdemos/demo`)  
**Thesis:** scdemos/demo is the best current catalog of **block types an EDS site
has realistically implemented**. The 0.6.0 dogfood must cover that *scale* of
library — not every vertical calculator — and **validate** those blocks with
`da audit` / `da block` / contracts on a living page.

**Proof page:** `/kitchen-sink`  
**Gate:** Wave 2 cut requires every **Required** row `present` + contracts `ok`.

---

## Spectrum tiers

| Tier | Meaning |
|------|---------|
| **Required** | Must exist on code bus + appear on kitchen-sink (or chrome) for Wave 2 cut |
| **Bridge** | Important for Wave 3+ (index/data); may land after Wave 2 MVP |
| **Vertical** | Domain demos (finance, journey, n8n) — optional Wave 6 / not required for core CLI cut |
| **Dogfood-extra** | PE/lab blocks unique to this cert site |

---

## Coverage matrix

| Conceptual type (industry / scdemos) | scdemos block | da-cli vehicle | Tier | Status |
|--------------------------------------|---------------|----------------|------|--------|
| Global header | `header` | `header` | Required | present (chrome) |
| Global footer | `footer` | `footer` | Required | present (chrome) |
| Fragment include | `fragment` | `fragment` | Required | present (code) |
| Display hero | `hero` | `hero` | Required | kitchen-sink |
| Feature cards | `cards` | `cards` | Required | kitchen-sink |
| Multi-column layout | `columns` | `columns` | Required | kitchen-sink |
| Tabs / parallel panels | `tabs` | `tabs` | Required | kitchen-sink |
| Data table | `table` | `table` | Required | kitchen-sink |
| Embed / third-party media | `embed` | `embed` | Required | kitchen-sink |
| FAQ / accordion | `faq` | `accordion` *(equiv)* | Required | kitchen-sink |
| Form / lead capture | `form` | `form` | Required | kitchen-sink + sheet; **submit → worker stub** |
| Site search | `search` | `search` | Required | kitchen-sink (index; no worker) |
| Modal / dialog | `modal` | `modal` | Required | `/modals/sample` + code bus |
| Teaser / promo unit | `teaser` | `teaser` | Required | kitchen-sink |
| Carousel / media strip | — | `carousel` | Required | kitchen-sink (da-cli ahead) |
| Quote / testimonial | — | `quote` | Required | kitchen-sink (da-cli ahead) |
| n8n / webhook form | `n8n-form` | `n8n-form` **stub** | Bridge | kitchen-sink; worker optional |
| Auth toggle | `auth-toggle` | `auth-toggle` **stub** | Bridge | kitchen-sink; **auth-session worker** |
| Related articles | `related-articles` | cards+index later | Bridge | deferred Wave 3 |
| Social share | `social-share` | — | Bridge | deferred |
| Product / catalog grid | `product-grid` | cards later | Bridge | deferred |
| Dynamic section loader | `dynamic` | fragment later | Bridge | deferred |
| Quiz / journey / calculators | vertical demos | — | Vertical | out of scope core cut |
| Painterly / dualform / widget | — | PE labs | Dogfood-extra | lab pages |

### Worker-backed surfaces (stub + document wrangler)

| scdemos worker | Dogfood stub | Blocks |
|----------------|--------------|--------|
| `contact_us` | `workers/form-submit` | `form` submit URL |
| `auth` | `workers/auth-session` | `auth-toggle` |
| `feed` / `cdn` / `cloneit_token` | document only | tools / gated PE |

Full wrangler notes: **`workers/README.md`**.  
Wave 2 cut = **blocks + contracts**. Deployed Cloudflare routes are **not** required.

**Required count (conceptual):** 16 types (incl. chrome)  
**scdemos total blocks:** 25 (includes verticals)  
**Parity goal:** all Required rows + honest stubs for worker-backed bridge types.

---

## Validation commands (Wave 2 gate)

```bash
ORG=somarc REPO=da-cli-0-6-0

# 1) Every required block class on kitchen-sink has code-bus assets
da --org $ORG --repo $REPO audit contracts --prefix / --verify-code --format json \
  | tee dogfood/evidence/wave-2/audit-contracts.json

# 2) Kitchen-sink structure + semantics clean
da --org $ORG --repo $REPO audit full /kitchen-sink --format json \
  | tee dogfood/evidence/wave-2/audit-full-kitchen-sink.json

# 3) Design surface (f002 open until envelope fixed)
da --org $ORG --repo $REPO design audit /kitchen-sink --format json \
  | tee dogfood/evidence/wave-2/design-audit-kitchen-sink.json

# 4) Spot-inspect known contracts
da --org $ORG --repo $REPO block list --format json
```

**Cut rule:** contracts `missing=[]` for every Required block name; audit full
errors=0; kitchen-sink metadata `status: cut`.

---

## How to grow when scdemos adds a type

1. Classify: Required / Bridge / Vertical.  
2. If Required: port minimal EDS vehicle (prefer Block Collection over scdemos deps).  
3. Add one section to kitchen-sink.  
4. Re-run validation commands; update this matrix Status column.  
5. Log learnings if CLI friction appears.

---

## Equivalence notes

| scdemos name | da-cli name | Rationale |
|--------------|-------------|-----------|
| `faq` | `accordion` | Same progressive-disclosure job; Block Collection accordion is the dogfood vehicle |
| finance calculators | n/a | Product demos, not CLI surface proof |
| `n8n-form` | `form` + worker later | Form authoring/delivery first; workflow backend Wave 4+ |

Oracle repo may rename/add blocks; **conceptual type** is stable, folder names less so.
