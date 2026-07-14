# Dogfood waves — operational status

Companion to `ROADMAP.md`. This file is the **execution board**: what is
proven, what is still open, and what Wave 2 kitchen-sink must cover.

**Site:** https://main--da-cli-0-6-0--somarc.aem.live/  
**Rule:** git fixtures → `construct.yaml` → DA put/preview → public proof.  
**Content IA:** `dogfood/CONTENT-IA.md` — narrative / proof / learning / lab.  
**Learnings hub:** https://main--da-cli-0-6-0--somarc.aem.live/learnings

---

## Wave status (2026-07-14 01:30 UTC)

Public board: https://main--da-cli-0-6-0--somarc.aem.live/test-plan  
(always update that page’s progress log when this table moves)

| Wave | Claimed in index metadata | Operational truth |
|------|---------------------------|-------------------|
| **1** Foundation | **cut** | **Cut** — full evidence pack in `dogfood/evidence/wave-1/` (2026-07-14) |
| **2** Blocks/audits/design | kitchen-sink `in-progress` | **In progress** — field-scale kitchen-sink + contracts green for present blocks; f002 design detect open; not cut |
| **3** Index/routes | coverage `in-progress` | Index + sheet + orphan demo exist; reindex after new routes; full matrix incomplete |
| **4–6** | not started | deferred |

### Wave 1 — pass criteria (ADR 0002) — **CUT 2026-07-14**

A surface is cut when we have: (1) CLI run, (2) observable outcome, (3) evidence file.

| Surface | Status | Evidence |
|---------|--------|----------|
| `status` | ✅ | `status.json` |
| `resolve` | ✅ | `resolve-index.json` |
| `content list` / `tree` | ✅ | `content-list.json`, `content-tree.json` |
| `content get` / `put` | ✅ | construct + fixtures; get during pack |
| `preview` / `publish` | ✅ | live site + construct history |
| `site freshness` | ✅ | `freshness.json` |
| `site info` / `doctor` | ✅ | `site-info.json`, `site-doctor.json` |
| `site model` | ✅ | `site-model.json` |
| `site pin-target` | ✅ | `pin-target.json` + `.da.json` |
| `content clone` / `diff` / `merge` | ✅ | clone-data, diff, merge txt |
| `content put-tree` dry-run | ✅ | `content-put-tree-dryrun.txt` |
| `content versions` | ✅ | `content-versions-index.json` (empty history, command OK) |
| construct `--dry-run` | ✅ | `construct-dry-run.json` (42 steps) |
| `aem up` smoke | ✅ | `aem-up-smoke.txt` (HTTP 200) |
| evidence pack | ✅ | this folder + README |

**Mitigation shipped:** `da site pin-target` pins org/repo so `site info` without
positional args no longer drifts to another project.

### Wave 2 — pass criteria

**Spectrum:** field-scale EDS block types → `dogfood/BLOCK-COVERAGE.md`.  
Wave 2 is not cut until every **Required** conceptual type is present and contracts-ok.

| Surface | Status | Notes |
|---------|--------|-------|
| Required spectrum (BLOCK-COVERAGE) | ⬜ | form, search, modal, teaser added; faq≡accordion |
| `audit full` on kitchen-sink | ⬜ | zero errors preferred |
| `audit contracts --prefix / --verify-code` | ⬜ | all Required blocks js/css 200, missing=[] |
| `block list` / `block inspect` | ⚠️ | built-in contracts sparse; code-bus verify still primary |
| `design audit` / `detect` / `token-check` | ⚠️ | f002 open for detect envelope |
| `code status` / `verify` | ⬜ | after new blocks land |
| Finding #2 `design detect` envelope | open | structured no-design-system result |

---

## Wave 2 kitchen-sink (primary content work)

**Route:** `/kitchen-sink`  
**Fixture:** `dogfood/fixtures/kitchen-sink.html`  
**Purpose:** one page that forces `block` / `audit` / `design` / `code` to see a
**modern site module spectrum**, not two boilerplate layouts.

