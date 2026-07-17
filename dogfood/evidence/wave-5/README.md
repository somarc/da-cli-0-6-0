# Wave 5 evidence — failure & recovery injection — **IN PROGRESS (opened 2026-07-16)**

Proof line (ADR 0002 D5): each injected failure **recognized + contained +
recovered** — not retried-until-green. Drill matrix: `dogfood/WAVES.md`.

## A2 — missing/expired auth — opening rep (2026-07-16)

The drill injected itself: the cached token had expired naturally when the
session opened.

- `a2-expired-auth-status.json` — `status` recognizes the state:
  `auth.valid: false, reason: "expired"`. (Residue watch: envelope says
  `ok:false` but the command exits 0 — flagged for classification before cut.)
- `a2-expired-auth-content-list.json` — the read attempt under expired auth:
  exactly one `ok:false` envelope, errors naming the cause, `next: ["da auth
  login"]`, exit 1. Recognition + containment.
- `a2-recovery-auth-login.txt` — explicit `da auth login` from the agent's own
  non-TTY shell (the f020 refinement path): browser flow completed, token
  cached.
- `a2-recovered-content-list.json` — recovery verified against the contract:
  `ok: true, operation: content.list, count: 17`, exit 0.

**The verification read surfaced f027:** before the fix, the success path
printed a bare JSON array — the agent could parse its failure but could not
assert its recovery. `content list/tree/sheets/versions` now emit one envelope
on success (empty results included). Fixed + locked same-session in da-cli
(`content-envelope.test.js`, hermetic DA-admin stub via the new `DA_ADMIN_URL`
seam; verified 0/7 on old code; suite 600/600). Learning:
`/learnings/f027-list-success-bare-array`.

## Shipping this opening (field artifacts)

- `f027-put-page.json` / `f027-put-hub.json` / `f027-put-test-plan.json` — one
  `content.put` envelope each (mode: committed).
- `f027-deploy-pages.json` — one `deploy.pages` envelope (the f026-fixed lane):
  3 previewed, 3 published, 0 failed.
- `f027-index-build.json` — **open observation for drill C3**: `index build`
  returned a clean 403 envelope ("authenticated but not authorized…
  `da auth login` will not fix this", `next: da auth status`) with a token
  that is otherwise valid (auth status ~49 min remaining) — yet earlier
  sessions ran the same reindex successfully. Meanwhile the freshly published
  f027 page serves 200 but has not appeared in `/query-index.json` (39 rows,
  no f027) after several minutes: a live *configured-but-stale index with a
  blocked reindex lane*. That is precisely C3's territory — classify (token
  scope drift vs config-native change vs platform behavior) as part of the C3
  drill, not by guessing here.

## C3 — index states: frozen fossil, blocked lane, false migration (2026-07-16)

The live site WAS the injection — no synthetic failure needed. The freshly
published f027 page served 200 but never entered `/query-index.json`;
`maxLastModified` was frozen hours old; wildcard reindex jobs were accepted
(202) with zero effect.

