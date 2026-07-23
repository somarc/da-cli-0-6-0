# Wave 6 — lifecycle and conditional

Opened: 2026-07-17 11:53 UTC  
Status: **cut 2026-07-23 13:42 UTC** — auth, skills, direct Sidekick read, conditional integrations, and the required Configuration Service-first site lifecycle all have retained evidence. The disposable proof route remains preview-only.

## Second-site specimen

- Repository: `somarc/da-lifecycle-atlas`
- Code branch: `feature-wave-6-full-da-site`
- Pull request: https://github.com/somarc/da-lifecycle-atlas/pull/2
- Preview: https://main--da-lifecycle-atlas--somarc.aem.page/
- Feature live: https://main--da-lifecycle-atlas--somarc.aem.live/
- Canonical explainer: https://main--da-lifecycle-atlas--somarc.aem.live/explainers/helix-5-to-helix-6
- Full evidence pack: `somarc/da-lifecycle-atlas:atlas/evidence/wave-6/`

## Proven transitions

1. Expired IMS state refused before the first DA write; explicit login recovered it.
2. da-cli caught a slash-containing branch that would not map to a real EDS ref;
   the branch was renamed before construction.
3. Seven ordinary DA documents installed: home, nav, footer, explainer, plans,
   learnings, provenance.
4. The checked-in constrained construct completed 18/18 steps and stops at
   preview by design.
5. Contracts reported `missing=[]`; semantic audit returned 0 errors/0 warnings;
   design audit had 0 error-severity findings.
6. All seven feature-live routes reached 200 and 7/7 freshness.
7. Riverboat dry-run reported unsafe execution, one shell step, and zero ungated
   shell steps. Human approval explicitly granted the Grok Imagine step.
8. Grok Build 0.2.102 produced one 1280×720 image. The bundle retains
   prompt/YAML/wrapper hashes, Grok binary hash, result/image hashes, and explicit
   non-determinism non-claims.
9. Human review promoted that exact file; normal da-cli binary upload installed
   the frozen input in DA. The rendered page serves an optimized 750×422
   derivative with no `about:error` and all block states loaded.

## f038 — effective source versus legacy fstab

A separate product-shaped greenfield run on `somarc/throughline` surfaced f038 and expanded this wave's lifecycle proof into a Configuration Service contract correction.

- `f038-before-site-info.txt` — old CLI calls fstab missing while its own Helix/plain checks are green, then prescribes the file.
- `f038-before-site-list.txt` — fstab-only discovery omits Throughline and the Lifecycle Atlas.
- `f038-before-content-policy.json` — no fstab means `daBacked:false`, `strictSections:false`, and malformed DA HTML is warning-only.
- `f038-after-site-info.json` — effective DA source is observed and all checks agree.
- `f038-after-site-list.json` — versioned discovery includes modern no-fstab sites.
- `f038-after-site-model.json` — v2 separates expected from effective source/provenance.
- `f038-after-site-doctor.json` — seven checks green against Throughline.
- `f038-after-content-guard.*` — invalid section shape refuses before any write, exit 1.
- `f038-deploy-*` — committed put, preview, and publish envelopes for the learning page, hub, and coverage catalog; every envelope is `ok:true` with the effective source attached to content writes. Final classify is `contentbus` with preview/live 200; freshness is `fresh` on both tiers.

Product proof: da-cli PR #44 (containment) + PR #45 / merge `18877d6` (systemic source contract), 652/652 tests, Node 22/24 CI, release smoke, and repo health.

## 2026-07-22 lifecycle closeout attempt

The closeout used local source-tree da-cli through candidate `dc5499a`. Package
version remains `0.5.1` by release policy; `cli-status.json` retains the source
SHA and install kind so that version hold cannot hide binary skew.

### Auth — executed, refresh did not advance

- `auth status --min-validity 15m` passed.
- A deliberately oversized `3h` window refused with one `auth.status`
  envelope and executable refresh recovery.
- One best-effort `auth login --refresh` reused the helper cache and truthfully
  reported `tokenRefreshed:false`, `expiryAdvanced:false`, and
  `credentialChanged:false`.
- Post-refresh status remained valid. No token bytes, hashes, cookies, or auth
  headers are retained.

### Skills — executed after f040

An isolated lifecycle retained missing-tool refusal, successful bootstrap, and
the initial first-party install failure. That rep discovered **f040**: known
path shorthands supplied `--path` but not the explicit `--skill` selection
required by current upskill. Product PR
[`somarc/da-cli#78`](https://github.com/somarc/da-cli/pull/78) fixed and locked
both `da-cli-agent` and Stardust shorthands. The replay then passed
add → list → info → read in a disposable project and retained the installed
`SKILL.md` checksum.

### Site create — grant recovered and preview proven

The retained recovery was replayed through candidate `42af3d0` after the `config:write` grant. `grant-recovery-run.json` binds every new command to timestamp, target, exit status, stdout/stderr evidence, and the source-tree CLI provenance in `site-create-cli-status-after-grant.json`:

```sh
da --org somarc --repo da-cli-wave6-site-create --commit site register \
  --code-owner somarc --code-repo da-cli-wave6-site-create --da-org somarc
```

It returned `action: adopted-existing` and the model resolved an active, matching Configuration Service DA source. The local candidate then committed `/wave-6-proof.html` through `content put`, activated it through `preview page`, verified non-empty rendered HTML, classified it `contentbus`, and audited it with 0 errors/0 warnings. Preview is public at https://main--da-cli-wave6-site-create--somarc.aem.page/wave-6-proof. The proof route remains live 404 by design; this lifecycle rep did not publish it.

The deep doctor retained the site's existing shared-document health and reported 4/4 preview routes with one live-missing path. The separate preview-status and route-classification artifacts identify that path as `/wave-6-proof.html`.

### Code Sidekick — read-only contract proven

Direct `code sidekick get` succeeded against the certification site. A reviewed
mutation attempt on the disposable repo returned 405 without changing state and
exposed **f042**: the canonical Sidekick endpoint is GET-only. Product PR
[`somarc/da-cli#82`](https://github.com/somarc/da-cli/pull/82) removed the dead
`code sidekick set` command and transport. Configuration changes remain owned
by AEM Configuration Service / `site register`.

### Conditional integrations

- **Commerce:** fixture scaffold/inspect plus Product Bus plan and ingest
  dry-run passed. Committed ingest is `external-conditional` under stable reason
  `product-bus-site-token-and-cleanup-authority-unavailable`.
- **Stardust:** version check, public extract, local direct/prototype, and DA
  migration dry-run passed. Committed migration is `external-conditional`
  under stable reason `human-design-approval-and-cleanup-disposition-pending`; the disposable Configuration Service target is now available.

`closeout-status.json` is the machine summary and points to each retained artifact. The DA-backed `/test-plan` and `/waves/6-lifecycle` pages were updated through managed da-cli workspace push, previewed, audited, published as the reviewed two-path set, and indexed. Wave 6 is cut.

## Honest residue

- Success output for `preview pages`, `publish pages`, `audit contracts`, and
  `site freshness` still carries legacy bare array/object shapes in this proof;
  this is retained as f017 migration evidence rather than rewritten.
- The direct DA source-media URL is auth-protected, while the preview/live static
  path and rendered optimized derivative are publicly 200.
