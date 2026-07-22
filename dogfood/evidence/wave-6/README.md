# Wave 6 — lifecycle and conditional

Opened: 2026-07-17 11:53 UTC  
Status: **blocked on one external grant** — auth, skills, direct Sidekick read,
and conditional integration classification are retained; the required live
`site create` rep created its disposable GitHub repo but cannot finish
Configuration Service registration without `config:write` for `somarc`.

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

### Site create — required rep blocked on `config:write`

`da --commit site create da-cli-wave6-site-create` created the public,
disposable code repository:

https://github.com/somarc/da-cli-wave6-site-create

The subsequent Configuration Service `PUT` was refused with 403. The CLI
contained the partial lifecycle and emitted the exact recovery:

```sh
da --org somarc --repo da-cli-wave6-site-create --commit site register \
  --code-owner somarc --code-repo da-cli-wave6-site-create --da-org somarc
```

The canonical API contract identifies the missing authority as
`config:write`. Re-authentication is not presented as a fix for authorization.
The repo is retained unmodified through the 0.6 verification window; no live
publish occurred.

The blocked replay also found **f041**: `site model` consumed the current
checkout's unrelated fstab for an explicit target. Product PR
[`somarc/da-cli#80`](https://github.com/somarc/da-cli/pull/80) made model and
doctor probe the requested repo. The after replay now agrees with `site info`:
the partially created site is `unconfigured`, not a legacy mount to the
certification site.

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
  under stable reason `approved-disposable-da-target-and-cleanup-unavailable`.

`closeout-status.json` is the machine summary and points to each retained
artifact. Wave 6 is **not cut** until `config:write` is granted, the recorded
site-registration recovery succeeds, minimal DA content is previewed and
verified on the disposable site, and the DA-backed Wave 6/test-plan pages are
updated through da-cli.

## Honest residue

- This does **not** cut Wave 6 by itself. One required-destructive lifecycle
  transition remains blocked on external Configuration Service `config:write`.
- Success output for `preview pages`, `publish pages`, `audit contracts`, and
  `site freshness` still carries legacy bare array/object shapes in this proof;
  this is retained as f017 migration evidence rather than rewritten.
- The direct DA source-media URL is auth-protected, while the preview/live static
  path and rendered optimized derivative are publicly 200.
