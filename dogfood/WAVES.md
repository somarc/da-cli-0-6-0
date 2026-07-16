# Dogfood waves — operational status

Companion to `ROADMAP.md`. This file is the **execution board**: what is
proven, what is still open, and what Wave 2 kitchen-sink must cover.

**Site:** https://main--da-cli-0-6-0--somarc.aem.live/  
**Rule:** git fixtures → `construct.yaml` → DA put/preview → public proof.  
**CLI runtime:** local `da/da-cli` tree (0.5.x line) until site proves 0.6.0 — no early version bump or `0.6.0` release branch.  
**Content IA:** `dogfood/CONTENT-IA.md` — narrative / proof / learning / lab.  
**Learnings hub:** https://main--da-cli-0-6-0--somarc.aem.live/learnings

---

## Wave status (2026-07-16 23:55 UTC)

Public board: https://main--da-cli-0-6-0--somarc.aem.live/test-plan  
(always update that page’s progress log when this table moves)

| Wave | Claimed in index metadata | Operational truth |
|------|---------------------------|-------------------|
| **1** Foundation | **cut** | **Cut** — full evidence pack in `dogfood/evidence/wave-1/` (2026-07-14) |
| **2** Blocks/audits/design | **cut** | **Cut 2026-07-14 02:51 UTC** — kitchen-sink + CLI surface ledger + evidence re-run (`dogfood/evidence/wave-2/`) |
| **3** Index/routes | **cut** | **Cut 2026-07-14 03:05 UTC** — `/route-matrix` + sheets/index/route evidence (`dogfood/evidence/wave-3/`) |
| **4** Coordination/durability/migration | **cut** | **Cut 2026-07-16** — every drill broke something real first (f022–f025), all fixed+locked same-session; evidence `dogfood/evidence/wave-4/` |
| **5** Failure & recovery injection | in progress | **Opened 2026-07-16** — opening rep (expired auth) recognized/contained/recovered and surfaced **f027** (fixed+locked same-session, 600/600); evidence `dogfood/evidence/wave-5/` |
| **6** Lifecycle | not started | auth flows, skills bootstrap, site create, conditional integrations |

### Wave 5 — pass criteria — **IN PROGRESS (opened 2026-07-16)**

Proof line (ADR 0002 D5): each injected failure **recognized + contained +
recovered** — a structured envelope naming the failure, no damage done, and an
executable recovery that is then *verified against the contract*. Retrying
until a command exits zero is not recovery evidence.

**Banked-specimen policy:** Wave 4 and the hardening pass already ran several
of these drills in the field. A banked row still needs an explicit pointer in
`dogfood/evidence/wave-5/README.md` to the original evidence; fresh reps are
run where the banked drill did not capture the full recognize/contain/recover
triple.

| # | Injection (ADR 0002 D5) | Status | Notes |
|---|--------------------------|--------|-------|
| A1 | unresolved target (no org/repo resolvable) | ⬜ | expect structured refusal + pin-target recovery |
| A2 | missing / expired auth | ✅ **opening rep 2026-07-16** | natural token expiry: one `ok:false` envelope + `da auth login` recovery, exit 1; explicit login from non-TTY shell (f020 path); verification read surfaced **f027** — fixed+locked. Evidence `a2-*` |
| A3 | mutation attempted without `--commit` | ⬜ | banked f015 (job/pipeline gate); fresh rep on content/preview lanes |
| B1 | DA source drift after clone (conflict guard) | ⬜ | clone → remote change → merge must recognize drift |
| B2 | invalid section shape | ⬜ | audit must name the shape violation |
| B3 | missing block assets | ⬜ | audit contracts `--verify-code` must name the missing asset |
| C1 | stale preview / stale live | ⬜ | site freshness must recognize both tiers |
| C2 | orphan + protected hybrid routes | ⬜ | banked f007/f013 (clean gate, probe-failed); fresh containment rep |
| C3 | index absent / configured-unpopulated / queryable | ⬜ | config-native `index config` surfaces (new since Wave 3) distinguish all three states |
| D1 | interrupted job → resume | 🏦 banked | f022 drill (SIGKILL at 7/21 → resume 21/21, attempts all 1) — wave-4 evidence pointer |
| D2 | cancelled job | 🏦 banked | wave-4 `job-cancel-show.json` — workers stop between tasks |
| D3 | pipeline step failure / approval / abort | ◐ | abort banked (f025, real 74-step regen); step-failure + approval reps pending |
| D4 | partial batch-migration failure | ◐ | collision refusal banked (f024); mid-batch partial failure rep pending |

