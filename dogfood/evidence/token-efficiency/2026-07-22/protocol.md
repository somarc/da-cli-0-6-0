# Protocol

## Question

For one fixed DA-authored EDS page-create-and-preview task, how does agent token
usage differ when the operating surface is `da-cli` versus Adobe's public EDS
skills and documented APIs?

## Fixed task

Each arm had to:

1. create an exact supplied HTML body in a temporary file outside Git;
2. write authoritative DA source at its assigned benchmark path;
3. activate the page on branch `feature-token-efficiency-benchmark`;
4. verify the public preview and `.plain.html`;
5. make no live/publish/deploy call.

Acceptance required:

- source write succeeded;
- feature preview returned HTTP 200;
- `.plain.html` contained `TOKEN-BENCH-2026-07-22` and exactly one H1;
- `.plain.html` contained zero script elements and zero media attributes whose
  value referenced `about:error`;
- no live operation was attempted.

The pages differed only in arm label, title, description, and assigned path.

## Controlled variables

- model: `gpt-5.6-terra`;
- effort: `high`;
- same Studio system/tool environment;
- clean child conversation per arm;
- same repository and feature branch;
- same fixed task prompt and acceptance checks;
- both arms ran concurrently to reduce environmental drift;
- no Git-authored content fixtures;
- no live publication.

## Arm-specific access

### Arm A — da-cli

- local source-tree CLI at `/Users/mhess/aem/aem-code/da/da-cli/bin/da.js`;
- ordinary shell only for the temporary payload and byte comparison;
- Studio browser for public verification;
- prohibited from reading Adobe skill/API documentation or using raw admin
  APIs.

### Arm B — Adobe public skills

- public `da-auth/SKILL.md` and `da-content/SKILL.md`;
- task-directed `references/html-content.md` and `references/platform.md`;
- documented DA Source API and AEM Admin preview endpoint;
- Studio browser for public verification;
- prohibited from invoking `da-cli` or reading its help/source.

The user granted a narrow exception to the site's normal da-cli-only operating
rule for Arm B's dedicated benchmark path. The exception covered preview only,
not live publication. The existing DA token stayed process-local and was never
printed or persisted by the run.

## Token accounting

Provider-reported fields are authoritative for this pilot:

- `input_tokens`: logical input processed across model rounds;
- `cached_input_tokens`: subset served from provider prompt cache;
- `uncached_input_tokens = input_tokens - cached_input_tokens`;
- `output_tokens`: provider-reported output tokens;
- `logical_token_load = input_tokens + output_tokens`.

Reasoning tokens are reported separately and are not added again to logical
load. Estimated cost uses the provider's provisional public pricing record
captured by Studio on 2026-07-22.

## Interpretation boundary

This pilot measures one already-specified page construction task. It does not
measure greenfield repository creation, content strategy, custom block coding,
media production, bulk operation, failure recovery, or live release. It is
maintainer-sponsored, model- and harness-dependent, and has one pair only.

The public result must therefore say **"in the first matched run"**, not
"da-cli always saves 26.3%." A confirmatory claim needs multiple seeded tasks,
multiple trials, frozen cold/warm cache strata, and confidence intervals.
