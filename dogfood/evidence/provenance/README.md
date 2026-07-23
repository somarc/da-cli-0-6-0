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

Machine evidence: `liveness.json`.

## Why this is not frozen

Strict validation intentionally exits 1 because final release state does not yet
exist:

- `freeze.status` is `candidate`, not `frozen`;
- CLI tag `v0.6.0` does not exist;
- proof-site tag `proof-v0.6.0` does not exist;
- an authenticated DA source snapshot/digest has not been captured;
- isolated replay has not yet been executed; the Configuration Service grant and registered disposable target are now available, so this step is unblocked and moves next under issue #69.

The exact refusal is retained in `strict-freeze.stderr.txt`. A mutable `main`
branch or a future expected tag is not described as immutable proof.

## Final freeze procedure

With the external grant verified and the registered isolated target ready:

1. Refresh DA authentication interactively if required.
2. Through local da-cli only, fence DA inventory before/after an ignored
   `content clone --all`, retain path/type/version/source SHA-256 observations,
   and calculate `daSnapshotSha256` without committing authored bodies.
3. Replay the snapshot through da-cli to the registered isolated site, preview,
   approve canonical promotion, rebuild the index, and compare normalized
   artifacts.
4. Re-run certification and promotion with the final candidate; update run IDs,
   evidence hashes, and candidate CLI SHA.
5. Create and verify `v0.6.0` and `proof-v0.6.0` against the recorded commits.
6. Change the manifest to `frozen`, add source digests, and run:

   ```sh
   npm run audit:provenance:strict
   ```

7. Only then may the release workflow publish npm/GitHub `0.6.0`.

## Source-authority boundary

No authored HTML/JSON/media bodies are retained here or reconstructed from Git.
DA remains authoritative. Git retains only code, pipelines, canonical path sets,
schemas, hashes, and redacted evidence.
