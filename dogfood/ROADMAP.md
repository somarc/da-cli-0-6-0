# da-cli-0-6-0 Dogfood Roadmap

This site is the certifying dogfood run for the **da-cli 0.6.0** release. Per
ADR 0002 (dogfood rubric) and ADR 0003 (versioned demonstration sites), **0.6.0
ships only when this site is provably cut**: every `required-core` +
`required-destructive` CLI surface exercised with passing, provable evidence,
each artifact built by a `da` command captured in `dogfood/construct.yaml`, and
each finding turned into a primitive fix + locking test (the flywheel).

## Fixture model — git is upstream of DA

The source documents under `dogfood/fixtures/` are **construction inputs, not
authored content.** Think test seed data, not a content bus. The direction of
truth is **git → DA**: `construct.yaml` uploads each fixture to DA
(`da content put`), activates it (`da preview page`), and verifies the public
result. DA holds the delivered copy; the fixtures hold the canonical source; the
public URL is the proof.

This is deliberately the *opposite* of the normal EDS rule (content lives only
in the content bus, never in git — which is why `.da/workspace/` is gitignored).
For this site the product *is* provable construction, so the inputs must be
version-controlled or there is nothing to regenerate from and no provenance.
Hence `fixtures/`, not `content/`.

**Drift discipline:** because git is upstream, edit the fixture in git and re-run
the pipeline — never author directly in DA. A direct DA edit makes the fixtures
stale and a regeneration would overwrite it. (The content-conflict guard catches
exactly this if it happens.)

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
- Content: index control panel (✅ cut), CLI-authored `nav`/`footer` replacing scaffold defaults; `dogfood/construct.yaml` + provenance for index/nav/footer.
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

**Wave 5 — Failure & recovery injection** (ADR 0002 D5)
- Trigger and recover from: unresolved target, missing/expired auth, mutation without `--commit`, source drift after clone (conflict guard), invalid section shape, missing block assets, stale preview/live, orphan + protected-hybrid routes, index absent/unpopulated, interrupted/cancelled job, pipeline step failure/approval/abort, partial batch-migration failure.
- Proof: each failure recognized + contained + recovered — not retried-until-green.

**Wave 6 — Lifecycle & conditional**
- Surfaces: `auth` flows, `skills bootstrap/install` (dogfoods the ADR-0001 embedded bootstrap), `site create` (2nd disposable site), `code sidekick`, `commerce`, `stardust` (external-conditional).

## Cross-cutting
- Construction pipeline (`dogfood/construct.yaml`) captures every write → site is regenerable (ADR 0003).
- Provenance (`dogfood/provenance.json`): artifact → command → verified live URL.
- Flywheel: findings → primitive fix + locking test, each a 0.6.0 code change.

## Findings log (public history under `/learnings/`)

See **CONTENT-IA.md** for page kinds and how the history grows. Public hub:
https://main--da-cli-0-6-0--somarc.aem.live/learnings

- **f001** (fixed, PR #37): [`/learnings/f001-site-info-target`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f001-site-info-target) — `site info` ignored root `--org/--repo`.
- **f002** (open, Wave 2): [`/learnings/f002-design-detect-envelope`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f002-design-detect-envelope) — `design detect` empty error vs no design system.
- **f003** (fixed): [`/learnings/f003-index-build`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f003-index-build) — `da index build`.
- **f004** (fixed): [`/learnings/f004-index-env-preview`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f004-index-env-preview) — index `--env preview` silently live.
- **f005** (fixed): [`/learnings/f005-route-codebus`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f005-route-codebus) — code assets classified orphan.
- **f006** (fixed): [`/learnings/f006-stale-contentbus`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f006-stale-contentbus) — stale contentbus after source delete.
- **f007** (fixed): [`/learnings/f007-route-clean-orphan`](https://main--da-cli-0-6-0--somarc.aem.live/learnings/f007-route-clean-orphan) — route clean did not unpublish orphans.

## Release gate for 0.6.0
Waves 1–5 green with stored evidence; Wave 6 classified (run or precondition-recorded); construction pipeline regenerates the site; provenance verifies. Then cut 0.6.0.
