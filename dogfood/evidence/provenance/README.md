# DA-native 0.6.0 provenance candidate

Status: **candidate, not frozen**

Issue: https://github.com/somarc/da-cli/issues/69

## What is now proven

- `dogfood/provenance.json` conforms to the versioned
  `da-cli.dogfood-provenance.v1` contract.
- All 58 paths in `dogfood/canonical-pages.txt` have exactly one DA-source
  provenance entry. The previous manifest covered only 7 of 58 canonical paths.
- Seven supporting artifacts are classified separately: three DA sheets, one
  codebus stylesheet, query index, sitemap, and one deliberately blocked
  historical DA-media URL.
- Every artifact binds to the checked certification/promotion pipeline,
  run ID, actual run CLI SHA (`f0b0078`), immutable evidence files, and public
  delivery expectations.
- Pipeline definitions, canonical manifest, and evidence files are SHA-256
  bound.
- Public liveness checked 125 URLs with bounded retries: **125/125 matched their
  declared status/type contract**. All 58 canonical documents were HTTP 200 on
  preview and live and passed byte-parity comparison.
- The retired Riverboat direct media URL remains explicitly classified blocked
  with expected 404, so it cannot be mistaken for current verified media proof.
- An authenticated inventory fence observed the same **113 DA artifacts** before
  and after clone and bound their paths, types, byte lengths, and source hashes
  to snapshot digest
  `8c5457e562ef1c1a777a150e72ff785e63515a5861fae2402c300cd774c4ea35`.
- The snapshot was replayed through local da-cli to
  `somarc/da-cli-wave6-site-create` on isolated code branch
  `proof-v0-6-0-replay` at `335f488`; source and target inventories match
  **113/113** with no extras or omissions.
- Preview-only activation verified **79/79 HTML documents**. All 79 return HTTP
  200 and are fresh on the isolated preview host. No replay route was published
  live; 76 remain live 404 and three pre-existing shared routes are live-stale.

Machine evidence: `liveness.json` and `replay-2026-07-23/summary.json`, with the
redacted snapshot, command, inventory, preview, and freshness observations in
that replay directory. No authored bodies are retained there.

## Why this is not frozen

Strict validation intentionally exits 1 because final release state does not yet
exist:

- `freeze.status` is `candidate`, not `frozen`;
- CLI tag `v0.6.0` does not exist;
- proof-site tag `proof-v0.6.0` does not exist;
- certification and promotion have not yet been rerun with the final `0.6.0`
  product candidate;
- final per-source digest/status bindings and immutable tag verification remain
  release-signoff work.

The exact refusal is retained in `strict-freeze.stderr.txt`. A mutable `main`
branch or a future expected tag is not described as immutable proof.

## Final freeze procedure

The authenticated snapshot and isolated preview-only replay are complete. The
remaining final-freeze procedure is:

1. Re-run certification and promotion with the final candidate; update run IDs,
   evidence hashes, and candidate CLI SHA.
2. Review and bind final per-source digests/statuses from the authenticated
   snapshot; retain the replay evidence in the immutable proof commit.
3. Create and verify `v0.6.0` and `proof-v0.6.0` against the recorded commits.
4. Change the manifest to `frozen` and run:

   ```sh
   npm run audit:provenance:strict
   ```

5. Only then may the release workflow publish npm/GitHub `0.6.0`.

## Source-authority boundary

No authored HTML/JSON/media bodies are retained here or reconstructed from Git.
DA remains authoritative. Git retains only code, pipelines, canonical path sets,
schemas, hashes, and redacted evidence.
