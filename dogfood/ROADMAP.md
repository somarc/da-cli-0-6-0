# da-cli-0-6-0 Dogfood Roadmap

This site is the certifying dogfood run for the **da-cli 0.6.0** release. Per
ADR 0002 (dogfood rubric) and ADR 0003 (versioned demonstration sites), **0.6.0
ships only when this site is provably cut**: every `required-core` +
`required-destructive` CLI surface exercised with passing, provable evidence,
each artifact activated and verified by checked-in DA-native pipelines, and
each finding turned into a primitive fix + locking test (the flywheel).

## Source model — DA is authoritative

DA is the sole source of truth for authored HTML, JSON sheets, navigation,
footer, and media references. Git owns code, declarative certification and
promotion pipelines, and immutable historical evidence. It does not carry an
authored-content mirror.

`dogfood/certify.yaml` activates existing DA source on preview and proves site
model, doctor, block contracts, key-page audits, freshness, sitemap, and code.
`dogfood/promote.yaml` is the separate human-approved live promotion and index
verification boundary. Neither pipeline uploads authored content from Git.

All content and preview operations use the local da-cli. Raw DA/Helix admin API
calls and repository-authored content fixtures are outside the certification
contract. Historical evidence may mention the retired fixture-fed construct;
those immutable observations are retained as history, not as current guidance.

## Coverage spine (ADR 0002 D3 — no unclassified surface)

| Family | Class | Wave |
|--------|-------|------|
| `config`, `status`, `resolve`, `route` | required-core | 1 |
| `content` (get/put/put-tree/tree/list/clone/diff/commit/push/merge/versions/sheets) | required-core | 1–3 |
| `preview`, `publish`, `deploy` | required-core / required-destructive | 1, 4 |
| `site` (info/model/freshness/doctor/reconcile), `up` | required-core | 1 |
| `block`, `audit`, `design` | required-core | 2 |
| `index` | required-core (+ Config-Service gap = finding) | 3 |
| `pipeline`, `job`, `migrate` | required-core / required-destructive | 4 |
| `code` (sync/status/verify/purge/sidekick) | required-core | 2, 5 |
| `auth`, `skills` | lifecycle | 6 |
| `commerce`, `stardust` | external-conditional | 6 |
| `site create` | required-destructive (2nd disposable site) | 6 |

## Waves

**Wave 1 — Foundation & core loop**
- Content: index control panel (✅ cut), CLI-authored DA `nav`/`footer`, plus certification provenance for index/nav/footer.
- Surfaces: `config`, `status`, `resolve`, `content put/get/list/tree`, `preview page`, `publish page`, `site info`, `site freshness`, `up`.
- Proof: preview + live URLs, `.plain.html` verified, freshness gate green.

**Wave 2 — Blocks, audits, design, media**
- **Spectrum:** field-scale EDS block coverage → `dogfood/BLOCK-COVERAGE.md`
  (Required tier = Wave 2 cut; vertical product demos out of core scope).
- Content: **kitchen-sink page** (`/kitchen-sink`) exercising Required spectrum
  (hero, cards, columns, tabs, table, embed, accordion/faq, form, search, modal,
  teaser, carousel, quote, …). See also design-industry-language `site-modules.md`.
- Surfaces: `block list/inspect`, `audit semantics/blocks/full/contracts --verify-code`, `design detect/rules/audit/token-check`, `content put-tree`, `code sync/verify`.
- Proof: audits pass on kitchen-sink; contracts verify **all Required** block assets.
- Status board: `dogfood/WAVES.md` (Wave 2 is not “cut” until BLOCK-COVERAGE Required rows are green).

**Wave 3 — Structured data & route ownership**
- Content: a DA sheet (`index.json`), nested pages, deliberate route cases (contentbus, codebus, hybrid, orphan, probe-failed). Configure index via Configuration Service (ADR 0002 D6); record `da index` repo-local limitation as a finding.
- Surfaces: `content sheets`, `index show/validate/query`, `route classify/audit/clean`.
- Proof: query-index behavior on preview/live; full route-ownership table.

**Wave 4 — Coordination, durability, migration**
- Content: migration source + expected result; enough pages for tree/batch/durable-job behavior.
- Surfaces: `pipeline scaffold/run/status/abort`, `job init/run/watch/cancel/tasks`, `migrate import/batch/status/validate`, `preview tree`, `publish tree`, `deploy`.
- Proof: pipelines green; durable job resumes after interruption; migration validated.
- **Riverboat Gambler certification slice:** keep the flag hidden but supported;
  prove trusted local Git/npm/outside-agent composition without making unsafe
  execution part of normal construction. Public proof:
  `/waves/4-riverboat-trusted-loop`; historical execution evidence lives under
  `dogfood/evidence/wave-4/`. Evidence remains
  in-progress until default refusal, unsafe plan/result provenance, approval
  preflight, descendant cleanup, and packed-install behavior are captured.

