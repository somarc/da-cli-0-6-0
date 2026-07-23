# 0.6.0 friction gate — hang our hat here

**Status:** **friction column clear** (f015 Critical–f042 fixed/recovered + locked; f017 remains explicitly partial; **f040–f042 are the Wave 6 lifecycle haul**: known skill selection, explicit-target fstab contamination, and an invented Sidekick mutator) — wave column: Waves 1–5 cut with the documented C2 permission defer; Wave 6 is blocked on external Configuration Service `config:write` after a contained partial `site create`.
**Site:** https://main--da-cli-0-6-0--somarc.aem.live/
**Companion boards:** `ROADMAP.md`, `WAVES.md`, public `/test-plan`, public `/learnings`
**Rule:** 0.6.0 is a **substantial** release. Waves prove surface coverage. **This
document proves agentic operability.** Both must pass.

## Version / branch discipline (until cut)

| Track | Policy until the dogfood EDS site proves the release |
|-------|------------------------------------------------------|
| **npm / package version** | Stay on **0.5.x** (`@somarc/da-cli`). Do not bump to 0.6.0 in `package.json` early. |
| **git branch named `0.6.0`** | **Not yet.** Open that branch only when ready to cut, after site proof. |
| **How we run `da`** | **Local tree only** — e.g. `node …/da/da-cli/bin/da.js` or a local link/path. Do not depend on published npm for dogfood proof while product fixes land on 0.5.x. |
| **What “0.6.0” means now** | Release **target and hat** (this gate + site), not a version already in the wild. |

Fixes ship in the **0.5.x** line as dogfood-driven work; the **0.6.0 label is earned by the site**, then version + branch follow.

---

## Why this gate exists

Unit tests and “command exited 0” do not certify an agent-first CLI. Dogfooding
this site exposed frictions that unit suites never would: empty error envelopes,
path semantics that lie between clone and merge, worktree safety that agents
trip on, media rewrite traps, contracts that miss autoblocks.

**0.6.0 ships only when:**

1. Waves 1–5 are green with stored evidence (and Wave 6 classified).
2. DA-native certification and promotion pipelines verify the site and provenance.
3. **Every Critical/High friction is fixed or explicitly reclassified** with
   evidence (primitive fix + lock, or accepted-risk ADR with operator workaround
   that is structured and discoverable — not “agents just know”).

If (1) and (2) pass but (3) fails, **do not cut 0.6.0**. That is the hat.

---

## Honest assessment — 2026-07-14 (f012 merged)

### Friction column: **CLEAR**

All frictions logged this cycle (**f012**) plus the earlier flywheel
(**f001–f011**) are **fixed in the local 0.5.x tree** with unit tests and
public learning pages. Nothing Critical/High remains open on this list.

| Id | Severity | Status | What we actually shipped |
|----|----------|--------|---------------------------|
| f001 | — | fixed (earlier) | site info / pin-target |
| f002 | High | **fixed** | design detect/token-check structured envelopes |
| f003–f007 | — | fixed (earlier) | index, route ownership/clean |
| f008 | Critical | **fixed** | merge path = subtree (clone-compatible) |
| f009 | High | **fixed** | out-of-tree put refuse + ownership flag messaging |
| f010 | High | **fixed** | media URL warn / `--rewrite-media-urls` / `--strict-media-urls` |
| f011 | Medium-high | **fixed** | contracts inventory + verify for autoblocks (modal/widget/fragment) |
| f012 | High | **fixed** | permission hints captured (`err.permissionHints`, `list().daPermissionHints`); 403 distinct from 401; `content list`/`get` warn proactively on read-only access. Merged to main (fast-forward, no PR — small, tested, low-risk change). |
| f013 | High (upgraded from Medium) | **fixed** | Upgraded by the release-review audit: misclassified orphans skip `route clean`'s `--force` gate, and `code:read`-scoped tokens made everything look codebus-less (403 conflated with 404) — a delete-without-safety-net path, not just a misreport. Fixed: literal-path re-probe before any extensioned route is called orphan; any 403 → `probe-failed` (unknown ≠ absent), which `route clean` already refuses. Field-verified: the route that was "orphan" for two days now classifies `codebus`. |
| f014 | High | **fixed** | `pipeline run --format json` interleaved child-step stdout with the envelope (`stdio: 'inherit'`) — `JSON.parse(stdout)` failed on a flawless 58-step run. Fixed: JSON parent pipes child stdout to stderr; stdout carries exactly one envelope. e2e lock in `pipeline.test.js` (524/524). Field proof: `dogfood/evidence/wave-4/pipeline-run-clean.json`. |

