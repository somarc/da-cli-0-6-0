# Wave 4 evidence — coordination, durability, migration — **CUT 2026-07-16**

Proof line (ROADMAP): pipelines green; durable job resumes after interruption;
migration validated. All three held, and all three drills broke something real
first — f022, f023, f024, f025. That is the point of drills.

## Opening rep (2026-07-16) — construct idempotence + f014

- `before-hashes.txt` / `after-hashes.txt` / `after2-hashes.txt` — sha256 of all 28
  sitemap routes' `.plain.html` before and after two full committed
  `pipeline run dogfood/construct.yaml` regenerations (runs `7165cc1f`, `d691ab30`).
  All three files identical: the site is provably regenerable and the pipeline
  is idempotent at the byte level.
- `pipeline-run-f014-symptom.txt` / `pipeline-run-clean.json` — f014 (envelope
  interleaving) symptom and fix, raw stdout both sides.

## Durable jobs — interruption survival (f022)

- `job-create.json` — 21-task job created.
- `job-after-sigkill.json` — runner SIGKILLed at 7/21; state intact, lock stale.
  Before the f022 fix, resume crashed `EEXIST` on that stale lock — "durable"
  jobs couldn't survive the one thing they exist for. `claimJobRunner` now
  reclaims provably-dead owners (ESRCH probe) and refuses live ones by pid.
- `job-resume-completed.json` / `job-tasks-final.json` — resume → 21/21, every
  task `attempts: 1` (no rework, no double-processing).

## Migration (f023, f024)

- `migrate-import.json` / `migrate-validate-import.json` — single import with
  explicit `--path`, normalized to a servable `.html` route (f023: verbatim
  paths used to upload unservable content as `status:'imported'`); validation
  matches the known source exactly (1 heading, title "Example Domain", 1 link).
- `migrate-batch-collision-refusal.txt` — 3 domain-root URLs deriving the same
  DA path: refused up front with the url→path table (f024: previously silent
  last-writer-wins, all lines 'done').
- `migrate-batch-mapped.json` / `migrate-validate-batch.json` — same batch with
  explicit `<url> <daPath>` lines: 3 distinct pages imported and validated.

## Pipeline surfaces — scaffold / status / abort (f025)

- `pipeline-scaffold.txt` — `pipeline scaffold` + `status` rep.
- `pipeline-abort-envelope.json` — the interruption drill on the REAL committed
  74-step site regen (run `7a52ef28`): abort issued mid-flight → run stopped at
  the batch boundary, 11 steps completed, **63 never ran**, `status:'aborted'`,
  exit 1, one parseable `ok:false` envelope. Before the f025 fix this drill
  finished `completed`: per-step saves rewrote `_meta` from memory and
  clobbered the abort marker.
- `pipeline-abort-state.json` — the on-disk run state: marker + `abortedAt`
  preserved. Note `put-blocks` completed 1.8s *after* the abort and its save
  kept the marker — the exact window that used to clobber it.
- `pipeline-abort-recovery.json` — clean rerun after the abort: 74/74 completed.
- `post-recovery-hashes.txt` — sitemap-route hashes after recovery + a second
  full regen: byte-identical across both runs at the current CLI. Honest note:
  `/index` and `/test-plan` differ from the *opening-rep* baselines with
  unchanged fixtures — the hardening-pass CLI changes altered put
  serialization. Baseline hashes are **CLI-version-scoped**; idempotence is
  proven per-version, and it holds at the version Wave 4 cuts with.

## Publish lane — job watch / cancel / promote, deploy (f026)

- `job-watch-publish-tree.json` — the promoted publish-tree job (21 paths)
  watched to terminal state: 21/21, failed 0.
- `job-cancel-show.json` — the cancelled preview-tree job in the ledger
  (workers stop between tasks).
- `deploy-pages-f026-symptom.txt` — raw stdout of the first `deploy pages
  --format json` run shipping the f022–f025 pages: two bare arrays
  back-to-back, `JSON.parse` fails with "Extra data" on a flawless 6/6 deploy.
  Logged as f026 — the f017 envelope march's fourth field specimen.
- `deploy-pages-clean.json` — same 6-path deploy after the fix: one
  `deploy.pages` envelope, both phases inside, `published: 6/6`.

Residue tracked on the friction gate: `pipeline run --job` (durable pipeline
runs) still unbuilt; f017 envelope migration march now has four field specimens.
