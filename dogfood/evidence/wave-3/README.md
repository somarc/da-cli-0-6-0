# Wave 3 evidence pack — **CUT 2026-07-14 03:05 UTC**

**Theme:** structured data (sheets + query index) + route ownership.  
**Started:** 2026-07-14 02:58 UTC  
**Cut:** 2026-07-14 03:05 UTC  
**CLI:** local 0.5.x · target `somarc/da-cli-0-6-0`

## What Wave 3 is (one sentence)

Prove agents can **discover sheets**, **trust the public query index**, and **classify who owns each URL** (content vs code vs orphan) before they edit or clean.

## Sheets scope note

`content sheets` inventories **strict** DA sheet docs only (`":type": "sheet"` + top-level `data` array). That is enough for Wave 3 discovery proof (3 sheets on this site). It is **not** a full model of site tabular data. **Expand as awareness expands:** multi-sheet workbooks (`:names`), form/block consumers, richer column/type summary, optional row dump — product follow-ups, not cut blockers.

## Captures

| File | Command / source | Exit | Notes |
|------|------------------|------|-------|
| `content-sheets.json` | `content sheets` | 0 | coverage, wave-2-cli-surface, contact-form |
| `index-show.json` | `index show` | 0 | helix-query.yaml fields |
| `index-validate.json` | `index validate` | 0 | YAML vs live index |
| `index-query-default.json` | `index query default --limit 50` | 0 | 23 rows pre-matrix |
| `index-build.txt` / `index-build-after-route-matrix.txt` | `index build --commit` | 0 | rebuild after publish |
| `index-query-after-route-matrix.json` | `index query` post-build | 0 | mixed stdout cleaned to JSON |
| `query-index-live.json` | curl live `/query-index.json` | — | **24 rows**; includes `/route-matrix` |
| `index-query-has-route-matrix.json` | summary of live index | — | cut proof for new route |
| `route-audit.json` | `route audit` | 0 | 54 paths: ~26 contentbus, ~28 hybrid |
| `classify_*.json` | `route classify …` | 0 | intentional matrix cases |
| `classify_route-matrix_html.json` | `route classify /route-matrix.html` | 0 | contentbus, live 200 |
| `route-clean-orphan-demo-dryrun.txt` | `route clean /tests/orphan-demo` | 0 | dry-run: unpreview+unpublish, no source |

## Ownership matrix (cut slice)

| Path | ownership | Evidence |
|------|-----------|----------|
| `/index.html` · `/cli-surface.html` · `/route-matrix.html` | contentbus | classify JSON |
| `/blocks/hero/hero.js` | codebus | classify · code 200, daSource false |
| `/media/.../mascot-cupid.webp` | hybrid | classify · daSource true, code 200 |
| `/tests/orphan-demo` | orphan | classify + clean dry-run |
| `/tools/wave-2-cli-surface.html` | codebus (f013 fix) | canonical statuses remain 404; literal-path probe is **200** — before/after artifacts checked in |

## Documented partials (not blockers)

| Surface | Status | Note |
|---------|--------|------|
| tools static classify | fixed (f013) | Literal-path re-probe now classifies codebus `tools/*.html` correctly; any 403 becomes `probe-failed`, so unknown ownership cannot pass the orphan clean gate. |
| index eventual consistency | expected | Publish → `index build` → new path appeared in live index within ~2 min (`total` 23 → 24). |

## Public proof

- https://main--da-cli-0-6-0--somarc.aem.live/route-matrix  
- https://main--da-cli-0-6-0--somarc.aem.live/query-index.json  
- https://main--da-cli-0-6-0--somarc.aem.live/test-plan  

## Recipe

```bash
cd da/da-cli-0-6-0
BIN=../da-cli/bin/da.js
node $BIN --org somarc --repo da-cli-0-6-0 --format json content sheets
node $BIN --format json index show
node $BIN --format json index validate
node $BIN --format json index query default --limit 50
node $BIN --commit index build --yes
node $BIN --format json route audit
node $BIN --format json route classify /route-matrix.html
node $BIN --format json route classify /blocks/hero/hero.js
node $BIN --format json route classify /tests/orphan-demo
# dry-run first:
node $BIN route clean /tests/orphan-demo
```
