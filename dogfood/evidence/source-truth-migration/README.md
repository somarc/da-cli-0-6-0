# DA source-of-truth migration evidence

Date: 2026-07-22  
Target: `somarc/da-cli-0-6-0@main`

This evidence closes release-site issue #6 by replacing the retired Git-authored fixture construct with DA-native certification and promotion boundaries.

## Repository transition

- Removed `dogfood/fixtures/**`, `content-staging/**`, `drafts/**`, and `dogfood/construct.yaml`.
- Removed the orphaned Git media mirror for the Riverboat proof; DA remains authoritative for that asset.
- Added `dogfood/certify.yaml` and `dogfood/promote.yaml`; neither uploads authored content from Git.
- Added `npm run check:da-source-truth` and wired it into CI.
- Preserved earlier wave evidence unchanged as historical observations.

## DA transition

Authoritative DA source was cloned with the local da-cli, updated through `.da/workspace/`, and written back only through da-cli. The reconciled pages remove active fixture/edit-in-Git guidance while retaining historical construction facts as history.

Changed DA paths:

- `/index.html`
- `/why.html`
- `/test-plan.html`
- `/coverage.html`
- `/cli-surface.html`
- `/data/wave-2-cli-surface.json`
- `/waves/4-durability.html`
- `/learnings/f009-content-put-outside-worktree.html`
- `/learnings/f029-index-config-false-migration.html`

## Validation

Static checks:

- `npm run check:da-source-truth`
- `npm run lint`
- `npm run audit:dependencies`
- `npm run audit:release`
- `git diff --check`
- `dogfood/certify.yaml` dry-run: 17 valid steps
- `dogfood/promote.yaml` dry-run: 10 valid steps, including aggregate and exact-path live freshness gates

Authenticated certification command:

```sh
node /Users/mhess/aem/aem-code/da/da-cli/bin/da.js \
  --org somarc --repo da-cli-0-6-0 --branch main --commit \
  pipeline run dogfood/certify.yaml --format json
```

Successful certification run: `1777f604` — 17/17 steps completed, no warnings.

The first run is retained as `certify-run.failed.json`; it proved every source/preview/audit/freshness step and exposed the site's intentional shared-route sitemap characteristic. The corrected successful result is stored in `certify-run.json`; child-step diagnostics are stored beside each result.