| f015 | **Critical** | **fixed** | `job run`/`job start` executed live mutations with NO --commit check (unsigned local JSON trusted as carried-forward intent; also reachable via pipeline YAML). Now gated at execution time; workers forward --commit; job/index/sitemap added to pipeline pre-guard. First `job.test.js` locks the attack repro. Found by release-review subagent audit. |
| f016 | High | **fixed** | `da code job` was unconditionally broken — called `/job/{id}/details` (404s always; real route is `/job/{org}/{repo}/{topic}/{jobName}/details`, verified against helix-api-service + live admin.hlx.page). `helixJobWait` polled for nonexistent terminal states (`failed`/`success`); now `stopped/cancelled/expired`. |
| f017 | High | **partial (migration active)** | Envelope seams now cover the first delivery paths, bulk deploy, API errors, and pre-dispatch/bootstrap failures (no-token non-TTY repro changed from empty stdout + stack to one `ok:false` envelope with recovery). The audit also found and fixed a block-scope crash in the intended `content put` dry-run envelope. Core lifecycle and remaining command surface are still tracked; f014 residual remains closed through `resolveFormat()` keying. |
| f018 | High | **fixed** | `content diff`/merge path traversal — DA paths resolving outside `.da/workspace/` (e.g. `../../../etc/hosts`) were read/written locally. `toLocalPath` now refuses workspace escapes. |
| f019 | Medium-High | **fixed** | Inverted safety tiers: `publish page`/`unpublish`/`deploy page`/`index build` had WEAKER ambiguous-target protection than `preview page`. All raised to the preview tier (+`--yes`); first CLI-level `publish.test.js`. |
| f020 | Medium-High | **fixed** | Found by CI, not the local suite: the f019 push hung both CI matrix jobs (8 tests × 30s, `exitCode null`). With no cached token and no TTY, `getToken()` spawned the interactive npx auth helper with inherited stdin — indefinite hang for agents/CI/pipes, firing BEFORE the safety gate. Fixed two layers: non-TTY + no token → instant throw with executable recovery (`DA_TOKEN` / `da auth login`); f019/f017 locks made hermetic (synthetic `DA_TOKEN`, isolated `HOME`/`DA_TOKEN_PATH`). CI 4m28s red → 34s green. **Refined same-day:** first guard keyed on TTY alone and blocked `da auth login` itself — the helper is browser-interactive, not stdin-interactive. Explicit login (`interactive: true`) bypasses the guard; only implicit bootstrap fails fast. Verified: agent authenticated from its own non-TTY shell in <30s. |
| f021 | High | **fixed** | Found publishing THIS haul's learning pages: bulk preview/publish jobs reported `stopped` success with `total: 0` — `#bulkBody` sent slash-less paths (URL-segment transform reused for a body) and the platform silently dropped all of them. Separately the job details route was missing its **ref segment** — f016's source-derived fix still 404ed on every real job; live `links.self` settled the true shape `/job/{org}/{repo}/{ref}/{topic}/{name}`. Method lesson: ground truth is a live response, not a source read. Cascade: index `--wait`'s "transient job" fallback was this same bug. Field proof: same 7-path run went total:0-crash → 7/7 success; index job polls real (38/38). Four wrong-shape locks flipped. Residue → f017 remainder: `publish pages` variadic asymmetry; bulk poll crash was a bare stack under json. |
| f022 | Critical (for Wave 4's core promise) | **fixed** | Durable jobs weren't: a SIGKILLed runner left its lock dir behind and resume crashed with raw `EEXIST` — "durable job resumes after interruption" was false in the one scenario it exists for. `claimJobRunner` now probes the recorded owner pid: provably dead (`ESRCH`) or missing metadata → stale, reclaimed with a note; live or `EPERM` → still refused naming the owner. Field: SIGKILL at 7/21 → resume → 21/21, every task `attempts: 1`. Liveness locks use the test's own `process.pid` for the refusal case (guaranteed alive), not an arbitrary number. |
| f023 | High | **fixed** | `migrate import --path` used the explicit path verbatim — extension-less targets uploaded fine, could never be listed/previewed/published, and still printed `status: 'imported'`. f021's lesson in a different coat: false success at migration scale means a hundred green envelopes and zero servable routes. Explicit paths now get the same `ensureHtmlPath` normalization as derived ones. Field: re-run lands `/migrated/example.html`, previews clean, `migrate validate` matches the known source exactly. |
| f024 | High | **fixed** | `migrate batch` lines deriving the same DA path silently overwrote each other — 3 domain roots → one `/index.html`, all three lines `done`. Silent last-writer-wins is data loss with a green checkmark. Collisions now refuse up front with the full url→path table; URL files accept `<url> <daPath>` lines as the explicit per-line resolution. Field: colliding batch refuses naming the collision + recipe; mapped batch imports 3 distinct validated pages. Meta-catch: an early lock draft replaced `migrate.test.js` and silently dropped 37 tests (567→530) — caught by watching the suite count; locks were appended to the original instead. |
| f025 | High | **fixed** | `pipeline abort` was a no-op in practice: it writes `_meta.status='aborted'` to the state file, but every per-step save rewrote `_meta` from memory — clobbering any abort that landed while a step executed (i.e. almost always). Runs finished `completed` through their own abort. Fixed: `persistState()` merges the on-disk marker before every write; the batch-boundary check now sees it. Field proof on the real 74-step committed regen: abort mid-flight → 11 completed, **63 never ran**, `status: 'aborted'`, exit 1, one parseable `ok:false` envelope; `put-blocks` completed 1.8s *after* the abort and its save preserved the marker (the exact clobber window). e2e lock verified failing against the old runner (reported `completed`). |
| f026 | High | **fixed** | Found deploying the f022–f025 pages (third session running where publishing the haul generated the next finding): `deploy pages --format json` wrote the preview-phase and publish-phase arrays back-to-back — `JSON.parse` failed with `Extra data` on a flawless 6/6 deploy; dry-run was silent-empty. Fourth field specimen for the f017 envelope march: multi-phase commands keep re-breaking one-command-one-envelope until a seam owns it. Fixed (f017 pattern): json emits one `deploy.pages` envelope with both phases, `changes[]`, `errors[]` + exit 1 on partial failure; dry-run envelope added. Hermetic locks against a local helix-admin stub (`DA_HELIX_ADMIN_URL` test seam), verified 0/3 on old code. Field: same 6-path deploy re-parsed clean, 6/6. |
| f027 | High | **fixed** | Wave 5's opening catch, in the first minutes of the expired-auth drill: `content list --format json` failed as one `ok:false` envelope with recovery — but *succeeded* as a bare array. The agent could parse its failure and not verify its recovery; empty results were silent stdout. Same asymmetry in `content tree`/`sheets`/`versions`. Fifth f017 field specimen, first found on a success path (the migrated failure side made the asymmetry visible). Fixed: read-listing family routes json success through the seam — one envelope with `data.count` + rows, `count:0` envelopes for empty. Hermetic locks vs a local DA-admin stub (new `DA_ADMIN_URL` seam), verified 0/7 on old code; 600/600. Field: recovery read parses `ok:true, count:17`. |
| f028 | High | **fixed** | Drill C3: `index build --wait` consults the Configuration Service for the verification target BEFORE dispatching the rebuild — the field identity was authorized for the reindex (raw POST → 202 job) but not the config route (403), and the whole command died as `Permission denied for *` while the build it blamed never ran. An unauthorized *convenience* gated an authorized *mutation*, with the error naming the wrong resource. Fixed: config read is best-effort (warn with the denied route, verify default target); permission-denied messages now carry `denied at <url>`. New `DA_PUBLIC_HOST_URL` seam keeps the lock hermetic; critical case verified failing on old code; 602/602. Field: same command → `built-and-verified`, and post-f029 detected `total 39→40, changed:true`. |
| f029 | High (process) | **recovered** | The previous session's "index config goes config-native" migration was claimed in docs/provenance but never observed on the platform: the Configuration Service held no config for this site (identity 403), the deleted repo-local `helix-query.yaml` was the ACTIVE config, and live indexing silently de-configured — fossil index kept serving while updates died (`#simple`-only match on reindex of an already-indexed page was the tell). Recovered: yaml restored from git history, codebus parity confirmed, named-index match returned, full rebuild verified `39→40`. Discipline stated on the boards: platform-state claims require a live-response artifact; provenance/WAVES reverted to observed truth. CLI fitness gap per ADR 0002 D6: `index show/validate` can't observe config truth without Configuration Service access. |
| f030 | High | **fixed** | Drill A1: from a directory with no project config, reads silently resolved to the GLOBAL default target and listed a *different project* with `warnings: []` — the read-side twin of f001's drift, unguarded because f019 covers only mutations. And truly-unresolved refusals carried recovery only in prose (`next: []`). Fixed: global-fallback targets warn (stderr + read-listing envelope warnings, `pin-target` guidance); unresolved errors attach executable `err.next` honored by the envelope seam; explicit flags stay silent. Three locks, verified failing on old code. |
| f031 | High | **fixed** | Drill C1: `site freshness` could never say `preview-stale` — DA `/list` reports lastModified as EPOCH MILLISECONDS, `Date.parse(number)` is NaN, every source timestamp normalized to `''`, and the row builder silently substituted the helix status snapshot (source as of preview time): the tool compared the preview against itself. The unit fixture modeled strings — the wrong platform shape (f021's lesson in test form). Fixed numeric normalization; locks use the real shape; field-proven full ladder preview-missing → preview-only → preview-stale → live-stale → fresh with per-verdict recovery. |
| f032 | High | **fixed** | Three same-day specimens: f019 safety refusals (`code sync`, `preview page`) and `content put` structure validation exited 1 with EMPTY stdout under json — a correct refusal indistinguishable from a crash on the machine channel. Fixed at one seam: `prepareWrite` refusals emit `ok:false` envelopes with the executable retry; `content put`/`put-tree` validation sites emit envelopes with `--wrap` recovery. Stderr prose unchanged. Two hermetic locks, verified failing on old code; 609/609. Residue: `--strict-sections` exit, `site freshness` bare array. |
| f033 | High (process + product) | **fixed** | A field session shipped through PATH `da` — a FIFTEEN-day-stale global npm install predating the whole f014–f032 flywheel — and filed a ghost specimen (`publish page` json empty stdout) that the tree had already fixed. Version could not disambiguate: the package deliberately holds 0.5.1 until the gate opens, so both installs read identically. Product fix: `da status` reports `data.cli` provenance — packageRoot, installKind (installed-package vs source-tree), git sha+dirty. Machine fix: global install replaced with `npm link` to the working tree. Closed in the same pass: `publish pages` accepts variadic direct paths (preview-parity source grammar) + dry-run envelope. Two locks verified failing on old code; 611/611. Residue: committed `preview/publish pages` success is still a bare array under json (f017 march). |
| f034 | High (data loss) | **fixed** | Drill B1: the push drift guard worked, then its OWN recovery instruction ('merge … and re-apply your change') overwrote the modified local file — commits store paths, not content, so nothing was left to re-apply. The guard protected the remote side and the guided recovery deleted the local side. Fixed: merge preserves modified local copies under `.da/merge-backups/<stamp>/`, named in stderr + envelope `data.preserved` + warnings with executable next; push drift refusal emits `ok:false` envelope (was stderr prose + bare planned-paths array); content status/merge enveloped; clone accepts document paths (was silent 'Cloned 0 files' exit 0); out-of-worktree put refusal enveloped (f032 class). 4 locks failing on old code. |
| f035 | High (safety contract) | **fixed** | Drill B2: `--no-strict-sections` never disabled strictness — commander stores the flag pair in ONE camelized key (`strictSections:false`); the code checked a `noStrictSections` key that cannot exist and fell through to the DA-backed strict default. Refusal prose blamed an absent flag ('omit the flag'); stdout was EMPTY under json (the tracked --strict-sections march residue, field-confirmed by the drill). Fixed: `strictSections===false` disables; refusal emits envelope naming block classes + `fix-sections --write` / `--allow-top-level-blocks` recovery. Drill context recorded: rendered-side `audit full` is blind to the flatten by construction; `preview explain` is the source-aware recognizer. |
| f036 | High (integrity) | **fixed** | Drill D3: a `requires_approval` step under closed stdin let the event loop drain past the unanswered readline — process exited 0 MID-RUN with no envelope; run state stranded `running` (zombie). Prompt also wrote to stdout, corrupting the envelope on the answered path. f020's lesson at a new gate. Fixed: `pipeline run --approve <id…>` / `--approve-all`; non-TTY + ungranted gate → immediate `ok:false` refusal naming the exact flag, run terminal `failed`, exit 1; TTY prompt on stderr; EOF = denial. 2 hermetic locks (riverboat harness) failing on old code. |
| f037 | High (false success) | **fixed** | Found shipping the Prove nav restructure: `content put --commit` accepted a page referencing a nonexistent same-project DA media asset (`content.da.live/...jpg` — codebus-only, never in DA media) with zero warnings; the page rendered `about:error`. f010's SIBLING: host-less `/media` URLs were guarded, absolute same-project references never existence-checked — a wrong outcome committed as success (f023/f029 class), found by a human eye, not the CLI. Fixed: `sourceExists` HEAD probe per unique reference (404 definitive; transport/auth unknown never blocks); missing refs warn on envelope `warnings[]` + stderr with the executable upload command; `--strict-media-urls` extends to fail with one `ok:false` envelope + per-asset `next[]` recovery. 3 hermetic locks (DA_ADMIN_URL stub) verified failing on old code + collector units; field triple at the fixed CLI (warn / strict-refusal / zero-noise control); 625/625. |
| f038 | High (systemic orientation + safety) | **fixed** | A new Throughline greenfield run exposed a contradiction in the first minutes: `site info` called repository fstab **MISSING** and told the agent to add it while the same result proved Helix 200 from `markup:content.da.live` with non-empty content. The agent committed fstab and `.da.json`, then reverted both. Pulling that thread found the legacy-file predicate across the product: `site list` hid modern sites; `site create` pushed fstab by default from a non-template source; `site model` invented a DA mount; preview prescribed fstab; doctor coupled effective config to auth; and no-fstab `content put`/`put-tree` disabled structure/section safety. Fixed in PR #44 + systemic PR #45: one Helix-effective source contract, exact DA URL validation, bearer fallback, YAML legacy fallback only after a conclusive 404, explicit configured/legacy/unconfigured/probe-failed states, Configuration Service-first create + register, versioned list/model v2, and decoupled/prefixed/unknown write containment (including binary). Old code replay + current live proof stored in `evidence/wave-6/f038-*`; 652/652, Node 22/24 CI, release smoke, repo health. |
| f040 | High | **fixed** | `skills add da-cli-agent` and `skills add stardust` supplied a repository path without the explicit skill selection required by current upskill. PR #78 adds `--skill` for both and command-level argv locks; isolated Wave 6 recovery passes add/list/info/read. |
| f041 | High | **fixed** | `site model`/doctor could use an unrelated cwd fstab for an explicit remote target. PR #80 makes diagnostic legacy probes target the requested GitHub repo; Wave 6 before/after replay changes the partial site from false decoupled legacy to truthful unconfigured. |
| f042 | High | **fixed** | `code sidekick set` POSTed to a canonical GET-only endpoint and returned 405. PR #82 removes the dead mutation surface and preserves read-only `code sidekick get`; configuration ownership is Configuration Service / `site register`. |

### Next friction candidates (not yet numbered pages)

- ~~put/preview/publish envelope gaps~~ — **closed** under f017 seams (success envelopes) + `handleApiError` now emits `ok:false` envelopes with `next[]` recovery on every API failure path (least-friction pass, 2026-07-16).
- ~~`index build` fire-and-forget~~ — **closed**: `index build --wait` does pre-build snapshot → job poll attempt (transient index jobs are not persisted; honest fallback warning) → bounded cache-busted public convergence (`changed | stable | timedOut`). Field: 9.3s single parseable `built-and-verified`. `--force-async` plumbs ground-truth body.
- ~~2×N page loops~~ — **closed**: `preview pages --bulk` / `publish pages --bulk` ride the platform bulk job (1 request + 1 pollable job), with `/.helix/*` batch-poison filtering and auto `forceAsync` >100 paths.
- Preview certification and live promotion are separate checked-in pipelines with distinct approval boundaries.
- `pipeline run` has no `--job` mode — long regenerations cannot checkpoint/survive interruption yet (Wave 4 board).
- f017 remainder: migrate config/auth/site create and the rest of the command surface onto the envelope seams (deploy pages closed by f026; content read-listing closed by f027; publish pages dry-run closed by f033's pass; content status/merge/push-refusal + migrate batch + strict-sections + out-of-worktree refusal closed by the f034–f036 pass — committed preview/publish pages success arrays still on the march).
- `status` reports `ok:false` (expired auth) but exits **0** — caught during the Wave 5 A2 opening rep. Classify before Wave 5 cuts: diagnosis-command semantics (command succeeded at reporting an unhealthy state) vs agent-contract violation (`ok` must track exit). Whichever way it lands, the position must be stated, not implicit.

### What “fixed” means (and what it does not)

| Claim | Honest bound |
|-------|----------------|
| Agent orientation | Better — structured refuse, clean detect, media warn, autoblock inventory |
| Platform Helix media rewrite | **Not** fully fixed at platform; CLI warn/rewrite is the contract until Helix resolves host-less `/media` |
| helix-cli parity | **Contract** parity for merge paths, not nested-git 3-way merge |
| Published npm | Still **0.5.x**; run **local** `da` — not on npm 0.6.0 |
| Full 0.6.0 release | **Not cut** — waves 2–6 incomplete |

### Wave column: **NOT CLEAR**

| Wave | Status | Honest note |
|------|--------|-------------|
| 1 Foundation | **Cut** | Evidence pack in `dogfood/evidence/wave-1/` |
| 2 Blocks/audits/design | **Cut 2026-07-14 02:51 UTC** | kitchen-sink + CLI surface + evidence re-run (`dogfood/evidence/wave-2/`) |
| 3 Index/routes | **Partial** | Sheet/index/orphan exist; full matrix incomplete |
| 4–6 | **Not started** | Pipeline/job/migrate, failure injection, lifecycle |

### Bottom line

- **Friction hat:** we can hang the agentic-operability story for this cycle —
  the logged Critical/High landmines, including f012, are closed in product
  code with locks on main.
- **Release hat:** **do not cut 0.6.0** yet. Wave proof + construct regen +
  provenance + 0.5.x→0.6.0 branch/version discipline remain.
- **Residual risks (not open fNNN, but real):** Helix unpublish 403 on orphans
  (`/findings` ghost CDN); skill docs may lag local CLI; media still needs
  absolute or rewrite discipline at authoring time.

---

## Open frictions

**None** on the hang-hat list as of 2026-07-14 (f012 merged).

New dogfood pain → new `fNNN` learning; do not reopen closed ids.

---

## Closed frictions (full roster)

| Id | Surface | Resolution |
|----|---------|------------|
| **f001** | site | `site info` honored target override; pin-target / `.da.json` |
| **f002** | design | design detect/token-check structured envelopes |
| **f003** | index | `da index build` path |
| **f004** | index | `--env preview` no longer silently queries live |
| **f005** | route | code assets not mislabeled orphan |
| **f006** | route | stale contentbus after source delete |
| **f007** | route | `route clean` removes orphan publications |
| **f008** | content | merge path semantics match clone (subtree) |
| **f009** | content | out-of-tree put refuse + ownership flag |
| **f010** | content, media | host-less /media img warn + rewrite/strict |
| **f011** | audit, block | contracts inventory includes autoblocks |
| **f012** | auth, content | permission hints captured; 403 distinct from 401; content list/get warn on read-only access |

---

## Cut checklist

### Friction column
- [x] f002 fixed + lock
- [x] f008 fixed + lock
- [x] f009 fixed + lock
- [x] f010 fixed + lock
- [x] f011 fixed + lock
- [x] f012 fixed + lock (merged to main)
- [x] Clone/merge notes in COMMANDS/AGENTS
- [x] Public learnings show fixed for f002, f008–f012

### Wave / release column (still required)
- [x] Wave 2 formal cut with evidence (2026-07-14 02:51 UTC)
- [ ] Waves 3–5 green + Wave 6 classified
- [x] Candidate provenance covers 58/58 canonical paths and 125/125 declared public URLs
- [ ] DA snapshot + isolated replay + strict frozen provenance verify
- [ ] `test-plan` records full gate clear
- [ ] Version bump + release branch **after** site proves

When **both** columns are checked: **cut 0.6.0**.

Last updated: **2026-07-16** — Wave 5 opened. Opening rep A2 (expired auth, naturally injected) recognized/contained/recovered; the recovery verification surfaced **f027** (content read-listing success paths were bare arrays under json) — fixed + locked same-session, 600/600, pushed to da-cli main. Friction column stays clear; residue watch: `status` ok:false with exit 0.
