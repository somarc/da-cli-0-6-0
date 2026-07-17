# Wave 6 — lifecycle and conditional

Opened: 2026-07-17 11:53 UTC  
Status: **in progress** — second-site and credentialed-integration slices proved;
remaining lifecycle/skills classification stays open.

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

## Honest residue

- This does **not** cut Wave 6 by itself. Remaining lifecycle/skills conditions
  must be classified and closed or explicitly deferred.
- Success output for `preview pages`, `publish pages`, `audit contracts`, and
  `site freshness` still carries legacy bare array/object shapes in this proof;
  this is retained as f017 migration evidence rather than rewritten.
- The direct DA source-media URL is auth-protected, while the preview/live static
  path and rendered optimized derivative are publicly 200.
