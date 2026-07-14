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
| Form / lead capture | `form` | `form` | Required | **adding** |
| Site search | `search` | `search` | Required | **adding** |
| Modal / dialog | `modal` | `modal` | Required | **adding** |
| Teaser / promo unit | `teaser` | `teaser` | Required | **adding** |
| Carousel / media strip | — | `carousel` | Required | kitchen-sink (da-cli ahead) |
| Quote / testimonial | — | `quote` | Required | kitchen-sink (da-cli ahead) |
| Related articles | `related-articles` | `related-articles` or cards+index | Bridge | deferred Wave 3 |
| Social share | `social-share` | `social-share` | Bridge | deferred |
| Product / catalog grid | `product-grid` | cards / future | Bridge | deferred |
| Dynamic section loader | `dynamic` | fragment / custom | Bridge | deferred |
| Auth toggle | `auth-toggle` | — | Vertical | out of scope 0.6.0 core |
| Quiz | `quiz` | — | Vertical | out of scope |
| Journey map | `journey-map` | — | Vertical | out of scope |
| Calculators (×3) | `*-calculator` | — | Vertical | out of scope |
| n8n form | `n8n-form` | form + worker | Vertical | out of scope |
| Painterly hero | — | `painterly-hero` | Dogfood-extra | lab + home |
| Dualform hero | — | `dualform-hero` | Dogfood-extra | lab |
| Widget autoblock | — | `widget` | Dogfood-extra | optional |

**Required count (conceptual):** 16 types (incl. chrome)  
**scdemos total blocks:** 25 (includes verticals)  
**Parity goal:** all Required rows, not 1:1 every scdemos folder name.

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
