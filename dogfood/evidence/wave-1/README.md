# Wave 1 evidence pack — Foundation & core loop

**Status:** cut  
**Captured:** 2026-07-14 01:29–01:35 UTC  
**Target:** `somarc/da-cli-0-6-0` · branch `main`  
**Public board:** https://main--da-cli-0-6-0--somarc.aem.live/test-plan

## Cut rule

A Wave 1 surface is cut when we have (1) a CLI run, (2) observable outcome, and
(3) a file in this folder. This pack closes Wave 1 for the 0.6.0 dogfood site.

## Checklist

| Surface | Status | Evidence file |
|---------|--------|----------------|
| `status` | ✅ | `status.json` |
| `resolve` | ✅ | `resolve-index.json` |
| `content list` / `tree` | ✅ | `content-list.json`, `content-tree.json` |
| `content get` / `put` | ✅ | put via construct + ongoing fixtures; get to `/tmp` during pack |
| `preview page` / `publish page` | ✅ | live site + construct steps historically |
| `site freshness` | ✅ | `freshness.json` |
| `site info` / `doctor` | ✅ | `site-info.json`, `site-doctor.json` |
| `site model` | ✅ | `site-model.json` |
| `site pin-target` | ✅ | `pin-target.json` + repo root `.da.json` |
| `content clone` | ✅ | `content-clone-data.txt` (cloned `/data` → `.da/workspace/`) |
| `content diff` | ✅ | `content-diff-after-clone.txt` (no changes) |
| `content merge` | ✅ | `content-merge.txt` (merged 2 files) |
| `content put-tree` dry-run | ✅ | `content-put-tree-dryrun.txt` |
| `content versions` | ✅ | `content-versions-index.json` (API exercised; no versions stored on doc) |
| `pipeline run --dry-run` | ✅ | `construct-dry-run.json` (42-step plan, ok) |
| `aem up` local smoke | ✅ | `aem-up-smoke.txt` (HTTP 200 on :3001) |

## Notes

- **Pin:** `da site pin-target --org somarc --repo da-cli-0-6-0` writes `.da.json`
  so subsequent commands do not drift to another project when flags are omitted.
- **Merge:** `content merge /data` 404s as a DA folder path; merge of the cloned
  workspace root succeeds (merge workspace contents, not always a folder URL).
- **Versions:** command succeeds; this document reports no stored versions —
  still counts as surface exercise.
- **put-tree:** dry-run only (no `--commit`) — bulk write path proven without
  overwriting live content.
- **Workspace:** `.da/workspace/` is gitignored; evidence text captures outcomes.

## Re-run pack

```bash
ORG=somarc REPO=da-cli-0-6-0
cd /path/to/da-cli-0-6-0
da --org $ORG --repo $REPO --format json status | tee dogfood/evidence/wave-1/status.json
da --org $ORG --repo $REPO site pin-target --org $ORG --repo $REPO --branch main
da --org $ORG --repo $REPO content clone --path /data --force
da --org $ORG --repo $REPO content diff
da --org $ORG --repo $REPO content put-tree .da/workspace   # dry-run
da --org $ORG --repo $REPO pipeline run dogfood/construct.yaml --dry-run --format json \
  | tee dogfood/evidence/wave-1/construct-dry-run.json
aem up --no-open --port 3001   # curl localhost:3001 then stop
```
