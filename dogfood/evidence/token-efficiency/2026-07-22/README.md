# Token-efficiency matched-task pilot — 2026-07-22

This evidence pack records the first controlled, end-to-end comparison of two
ways an AI coding agent can write and preview the same DA-backed EDS page:

- **Arm A:** local `da-cli` only for DA and preview operations;
- **Arm B:** Adobe's public `da-auth` and `da-content` skills plus the documented
  DA Source and AEM Admin APIs; no `da-cli`.

Both arms used the same model (`gpt-5.6-terra`), effort (`high`), repository,
feature branch, fixed page body, acceptance contract, and browser verification.
The paths differed only to keep both results publicly inspectable. Neither arm
called a live/publish/deploy endpoint.

## Result

Both arms passed all five acceptance checks. In this single matched pair,
`da-cli` used:

- **26.3% fewer provider-reported logical tokens** (`input + output`);
- **47.9% fewer uncached input tokens**;
- **28.9% lower estimated provider cost**.

Wall time was effectively tied: 326.9 seconds versus 328.4 seconds. The
`da-cli` arm used more model rounds because three browser-verification attempts
failed before direct navigation succeeded. Those failures are retained rather
than edited out.

The act of publishing the result sheet surfaced a follow-up candidate: the
sheet preview succeeded and its public JSON returned HTTP 200, but the CLI's
document-oriented preview verifier probed `.json.plain.html`, while
`site freshness` probed `.json.html`. Both reported missing. This evidence pack
records that behavior without assigning a finding number before product triage.

This is a measured **N=1 pilot**, not a universal performance claim. See
`protocol.md` and `results.json` for denominators and limitations.

## Round 2

[`round-2-multi-block/`](./round-2-multi-block/) repeats the comparison with
eight deterministic EDS blocks and exact runtime DOM checks. Both arms passed;
da-cli used 33.0% fewer logical tokens, 34.6% lower estimated provider cost,
and 11.5% fewer rounds. The arms ran sequentially to remove the shared-browser
contention present in Round 1.

## Public specimens

- Round 1 result: <https://feature-token-efficiency-benchmark--da-cli-0-6-0--somarc.aem.page/benchmarks/token-efficiency/round-1>
- Round 2 result: <https://feature-token-efficiency-benchmark--da-cli-0-6-0--somarc.aem.page/benchmarks/token-efficiency/round-2>
- da-cli arm: <https://feature-token-efficiency-benchmark--da-cli-0-6-0--somarc.aem.page/benchmarks/token-efficiency/da-cli>
- Adobe-skills arm: <https://feature-token-efficiency-benchmark--da-cli-0-6-0--somarc.aem.page/benchmarks/token-efficiency/adobe-skills>
- methodology: <https://feature-token-efficiency-benchmark--da-cli-0-6-0--somarc.aem.page/benchmarks/token-efficiency/methodology>

## Files

- `protocol.md` — preregistered task shape, controls, metrics, and caveats;
- `results.json` — machine-readable provider usage, outcomes, and deltas;
- `arm-a-da-cli.json` — redacted command/action ledger;
- `arm-b-adobe-skills.json` — redacted API/action ledger.

No credentials, access tokens, raw authorization headers, or live mutations are
stored in this evidence pack.
