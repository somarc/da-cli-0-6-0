# Wave 2 evidence pack — **CUT 2026-07-14 02:51 UTC**

Formal Wave 2 cut for da-cli-0-6-0 dogfood (blocks / audits / design).

**CLI:** local `@somarc/da-cli` 0.5.x tree (`node da/da-cli/bin/da.js`)  
**Target:** `somarc/da-cli-0-6-0` · branch `main`  
**Proof pages:** `/kitchen-sink`, `/cli-surface`, `/tools/wave-2-cli-surface.html`

## Captures (this cut)

| File | Command | Exit | Result |
|------|---------|------|--------|
| `audit-contracts.json` | `audit contracts --prefix / --verify-code` | 0 | 23 pages, 19 blocks, missing=[], autoblocks=[fragment,modal,widget] |
| `audit-full-kitchen-sink.json` | `audit full /kitchen-sink` | 0 | `ok: true`, errors 0, warnings 0 |
| `design-detect-kitchen-sink.json` | `design detect /kitchen-sink` | 0 | `status: clean` (f002 envelope) |
| `design-token-check-kitchen-sink.json` | `design token-check /kitchen-sink` | 1 | `status: no-design-tokens` — **intentional** (Renderaissance ≠ stardust tokens) |
| `design-audit-kitchen-sink.json` | `design audit /kitchen-sink` | 0 | no error-severity findings |

## Documented partials (not blockers)

| Surface | Status | Note |
|---------|--------|------|
| `block list` / `block inspect` | partial | Built-in contracts sparse; code-bus verify via contracts is primary |
| `design token-check` | intentional non-ok | Structured envelope; site is not stardust-token branded |

## Public ledger

- Human: https://main--da-cli-0-6-0--somarc.aem.live/cli-surface  
- Interactive: https://main--da-cli-0-6-0--somarc.aem.live/tools/wave-2-cli-surface.html  
- Sheet: https://main--da-cli-0-6-0--somarc.aem.live/data/wave-2-cli-surface.json  

## Re-run

```bash
cd da/da-cli-0-6-0
BIN=../da-cli/bin/da.js
ORG=somarc REPO=da-cli-0-6-0
node $BIN --org $ORG --repo $REPO --format json audit contracts --prefix / --verify-code \
  | tee dogfood/evidence/wave-2/audit-contracts.json
node $BIN --org $ORG --repo $REPO --format json audit full /kitchen-sink \
  | tee dogfood/evidence/wave-2/audit-full-kitchen-sink.json
```