### Industry → EDS module map

See also `~/.grok/skills/design-industry-language/references/site-modules.md`.

| # | Industry module | Role on modern site | EDS vehicle (this repo) | Priority |
|---|-----------------|---------------------|-------------------------|----------|
| 1 | Global nav | wayfinding | `header` (site chrome) | have |
| 2 | Global footer | legal / utility | `footer` | have |
| 3 | Display hero / brand plate | first impression | `painterly-hero` (Renderaissance) | have |
| 4 | Utility / product hero | alt hero shape | `hero` (boilerplate) | have |
| 5 | Feature grid / cards | benefits, surfaces | `cards` | have |
| 6 | Multi-column layout | split narrative | `columns` | have |
| 7 | Prose / default content | body reading | default content (no block) | have |
| 8 | Fragment include | shared islands | `fragment` | have |
| 9 | Dual-state specimen | aesthetic PE lab | `dualform-hero` (link or embed section) | have |
| 10 | Accordion / FAQ | progressive disclosure | `accordion` | **add** |
| 11 | Tabs | parallel panels | `tabs` | **add** |
| 12 | Carousel / media strip | multi-asset browse | `carousel` | **add** |
| 13 | Table / comparison | structured facts | `table` or comparison | **add** |
| 14 | Embed | external media/widget | `embed` | **add** |
| 15 | Form | conversion / capture | `form` (sheet-backed) | **add** (Wave 2–3) |
| 16 | Quote / testimonial band | social proof | default content + section style | kitchen-sink section |
| 17 | CTA band | conversion strip | columns + buttons | kitchen-sink section |
| 18 | Section metadata styles | layout variants | section metadata | kitchen-sink |
| 19 | Page metadata | SEO head | `metadata` | every page |
| 20 | Video / cinematic hero | kinetic splash | optional `video-hero` port | later |

**Wave 2 MVP kitchen-sink** ships rows **1–11 + 16–19** with audits green.  
Form/embed/table can land in the same page as stretch if code ports cleanly.

### Construction steps (Wave 2)

1. Port missing block folders from Block Collection / boilerplate (accordion, tabs, carousel, …)  
2. Style lightly to Renderaissance tokens (paper/ink) — no second brand system  
3. Author `kitchen-sink.html` fixture with every block present once  
4. Extend `construct.yaml` put+preview for `/kitchen-sink`  
5. Run and store:  
   - `da audit full /kitchen-sink --format json`  
   - `da audit contracts --prefix / --verify-code --format json`  
   - `da design audit https://main--…/kitchen-sink --format json`  
   - `da block inspect <each new block>` where contracts exist  
6. Update `/blocks` narrative to point at kitchen-sink as the proof surface  
7. Mark Wave 2 cut only when contracts verify **all** kitchen-sink block assets  

---

## Evidence convention

```text
dogfood/evidence/
  wave-1/
    README.md          # checklist + command log
    status.json
    site-doctor.json
    …
  wave-2/
    audit-full-kitchen-sink.json
    audit-contracts.json
```

Capture with:

```bash
da --org somarc --repo da-cli-0-6-0 --format json <cmd> \
  | tee dogfood/evidence/wave-N/<name>.json
```

---

## Immediate next actions (ordered)

1. **Close Wave 1 formally** — pin target, run remaining content verbs, write evidence pack, dry-run construct pipeline  
2. **Author site-modules spectrum** into design-industry-language (done in skill twins)  
3. **Build kitchen-sink fixture + port blocks** (Wave 2 main content)  
4. **Wire construct.yaml + audits** until Wave 2 gate is honest  
5. Only then advance Wave 3 (index automation, route matrix)

---

## Anti-patterns for this release track

- Calling Wave 2 “cut” because `/blocks` has two blocks  
- Aesthetic lab pages (`/dualform`) counting as block-surface proof without audits  
- Hand-authoring only in DA (fixtures go stale)  
- Adding blocks without `audit contracts --verify-code`  
- Expanding scope to Wave 4–6 before kitchen-sink is green  