**Wave 5 residue watch:** `status` reports `ok:false` (expired auth) but exits
0 — flagged as a friction candidate during the opening rep; classify
(diagnosis-command semantics vs contract violation) before cut.

### Wave 4 — pass criteria — **CUT 2026-07-16**

Proof line: pipelines green; durable job resumes after interruption; migration validated.

| Surface | Status | Notes |
|---------|--------|-------|
| construct idempotence | ✅ | 2× full regen byte-identical (opening rep); re-proven post-abort-recovery at current CLI (hashes are CLI-version-scoped — see evidence README) |
| `pipeline scaffold` / `status` | ✅ | `pipeline-scaffold.txt` |
| `pipeline run` | ✅ | f014 fixed; 74-step committed regens throughout |
| `pipeline abort` | ✅ | **f025**: abort marker was clobbered by per-step saves — runs completed through their own abort. Fixed+locked; field drill on the real regen: 11 completed, 63 never ran |
| `job init/run/tasks` + resume | ✅ | **f022**: SIGKILL at 7/21 → stale lock crashed resume. Fixed (pid liveness probe); resume → 21/21, attempts all 1 |
| `job cancel` | ✅ | cancelled preview-tree job in the ledger; workers stop between tasks |
| `job promote` / `publish tree` / `job watch` | ✅ | promoted publish-tree job run to completion under `job watch --follow` |
| `preview tree` | ✅ | the durable-job drill WAS `preview tree /learnings` (21 tasks) |
| `migrate import/validate` | ✅ | **f023**: explicit `--path` skipped `.html` normalization — unservable content reported 'imported'. Fixed; validate matches known source |
| `migrate batch/status` | ✅ | **f024**: colliding derived paths silently overwrote. Fixed: up-front refusal + `<url> <daPath>` resolution; mapped batch 3/3 validated |
| `deploy` | ✅ | f022–f025 pages shipped via `deploy pages` — which surfaced **f026** (two bare arrays on json stdout; fixed+locked same-session, re-deploy 6/6 one envelope) |

**Residue (tracked, not blockers):** `pipeline run --job` (durable pipeline runs) unbuilt; f017 envelope migration march (3 field specimens); `publish pages` variadic asymmetry.

### Wave 3 — what it is (plain language)

**Not blocks.** Prove the **map** of the site:

1. **Sheets** — `da content sheets` finds strict DA sheet JSON (`:type: sheet` + `data[]`) — coverage, forms, CLI surface sheet.  
2. **Query index** — published pages → `/query-index.json` via Configuration Service `content/query.yaml`; `index show / validate / query / build`.
3. **Route ownership** — for each path: contentbus / codebus / hybrid / orphan; `route classify / audit / clean`.

**Why:** agents must know whether to edit DA, edit git, or run `route clean` — guessing breaks sites.

**Sheets awareness (open expansion):** Wave 3 cut proves *discovery* of canonical DA sheets, not the full sheet possibility space. As agent/operator awareness grows, expand `content sheets` toward multi-sheet workbooks (`:names`), sheet↔block wiring, richer schema summaries, and other tabular JSON when needed. Do not treat the current inventory as “all site sheets modeled.”

### Wave 3 — pass criteria — **CUT 2026-07-14 03:05 UTC**

| Surface | Status | Notes |
|---------|--------|-------|
| `content sheets` | ✅ | 3 strict DA sheets; expand multi-sheet/wiring later |
| `index show` | ✅ | fields include wave/surface/status |
| `index validate` | ✅ | captured |
| `index query` | ✅ | 24 rows live after matrix publish |
| `index build` | ✅ | job after publish; route-matrix appeared in index |
| `route audit` | ✅ | 54 paths classified |
| Ownership matrix (intentional cases) | ✅ | contentbus, codebus, hybrid, orphan; tools probe gap documented |
| Public proof page `/route-matrix` | ✅ | live 200 + indexed |
| Formal Wave 3 cut stamp | ✅ | this board + evidence README |

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

### Wave 2 — pass criteria — **CUT 2026-07-14 02:51 UTC**

**Spectrum:** field-scale EDS block types → `dogfood/BLOCK-COVERAGE.md`.  
**Ledger:** `/cli-surface` + `tools/wave-2-cli-surface.html` + `data/wave-2-cli-surface.json`.  
**Evidence:** `dogfood/evidence/wave-2/` (README cut stamp).

