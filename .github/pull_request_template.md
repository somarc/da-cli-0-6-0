## Summary

Describe the change and why it belongs in the da-cli 0.6.0 certification site.

Fixes #<issue-number>, when applicable.

## Test URLs

- Before: https://main--da-cli-0-6-0--somarc.aem.live/
- After: https://<branch>--da-cli-0-6-0--somarc.aem.page/

Use an EDS-safe branch name containing only letters, numbers, and hyphens.

## Verification

- [ ] `npm run lint`
- [ ] `npm run audit:dependencies`
- [ ] `npm run audit:release`
- [ ] Relevant DA source was previewed and audited through `da-cli`
- [ ] No authored DA content was added to Git
