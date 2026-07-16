# Wave 4 evidence — opening rep (not a cut)

**2026-07-16 — construct idempotence + f014**

- `before-hashes.txt` / `after-hashes.txt` / `after2-hashes.txt` — sha256 of all 28
  sitemap routes' `.plain.html` before and after two full committed
  `pipeline run dogfood/construct.yaml` regenerations (runs `7165cc1f`, `d691ab30`).
  All three files identical: the site is provably regenerable and the pipeline
  is idempotent at the byte level.
- `pipeline-run-f014-symptom.txt` — raw stdout of the first run: 58/58 steps
  completed, exit 0, but 29 child-step preview URLs interleaved above the JSON
  envelope → `JSON.parse(stdout)` fails on a flawless run. Logged as f014.
- `pipeline-run-clean.json` — raw stdout of the second run with the f014 fix:
  parses directly as a single envelope; child stdout routed to stderr.

Wave 4 remains open: durable jobs (`--job`, interruption survival, `job watch`)
and migration surfaces still to prove. `pipeline run` has no `--job` flag yet —
tracked on the Wave 4 board.