| Surface | Status | Notes |
|---------|--------|-------|
| Required spectrum (BLOCK-COVERAGE) | ✅ | Present on kitchen-sink + chrome; modal autoblock; workers stubbed |
| `audit full` on kitchen-sink | ✅ | `ok: true`, errors 0, warnings 0 |
| `audit contracts --prefix / --verify-code` | ✅ | 23 pages, 19 blocks, missing=[], autoblocks modal/fragment/widget |
| `block list` / `block inspect` | ⚠️ partial | Built-in contracts sparse; **code-bus verify primary** (documented) |
| `design audit` / `detect` / `token-check` | ✅ | detect clean; audit exit 0; token-check `no-design-tokens` intentional |
| CLI surface ledger | ✅ | `/cli-surface` + interactive tools map |
| f002 / f011 (Wave 2 frictions) | ✅ fixed | envelopes + autoblock inventory |

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

## Friction gate (blocks 0.6.0 cut)

Waves prove coverage. **Frictions prove agentic operability.** Full hang-hat
doc: **`dogfood/FRICTION-GATE-0.6.0.md`**.

| Id | Severity | Status |
|----|----------|--------|
| f008 | Critical | **fixed** — subtree merge path semantics (clone-compatible) |
| f009 | High | **fixed** — refuse out-of-tree + ownership flag messaging |
| f002 | High | **fixed** — design detect/token-check structured envelopes |
| f010 | High | **fixed** — put media URL warn/rewrite/strict |
| f011 | Medium-high | **fixed** — contracts inventory includes autoblocks |

**Friction column clear (2026-07-14 02:31 UTC).** Still do not cut 0.6.0 until **waves** + construct/provenance clear.

---

## Immediate next actions (ordered)

1. ~~Close Wave 1 formally~~ — **done 2026-07-14** (evidence pack)  
2. ~~f008 Critical~~ — **fixed** (subtree merge)  
3. ~~f009 High~~ — **fixed** (ownership flag messaging)  
4. ~~f002 High~~ — **fixed** (design envelopes)  
5. ~~f010 High~~ — **fixed** (media URL policy)  
6. ~~f011~~ — **fixed** (contracts autoblocks); **friction column clear 2026-07-14 02:31 UTC**  
7. ~~Finish Wave 2 formal cut~~ — **done 2026-07-14 02:51 UTC**  
8. ~~Wave 3~~ — **cut 2026-07-14 03:05 UTC** (route matrix + index + ownership)  
9. ~~Wave 4 opened~~ — **2026-07-16** (construct idempotence 2×, f014 fixed+locked, evidence `dogfood/evidence/wave-4/`)
10. **2026-07-16 hardening pass** (4 subagent audits): **f015 Critical fixed** (job run --commit bypass), f016 fixed (code job URL + terminal states), f013 **fixed** (literal-path probe + 403-as-unknown, clean gate closed), f017 seams landed (envelopes: content put / preview page / publish page), f018 fixed (workspace path traversal), f019 fixed (publish/deploy/index safety tiers). 553/553 tests. See `FRICTION-GATE-0.6.0.md`.
11. ~~Wave 4 remaining~~ — **cut 2026-07-16**: durable jobs (f022 SIGKILL/resume), migrate (f023 path normalization, f024 collision refusal), pipeline abort (f025 marker clobber) — every completion drill found and fixed a real friction. 575/575 tests.
12. ~~Wave 5 opened~~ — **2026-07-16**: opening rep A2 (expired auth) recognized/contained/recovered; the recovery verification itself surfaced **f027** (content read-listing success paths were bare arrays — fixed+locked same-session, 600/600). Drill matrix on this board; evidence `dogfood/evidence/wave-5/`.
13. **Wave 5 remaining drills** (A1, A3, B1–B3, C1–C3, D3/D4 fresh reps) + banked-pointer README rows; then Wave 6; then 0.6.0 version/branch when site proves

---

## Anti-patterns for this release track

- Calling Wave 2 “cut” because `/blocks` has two blocks  
- Aesthetic lab pages (`/dualform`) counting as block-surface proof without audits  
- Hand-authoring only in DA (fixtures go stale)  
- Adding blocks without `audit contracts --verify-code`  
- Expanding scope to Wave 4–6 before kitchen-sink is green  