**Wave 5 — Failure & recovery injection** (ADR 0002 D5)
- Trigger and recover from: unresolved target, missing/expired auth, mutation without `--commit`, source drift after clone (conflict guard), invalid section shape, missing block assets, stale preview/live, orphan + protected-hybrid routes, index absent/unpopulated, interrupted/cancelled job, pipeline step failure/approval/abort, partial batch-migration failure.
- Proof: each failure recognized + contained + recovered — not retried-until-green.

**Wave 6 — Lifecycle & conditional**
- Surfaces: `auth` flows, `skills bootstrap/install` (dogfoods the ADR-0001 embedded bootstrap), `site create` (2nd disposable site), `code sidekick`, `commerce`, `stardust` (external-conditional).

## Cross-cutting
- DA-native pipelines (`dogfood/certify.yaml`, `dogfood/promote.yaml`) activate, validate, and promote authoritative DA source.
- Provenance (`dogfood/provenance.json`): all 58 canonical pages plus supporting
  DA/codebus/derived artifacts map to exact command runs, hashed evidence, and
  public delivery contracts. Candidate liveness is 125/125; strict freeze still
  requires final tags, DA snapshot digest, and isolated replay.
- Flywheel: findings → primitive fix + locking test, each a 0.6.0 code change.

## Findings log (public history under `/learnings/`)

See **CONTENT-IA.md** for page kinds and how the history grows. Public hub:
https://main--da-cli-0-6-0--somarc.aem.live/learnings

