# 0.6.0 friction gate — hang our hat here

**Status:** **friction column clear** (f012, High, fixed + locked, merged to main 2026-07-14) — wave column still open  
**Site:** https://main--da-cli-0-6-0--somarc.aem.live/  
**Companion boards:** `ROADMAP.md`, `WAVES.md`, public `/test-plan`, public `/learnings`  
**Rule:** 0.6.0 is a **substantial** release. Waves prove surface coverage. **This
document proves agentic operability.** Both must pass.

## Version / branch discipline (until cut)

| Track | Policy until the dogfood EDS site proves the release |
|-------|------------------------------------------------------|
| **npm / package version** | Stay on **0.5.x** (`@somarc/da-cli`). Do not bump to 0.6.0 in `package.json` early. |
| **git branch named `0.6.0`** | **Not yet.** Open that branch only when ready to cut, after site proof. |
| **How we run `da`** | **Local tree only** — e.g. `node …/da/da-cli/bin/da.js` or a local link/path. Do not depend on published npm for dogfood proof while product fixes land on 0.5.x. |
| **What “0.6.0” means now** | Release **target and hat** (this gate + site), not a version already in the wild. |

Fixes ship in the **0.5.x** line as dogfood-driven work; the **0.6.0 label is earned by the site**, then version + branch follow.

---

## Why this gate exists

Unit tests and “command exited 0” do not certify an agent-first CLI. Dogfooding
this site exposed frictions that unit suites never would: empty error envelopes,
path semantics that lie between clone and merge, worktree safety that agents
trip on, media rewrite traps, contracts that miss autoblocks.

**0.6.0 ships only when:**

1. Waves 1–5 are green with stored evidence (and Wave 6 classified).  
2. The construction pipeline regenerates this site and provenance verifies.  
3. **Every Critical/High friction is fixed or explicitly reclassified** with
   evidence (primitive fix + lock, or accepted-risk ADR with operator workaround
   that is structured and discoverable — not “agents just know”).

If (1) and (2) pass but (3) fails, **do not cut 0.6.0**. That is the hat.

---

## Honest assessment — 2026-07-14 (f012 merged)

### Friction column: **CLEAR**

All frictions logged this cycle (**f012**) plus the earlier flywheel
(**f001–f011**) are **fixed in the local 0.5.x tree** with unit tests and
public learning pages. Nothing Critical/High remains open on this list.

| Id | Severity | Status | What we actually shipped |
|----|----------|--------|---------------------------|
| f001 | — | fixed (earlier) | site info / pin-target |
| f002 | High | **fixed** | design detect/token-check structured envelopes |
| f003–f007 | — | fixed (earlier) | index, route ownership/clean |
| f008 | Critical | **fixed** | merge path = subtree (clone-compatible) |
| f009 | High | **fixed** | out-of-tree put refuse + ownership flag messaging |
| f010 | High | **fixed** | media URL warn / `--rewrite-media-urls` / `--strict-media-urls` |
| f011 | Medium-high | **fixed** | contracts inventory + verify for autoblocks (modal/widget/fragment) |
| f012 | High | **fixed** | permission hints captured (`err.permissionHints`, `list().daPermissionHints`); 403 distinct from 401; `content list`/`get` warn proactively on read-only access. Merged to main (fast-forward, no PR — small, tested, low-risk change). |

### What “fixed” means (and what it does not)

| Claim | Honest bound |
|-------|----------------|
| Agent orientation | Better — structured refuse, clean detect, media warn, autoblock inventory |
| Platform Helix media rewrite | **Not** fully fixed at platform; CLI warn/rewrite is the contract until Helix resolves host-less `/media` |
| helix-cli parity | **Contract** parity for merge paths, not nested-git 3-way merge |
| Published npm | Still **0.5.x**; run **local** `da` — not on npm 0.6.0 |
| Full 0.6.0 release | **Not cut** — waves 2–6 incomplete |

### Wave column: **NOT CLEAR**

| Wave | Status | Honest note |
|------|--------|-------------|
| 1 Foundation | **Cut** | Evidence pack in `dogfood/evidence/wave-1/` |
| 2 Blocks/audits/design | **Cut 2026-07-14 02:51 UTC** | kitchen-sink + CLI surface + evidence re-run (`dogfood/evidence/wave-2/`) |
| 3 Index/routes | **Partial** | Sheet/index/orphan exist; full matrix incomplete |
| 4–6 | **Not started** | Pipeline/job/migrate, failure injection, lifecycle |

### Bottom line

- **Friction hat:** we can hang the agentic-operability story for this cycle —
  the logged Critical/High landmines, including f012, are closed in product
  code with locks on main.  
- **Release hat:** **do not cut 0.6.0** yet. Wave proof + construct regen +
  provenance + 0.5.x→0.6.0 branch/version discipline remain.  
- **Residual risks (not open fNNN, but real):** Helix unpublish 403 on orphans
  (`/findings` ghost CDN); skill docs may lag local CLI; media still needs
  absolute or rewrite discipline at authoring time.

---

## Open frictions

**None** on the hang-hat list as of 2026-07-14 (f012 merged).

New dogfood pain → new `fNNN` learning; do not reopen closed ids.

---

## Closed frictions (full roster)

| Id | Surface | Resolution |
|----|---------|------------|
| **f001** | site | `site info` honored target override; pin-target / `.da.json` |
| **f002** | design | design detect/token-check structured envelopes |
| **f003** | index | `da index build` path |
| **f004** | index | `--env preview` no longer silently queries live |
| **f005** | route | code assets not mislabeled orphan |
| **f006** | route | stale contentbus after source delete |
| **f007** | route | `route clean` removes orphan publications |
| **f008** | content | merge path semantics match clone (subtree) |
| **f009** | content | out-of-tree put refuse + ownership flag |
| **f010** | content, media | host-less /media img warn + rewrite/strict |
| **f011** | audit, block | contracts inventory includes autoblocks |
| **f012** | auth, content | permission hints captured; 403 distinct from 401; content list/get warn on read-only access |

---

## Cut checklist

### Friction column
- [x] f002 fixed + lock  
- [x] f008 fixed + lock  
- [x] f009 fixed + lock  
- [x] f010 fixed + lock  
- [x] f011 fixed + lock  
- [x] f012 fixed + lock (merged to main)  
- [x] Clone/merge notes in COMMANDS/AGENTS  
- [x] Public learnings show fixed for f002, f008–f012  

### Wave / release column (still required)
- [x] Wave 2 formal cut with evidence (2026-07-14 02:51 UTC)  
- [ ] Waves 3–5 green + Wave 6 classified  
- [ ] construct regen + provenance verify  
- [ ] `test-plan` records full gate clear  
- [ ] Version bump + release branch **after** site proves  

When **both** columns are checked: **cut 0.6.0**.

Last updated: **2026-07-14** — f012 (High, discovered during due-diligence on a competing CLI's docs) fixed + locked with 522/522 tests passing, merged to main by fast-forward (no PR — small, tested, low-risk); friction column clear.
