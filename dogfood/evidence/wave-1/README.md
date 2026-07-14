# Wave 1 evidence pack

Captured while pivoting from aesthetic PE to 0.6.0 release dogfood (2026-07-14).

## Checklist

| Surface | Result | Notes |
|---------|--------|-------|
| `da status` | pass | org/repo flags ok; auth valid |
| `da resolve /index.html` | pass | preview + live URLs correct |
| `da content list /` | pass | fixtures + media present |
| `da content tree /` | pass | |
| `da site freshness /` | pass | core pages fresh on preview/live |
| `da site info da-cli-0-6-0 --org somarc` | pass | fstab + pipeline ok |
| `da site doctor --agent` | pass | routes, shared docs, block assets ok |
| `da site model` | todo | |
| content clone/diff/merge/versions | todo | |
| `da up` local smoke | todo | |
| pin-target `.da.json` | todo | prevents site info defaulting wrong |
| construct dry-run | todo | |

## Operator note

`da site info` **without** positional repo can target the wrong project.
Always pass `da-cli-0-6-0` or pin via `da site pin-target`.

## Commands to re-run

```bash
ORG=somarc REPO=da-cli-0-6-0
da --org $ORG --repo $REPO --format json status | tee dogfood/evidence/wave-1/status.json
da --org $ORG --repo $REPO --format json site doctor --agent | tee dogfood/evidence/wave-1/site-doctor.json
da --org $ORG --repo $REPO --format json site freshness / | tee dogfood/evidence/wave-1/freshness.json
da --org $ORG --repo $REPO --format json audit contracts --prefix / --verify-code \
  | tee dogfood/evidence/wave-1/contracts-snapshot.json
```

## Wave 1 cut rule

Wave 1 is formally cut when remaining rows are green **and** this folder holds
the JSON artifacts above (not only “it worked in a chat session”).
