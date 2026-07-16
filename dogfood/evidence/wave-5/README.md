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
