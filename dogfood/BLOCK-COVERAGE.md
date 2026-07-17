# Block coverage — da-cli 0.6.0 dogfood

**Thesis:** An EDS cert site should exercise the **same scale of block types**
real production sites implement — layout, marketing, FAQ, form, search, modal,
table, tabs, embed, and related PE — not a minimal cards/columns sample.

This matrix is the dogfood **function baseline**. It is derived from observing
common EDS field implementations; it is not an endorsement of any particular
demo property. Prefer Adobe Block Collection (or thin local vehicles) over
copying heavy third-party deps.

**Proof page:** `/kitchen-sink`  
**Gate:** Wave 2 cut requires every **Required** row present + contracts `ok`.

---

## Spectrum tiers

| Tier | Meaning |
|------|---------|
| **Required** | Must exist on code bus + appear on kitchen-sink (or chrome) for Wave 2 cut |
| **Bridge** | Important for Wave 3+ (index/data/workers); may land after Wave 2 MVP |
| **Vertical** | Domain demos (calculators, quizzes) — optional; not required for core CLI cut |
| **Dogfood-extra** | PE/lab blocks unique to this cert site |

---

## Coverage matrix

| Conceptual type | Typical block name | da-cli vehicle | Tier | Status |
|-----------------|--------------------|----------------|------|--------|
| Global header | `header` | `header` | Required | present (chrome) |
| Global footer | `footer` | `footer` | Required | present (chrome) |
| Fragment include | `fragment` | `fragment` | Required | present (code) |
| Display hero | `hero` | `hero` | Required | kitchen-sink |
| Feature cards | `cards` | `cards` | Required | kitchen-sink |
| Multi-column layout | `columns` | `columns` | Required | kitchen-sink |
| Tabs / parallel panels | `tabs` | `tabs` | Required | kitchen-sink |
| Data table | `table` | `table` | Required | kitchen-sink |
| Embed / third-party media | `embed` | `embed` | Required | kitchen-sink |
| FAQ / accordion | `faq` / `accordion` | `accordion` | Required | kitchen-sink |
| Form / lead capture | `form` | `form` | Required | kitchen-sink + sheet; submit → worker stub |
| Site search | `search` | `search` | Required | kitchen-sink (index; no worker) |
| Modal / dialog | `modal` | `modal` | Required | `/modals/sample` + code bus |
| Teaser / promo unit | `teaser` | `teaser` | Required | kitchen-sink |
| Carousel / media strip | `carousel` | `carousel` | Required | kitchen-sink |
| Quote / testimonial | `quote` | `quote` | Required | kitchen-sink |
| Webhook form | `n8n-form` | `n8n-form` **stub** | Bridge | kitchen-sink; worker optional |
| Auth toggle | `auth-toggle` | `auth-toggle` **stub** | Bridge | kitchen-sink; auth-session worker |
| Related articles | `related-articles` | cards+index later | Bridge | deferred Wave 3 |
| Social share | `social-share` | — | Bridge | deferred |
| Product / catalog grid | `product-grid` | cards later | Bridge | deferred |
| Dynamic section loader | `dynamic` | fragment later | Bridge | deferred |
| Quiz / journey / calculators | vertical demos | — | Vertical | out of scope core cut |
| Painterly / dualform / widget | — | PE labs | Dogfood-extra | lab pages |
| Frontier lab (shader hero, scroll rail, VF specimen, live probes) | — | `frontier-hero` · `scroll-rail` · `vf-specimen` · `feature-matrix` | Dogfood-extra | `/frontier` |

### Worker-backed surfaces (stub + document wrangler)

| Typical edge role | Dogfood stub | Blocks |
|-------------------|--------------|--------|
| Form submit endpoint | `workers/form-submit` | `form` submit URL |
| Auth session API | `workers/auth-session` | `auth-toggle` |
| Feed / CDN gate / tools tokens | document only | optional PE |

Full wrangler notes: **`workers/README.md`**.  
Wave 2 cut = **blocks + contracts**. Deployed Cloudflare routes are **not** required.

**Required count (conceptual):** 16 types (incl. chrome)  
**Parity goal:** full Required spectrum — not every vertical demo folder name.

---

## Validation commands (Wave 2 gate)

```bash
ORG=somarc REPO=da-cli-0-6-0

da --org $ORG --repo $REPO audit contracts --prefix / --verify-code --format json \
  | tee dogfood/evidence/wave-2/audit-contracts.json

da --org $ORG --repo $REPO audit full /kitchen-sink --format json \
  | tee dogfood/evidence/wave-2/audit-full-kitchen-sink.json

da --org $ORG --repo $REPO design audit /kitchen-sink --format json \
  | tee dogfood/evidence/wave-2/design-audit-kitchen-sink.json
```

**Cut rule:** contracts `missing=[]` for every Required block name; audit full
errors=0; kitchen-sink metadata `status: cut`.

---

## How to grow the spectrum

1. Classify new field patterns: Required / Bridge / Vertical.  
2. If Required: port a minimal EDS vehicle (Block Collection preferred).  
3. Add one section to kitchen-sink.  
4. Re-run validation; update Status column.  
5. Log learnings if CLI friction appears.

---

## Equivalence notes

| Field name | da-cli vehicle | Rationale |
|------------|----------------|-----------|
| FAQ | `accordion` | Same progressive-disclosure job |
| Finance calculators | n/a | Product demos, not CLI surface proof |
| Webhook form | `n8n-form` stub + worker | Form UI first; real webhook optional |