- `c3-index-show.json` / `c3-index-validate.json` — the config-native index
  surfaces both 403 for this identity (clean envelopes, correct "auth login
  won't fix this" guidance). CLI fitness gap per ADR 0002 D6: config truth is
  unobservable without Configuration Service access.
- `f027-index-build.json` (earlier) — **f028 symptom**: `index build --wait`
  died as `Permission denied for *` while the reindex route itself was
  authorized (raw POST → 202). The Configuration Service *verification read*
  gated the build and misattributed the denial.
- `c3-index-build-recovered.json` — the same command through the f028 fix:
  `built-and-verified` with one honest warning naming the actual denied route.
  But `total: 39, changed: false` — which exposed the deeper truth:
- **f029**: the previous session's "config-native migration" was never
  observed on the platform. Single-path reindex of an already-indexed page
  matched only `#simple` — no named index config active anywhere. The deleted
  `helix-query.yaml` had been the ACTIVE config; the index was a fossil.
- `c3-code-sync-query-yaml.json` — recovery: yaml restored from git history +
  pushed; code sync shows codebus parity (`changes: []`). Probe-gap lesson:
  config files 404 on the public host *by design* — a public 404 is not
  deletion evidence.
- `c3-index-build-final.json` — full recovery proof: named `default` index
  matches again with all custom fields; rebuild `built-and-verified`,
  `total 39→40, changed: true`; f027 present in the live index.

Recognized (triangulation: frozen maxLastModified + `#simple`-only + config
403) → contained (fossil kept serving; nothing destructive) → recovered
(restore + resync + reindex + verified). Findings: **f028** (fixed+locked),
**f029** (recovered; discipline stated — platform claims need live-response
proof).

## A1 — unresolved target (2026-07-17)

- `a1-global-fallback-warned.json` — the sneaky case: empty directory, no
  project config → the CLI silently resolved to the GLOBAL default target and
  listed a *different project*. Post-f030: the envelope now carries the
  orientation warning (`resolved from GLOBAL config … pin-target`).
- `a1-unresolved-refusal.json` — truly unresolved (no config anywhere): one
  `ok:false` envelope, exit 1, and post-f030 the recovery is executable
  (`next: ["da --org <org> --repo <repo> <command>", "da config set org <org>"]`),
  not just prose.

## A3 — mutation without --commit (2026-07-17)

- `a3-put-no-commit.json` — `content put` with no `--commit`: one `ok:true,
  mode:dry-run, changed:true` envelope with the exact `--commit` promotion in
  `next[]`.
- `a3-verify-absent.json` — containment proof: the target path 404s on DA —
  nothing was written.
- `a3-publish-no-commit.json` — publish lane: `publish.page` dry-run envelope
  with the promotion command. Job lane banked (f015).

## C1 — stale preview / stale live (2026-07-17) — caught f031

- `c1-freshness-source-only.json` — `preview-missing` verdict + recovery for a
  fresh source. (Also visible: `sourceLastModified: ""` — the f031 symptom.)
- `c1-freshness-preview-stale.json` — post-f031-fix: source re-put minutes
  after preview → `verdict: preview-stale`, source/preview timestamps honest,
  recovery `preview page`. Before the fix this exact state reported `fresh` —
  DA ms-epoch timestamps normalized to '' and the row fell back to the
  preview-time snapshot (the tool compared the preview against itself).
- `c1-freshness-live-stale.json` — re-put + re-preview → `verdict: live-stale`,
  recovery `publish page`.
- `c1-freshness-recovered.json` — after promotion: `fresh / fresh / fresh`.
- `c1-route-clean-dryrun.json` / `c1-route-clean-committed.json` — cleanup via
  `route clean`: dry-run plan, then committed run that deleted source and hit
  the token's unpublish **403** — `action: permission-refused`, per-step
  results, structured recovery, exit 3. The right failure, cleanly reported.

## C2 — orphan route: recognition + containment (2026-07-17)

The route-clean 403 left a REAL orphan (source deleted, preview/live 200):

- `c2-orphan-classify.json` — `ownership: orphan, daSource: false,
  staleDaLocation: true`, exit 2. Recognition against live state.
- `c2-orphan-recovered-classify.json` — containment/recovery within today's
  permissions: source restored (rev 5 notes the pending cleanup), re-preview +
  re-publish → `ownership: contentbus`. Final orphan-removal (unpublish leg)
  deferred until Helix admin delete permission lands; `/drafts/c1-drill`
  carries its own removal instructions.

## f032 field proof

- `f032-refusal-envelope.json` — the exact `preview page` refusal that was
  empty-stdout during the C1 drill, now one `ok:false` envelope with the
  config-derived-target reason and the executable explicit-flags retry.

## Banked drills (Wave 4 / hardening-pass field evidence)

| Drill | Banked evidence | Pointer |
|-------|-----------------|---------|
| D1 interrupted job → resume | f022: SIGKILL at 7/21 → stale-lock reclaim → resume 21/21, attempts all 1 | `../wave-4/job-after-sigkill.json`, `../wave-4/job-resume-completed.json`, `../wave-4/job-tasks-final.json` |
| D2 cancelled job | cancelled preview-tree job; workers stop between tasks | `../wave-4/job-cancel-show.json` |
| D3 pipeline abort (partial) | f025: abort mid-flight on the real 74-step regen — 11 completed, 63 never ran, marker preserved | `../wave-4/pipeline-abort-envelope.json`, `../wave-4/pipeline-abort-state.json`, `../wave-4/pipeline-abort-recovery.json` |
| D4 batch collision (partial) | f024: colliding batch refused up front with the url→path table | `../wave-4/migrate-batch-collision-refusal.txt`, `../wave-4/migrate-batch-mapped.json` |

Banked rows credit the *injection*; remaining fresh reps (D3 step-failure +
approval, D4 mid-batch partial failure) and open drills A1, A3, B1–B3, C1–C3
land here before the wave cuts.

## B1–B3, D3, D4 — the completion haul (2026-07-17)

Every remaining fresh drill ran against the live site; three produced numbered
findings, all fixed + locked + field-re-proven same-session (618/618).

- **B1** (`b1-*`) — drift guard fired exactly right (push refused, drift named,
  remote protected) — then the guided recovery **destroyed the local side**:
  **f034**. Merge now preserves modified copies under `.da/merge-backups/`;
  push drift refusal is an envelope. Re-proven post-fix: preserved copy named,
  diff + push per the envelope's `next`.
- **B2** (`b2-*`) — the strict-sections door refused by default, but
  `--no-strict-sections` was a dead switch and the refusal was empty stdout
  under json: **f035**. Deliberate bypass + preview proved the flatten;
  rendered-side `audit full` passed 0-errors over the destroyed block (blind by
  construction — the violation erases its evidence); `preview explain` named it
  (`classes-removed-in-preview`, exit 1). Recovered via `fix-sections --write`.
- **B3** (`b3-*`) — `audit contracts --verify-code` named `phantom-widget`
  MISSING (404/404), exit 1; recovered to `missing:[]`. Specimen: document-path
  prefix scanned 0 pages and reported all-clear — now warns.
- **D3** (`d3-*`) — step-failure rep textbook (failed step named, dependent
  held `pending`, re-run 3/3). Approval rep: **f036** — closed-stdin gate
  exited 0 mid-run and stranded a `running` zombie; now `--approve/--approve-all`,
  non-TTY fail-fast, stderr prompt, EOF=denial. Abort banked (f025).
- **D4** (`d4-*`) — mid-batch 404: per-row honesty held (f023/f024 fixes
  visible), but exit 0 + bare array; now one `migrate.batch` envelope, exit 1
  on any failed line. Failed line recovered to the same path, validate clean.
- **C2** (`c2-unpublish-still-403-clean-envelope.json`) — permission re-probed
  at cut time: live-unpublish still 403 for this identity (clean envelope with
  `denied at` — f028's improvement visible). Final orphan-removal rep stays
  deferred on the operator grant; recognition/containment/recovery banked from
  the natural rep.

**Banked pointers:** D1 = wave-4 f022 SIGKILL/resume evidence; D2 = wave-4
`job-cancel-show.json`; D3-abort = f025 field drill on the 74-step regen;
D4-collision = f024 refusal evidence.
