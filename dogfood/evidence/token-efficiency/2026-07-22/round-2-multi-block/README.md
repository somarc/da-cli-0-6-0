# Round 2 — multi-block matched task

Round 2 repeated the token-efficiency comparison with a fixed 4.5 KB,
kitchen-sink-like page containing eight deterministic, media-free blocks:
`hero`, `cards`, `columns`, `quote`, `accordion`, `tabs`, `table`, and
`teaser`.

Both arms had to prove source byte equality, feature preview and plain HTML,
all eight authored classes, exact runtime DOM transformations, zero block and
console errors, and 16/16 block JS/CSS assets at HTTP 200. Live publication
was prohibited.

Unlike Round 1, the arms ran sequentially so they could not contend for the
space's single shared browser dock. Adobe-public ran first; da-cli ran second.

## Result

Both arms qualified. In this matched pair, da-cli used:

- **33.0% fewer logical tokens** (`input + output`);
- **56.1% fewer uncached input tokens**;
- **34.6% lower estimated provider cost**;
- **11.5% fewer model rounds**;
- **36.3% less wall time**.

The da-cli arm still paid one expected safety seam: its first `/tmp` upload was
refused until `--allow-outside-worktree` was explicit. The Adobe-public arm had
one local browser-expression syntax failure and three provider stream recovery
attempts. All remote Source/Preview operations in both arms succeeded first
attempt.

This remains one matched pair. It is evidence, not a confidence interval.

## Public specimens

- da-cli: <https://feature-token-efficiency-benchmark--da-cli-0-6-0--somarc.aem.page/benchmarks/token-efficiency/round-2-da-cli>
- Adobe public skills/APIs: <https://feature-token-efficiency-benchmark--da-cli-0-6-0--somarc.aem.page/benchmarks/token-efficiency/round-2-adobe-skills>

No credentials or authorization headers are retained.