- **f001** (fixed, PR #37): [`/learnings/f001-site-info-target`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f001-site-info-target) — `site info` ignored root `--org/--repo`.
- **f002** (fixed, High friction gate): [`/learnings/f002-design-detect-envelope`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f002-design-detect-envelope) — design detect/token-check structured envelopes (`clean` / `no-design-tokens`).
- **f003** (fixed): [`/learnings/f003-index-build`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f003-index-build) — `da index build`.
- **f004** (fixed): [`/learnings/f004-index-env-preview`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f004-index-env-preview) — index `--env preview` silently live.
- **f005** (fixed): [`/learnings/f005-route-codebus`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f005-route-codebus) — code assets classified orphan.
- **f006** (fixed): [`/learnings/f006-stale-contentbus`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f006-stale-contentbus) — stale contentbus after source delete.
- **f007** (fixed): [`/learnings/f007-route-clean-orphan`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f007-route-clean-orphan) — route clean did not unpublish orphans.
- **f008** (fixed, Critical friction gate): [`/learnings/f008-content-merge-path`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f008-content-merge-path) — merge path = document or subtree (clone-compatible); no bare folder `sourceGet`.
- **f009** (fixed, High friction gate): [`/learnings/f009-content-put-outside-worktree`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f009-content-put-outside-worktree) — refuse out-of-tree by default; flag is ownership opt-in with clear agent recovery.
- **f010** (fixed, High friction gate): [`/learnings/f010-media-absolute-url-rewrite`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f010-media-absolute-url-rewrite) — put warns/rewrites/strict-fails host-less `/media` imgs.
- **f011** (fixed, Medium-high friction gate): [`/learnings/f011-audit-contracts-autoblock`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f011-audit-contracts-autoblock) — contracts inventory + verify-code for autoblocks (modal/widget/fragment).
- **f012** (fixed, High friction gate): [`/learnings/f012-da-permission-headers`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f012-da-permission-headers) — DA `x-da-actions`/`x-da-child-actions` response headers discarded on every fetch; `403` falls into the generic error path with no distinct handling from `401` or a transient error. Fixed + locked, merged to da-cli main.
- **f013** (fixed, High): [`/learnings/f013-tools-classify-probe-gap`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f013-tools-classify-probe-gap) — literal-path re-probe prevents codebus static `/tools/*.html` from falling into the orphan clean-candidate class; any 403 now yields `probe-failed` (unknown, never absent). Locked in `src/commands/route.test.js`; original field route reclassified `codebus`.
- **f014** (fixed, High friction gate): [`/learnings/f014-pipeline-json-stdout`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f014-pipeline-json-stdout) — `pipeline run --format json` let child-step stdout pollute the envelope; child stdout now routes to stderr under a JSON parent. e2e lock; field-proven on two full construct regenerations (byte-idempotent, evidence wave-4).
- **f015** (fixed, **Critical** friction gate): `job run`/`job start` executed live mutations with no --commit check — gated at execution time, workers forward --commit, pipeline pre-guard covers job/index/sitemap. Found by subagent release review; locked in first `job.test.js`.
- **f016** (fixed, High): `da code job` unconditionally 404'd (wrong admin route shape); `helixJobWait` now uses real terminal states stopped/cancelled/expired.
- **f017** (partial, High): envelope seams cover the first delivery paths, bulk deploy, API errors, and now pre-dispatch/bootstrap failures; the audit also caught and fixed an `oldContent` scope crash in `content put` dry-run. Core lifecycle and remaining command surface are still tracked; no false closure claim.
- **f018** (fixed, High): workspace DA-path traversal guard — `content diff ../../../x` refused.
- **f019** (fixed, Medium-High): publish/unpublish/deploy/index build raised to preview safety tier.
- **f027** (fixed, High): [`/learnings/f027-list-success-bare-array`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f027-list-success-bare-array) — Wave 5 opening catch: `content list/tree/sheets/versions` succeeded as bare arrays under json (failure side already had envelopes) — agents could parse failures but not verify recoveries. One envelope on success now, empty results included; hermetic locks via new `DA_ADMIN_URL` seam.
- **f028** (fixed, High): [`/learnings/f028-config-read-gated-build`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f028-config-read-gated-build) — `index build --wait` died on an unauthorized Configuration Service read while the rebuild itself was authorized; the error blamed `*` instead of the config route. Config read now best-effort with the denied route named; build always dispatches.
- **f029** (recovered, High/process): [`/learnings/f029-index-config-false-migration`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f029-index-config-false-migration) — index config migration claimed without observing platform truth; deleting `helix-query.yaml` silently de-configured live indexing (fossil index kept serving). Restored + reindexed + verified 39→40; discipline: platform-state claims require live-response proof.
- **f030** (fixed, High): [`/learnings/f030-silent-global-target`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f030-silent-global-target) — silent global-config fallback read a different project with zero warnings; unresolved-target refusals had empty `next[]`. Reads now carry orientation warnings; refusals carry executable recovery.
- **f031** (fixed, High): [`/learnings/f031-freshness-blind-to-staleness`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f031-freshness-blind-to-staleness) — DA ms-epoch timestamps normalized to empty and freshness compared the preview against itself; `preview-stale` was undetectable by construction. Fixed + field-proven on the full staleness ladder.
- **f032** (fixed, High): [`/learnings/f032-silent-refusals`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f032-silent-refusals) — safety and validation refusals were silent on stdout under json. One `prepareWrite` seam + content put validation sites now emit `ok:false` envelopes with executable recovery.
- **f037** (fixed, High): [`/learnings/f037-put-blind-missing-media`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f037-put-blind-missing-media) — `content put` committed a page referencing a nonexistent same-project DA media asset with zero warnings; the page rendered `about:error` (f010's sibling; f023/f029 false-success class). Fixed: authenticated existence preflight (`sourceExists` HEAD probe) warns on both channels with the executable upload recovery; `--strict-media-urls` extends to fail the put. 3 hermetic locks failing on old code + collector units; field-proven warn/strict/control; 625/625.
- **f038** (fixed, High/systemic): [`/learnings/f038-fstab-shadowed-effective-config`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f038-fstab-shadowed-effective-config) — a healthy Configuration Service site without fstab was called broken and omitted from discovery, while the same fstab-only predicate disabled DA upload guardrails and drove legacy scaffolding/model claims. Fixed in PRs #44/#45: one Helix-effective source resolver now owns create/list/info/model/doctor/preview/content; exact DA URL validation, private-auth fallback, YAML legacy fallback only after 404, decoupled/unknown write containment, site-list/model v2. Old/new field pack in `evidence/wave-6/f038-*`; 652/652 + Node 22/24 CI + smoke/health.
- **f040** (fixed, High): Wave 6 first-party skill install discovered the skill but could not install it because known path shorthands omitted current upskill's required `--skill` selector. Fixed in da-cli PR #78 for both `da-cli-agent` and Stardust; command-level argv locks; isolated add/list/info/read replay green.
- **f041** (fixed, High orientation): explicit `site model --org/--repo` consumed an unrelated cwd `fstab.yaml` and modeled the requested site as a decoupled legacy mount. Fixed in da-cli PR #80: model and doctor probe the requested repo's committed legacy config; before/after Wave 6 evidence retained.
- **f042** (fixed, High false capability): `code sidekick set` invented a POST against a canonical GET-only endpoint and always returned 405. Fixed in da-cli PR #82 by removing the unsupported command/client method and documenting Configuration Service / `site register` ownership; direct GET proof retained.

## Release gate for 0.6.0

Two columns — both required. **Hang the hat on agentic operability, not
command count.**

1. **Waves:** 1–5 green with stored evidence; Wave 6 classified (run or
   precondition-recorded); DA-native certification/promotion verifies the site;
   candidate provenance coverage/liveness verifies; strict freeze is required
   before release publication.
2. **Frictions:** every Critical/High finding fixed + locked. The Wave 6 haul
   f040–f042 is fixed and locked on product main; the friction column remains
   clear.
   Checklist + honest residual notes: **`dogfood/FRICTION-GATE-0.6.0.md`**.

**Until the site proves itself:** package stays **0.5.x**, run **local**
`da` from `da/da-cli`, and **do not** open a git branch named for 0.6.0.
Product fixes land on 0.5.x; the **0.6.0 label is earned by dogfood proof**,
then version bump + release branch follow.

**Honest cut state:** friction hat earned for this cycle; **wave/release hat not**
— candidate provenance covers 58/58 canonical paths and 125/125 public URLs,
but Wave 6, DA snapshot/replay, and immutable CLI/proof tags remain open.
