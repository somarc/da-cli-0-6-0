# Content IA — living documentation for da-cli 0.6.0

This site is not a product marketing site. It is **living documentation that
certifies the `da` CLI surface**: each public page is either a narrative of
why we dogfood, a **proof surface** that exercises commands, a **learning**
from the field, or a **lab** specimen.

DA is the sole source of truth for every authored page and sheet. Git retains
code, certification pipelines, and immutable evidence; it does not mirror DA
source documents.

---

## Four kinds of page

| Kind | Job | Grows when… | Nav |
|------|-----|-------------|-----|
| **Narrative** | Thesis, method, gate | Rarely | Primary nav |
| **Proof** | Exercise one or more CLI surfaces with public evidence | A new wave or surface needs a page | Coverage catalog (not every link in primary nav) |
| **Learning** | Dated field finding → fix → lock | Every flywheel turn | Learnings hub |
| **Lab** | Aesthetic / PE specimen (not release gate alone) | Optional PE work | Labs subsection |

Never put a long learning essay on a proof page, or a command exercise only
inside a finding. Separate concerns so the history can grow without bloating
the spine.

---

## URL map (target)

```text
/                         Home — purpose + release rule + current wave status
/why                      Why agent-first proof works this way
/test-plan                Waves 1–6 + gate definition

/coverage                 Living catalog (spine of the suite; not the full nav)
/waves/1-foundation       Wave 1 cut certificate (core loop, evidence pack)
/kitchen-sink             Wave 2 block/audit/design proof (spectrum) — Wave 2's nav landing
/route-matrix             Wave 3 proof — Wave 3's nav landing
/waves/4-durability       Wave 4 cut certificate (pipelines, durable jobs, migration)
/waves/4-riverboat-trusted-loop  Wave 4 advanced proof — trusted local shell/agent orchestration
/waves/5-failure-recovery Wave 5 live drill board (in progress → cut certificate)
/waves/6-lifecycle        Wave 6 hub — second-site lifecycle, skills, credentialed integrations, agent economics
/benchmarks/token-efficiency  Measured benchmark cluster; Round 1/2, methodology, specimens, machine sheet
/sheets                   Machine ledger hub: query index + DA sheets + CLI map
/cli-surface              Wave 2 CLI command ledger (addendum for formal cut)
/tools/wave-2-cli-surface.html  Interactive command map (codebus; flows-inspired)
/data/wave-2-cli-surface.json   Machine sheet for the CLI surface ledger
/blocks                   Short narrative: authoring vs proving → points to kitchen-sink

/learnings                Learnings hub — flywheel + index of all findings
/learnings/f001-…         One finding per route (stable id, append-only history)
/learnings/f002-…
  …

/labs/dualform            Dualform PE lab (optional; not Wave 2 gate)
/frontier                 Frontier lab — living platform proof (dogfood/LAB-FRONTIER.md)

/tests/orphan-demo        Deliberate demo artifact for route ownership
/data/coverage.json       Sheet: command family × wave × class

# Operator surfaces (not prose)
/query-index.json         Published index (wave/surface/status)
dogfood/evidence/**              CLI JSON evidence packs (git, not always DA pages)
dogfood/WAVES.md                 Execution board (git)
dogfood/ROADMAP.md               Coverage spine (git)
dogfood/FRICTION-GATE-0.6.0.md   Hang-hat 0.6.0 agentic friction gate (git)
```

**Stability rule:** learning routes use **`fNNN-short-slug`**. Numbers never
reuse; slugs may clarify but ids are permanent. Old findings stay published.

---

## Metadata contract (every proof / learning page)

Authors declare these in the page `metadata` block so the query index (and
future coverage blocks) can aggregate:

| Key | Values | Required on |
|-----|--------|-------------|
| `kind` | `narrative` \| `proof` \| `learning` \| `lab` \| `demo` | all content pages |
| `wave` | `0`–`6`, `lab`, or empty | proof / learning |
| `surface` | comma list of CLI families | proof / learning |
| `status` | `planned` \| `in-progress` \| `cut` \| `living` \| `fixed` \| `open` | all |
| `finding` | `f001` … | learning pages only |
| `Title` / `Description` | SEO + index | all |

**Wave 0** = cross-cutting flywheel (learnings hub), not “before wave 1.”

---

## How the history grows

1. **New CLI surface to certify** → add/extend a **proof** page (or kitchen-sink
   section), author it in DA through da-cli, extend the certification checks,
   and capture `dogfood/evidence/wave-N/`.
2. **Bug found while operating** → open a **learning** page
   `/learnings/fNNN-slug` with: symptom, command, wrong behavior, resolution,
   lock (test/PR). Link from `/learnings` index. Update ROADMAP findings log.
3. **Aesthetic PE** → **lab** page under `/labs/…`; do not mark Wave N cut
   because a lab looks good.
4. **Coverage** → prefer an index-driven list; until then maintain DA
   `/coverage.html` through da-cli from the same metadata fields.

Advanced proofs may sit behind their parent wave page rather than adding a
second nav item for the same wave. Riverboat follows this rule: the durable
Wave 4 certificate links to its dedicated trust-boundary proof, while the Prove
submenu remains one-link-per-wave.

Primary **nav stays short at the top level**; detail lives in **submenus**.

---

## Primary nav (spine + submenus)

Authored nested lists in DA `/nav.html` → header `nav-drop` dropdowns
(desktop) / nested stacks (mobile).

| Top level | Children |
|-----------|----------|
| **Home** | — |
| **Story** | Why · Test plan · Coverage catalog |
| **Prove** | Coverage — by wave · **Wave N — Topic** (one link per wave, 1:1 with the test plan) · Sheets & indexes |
| **Learnings** | **Direct link to hub only** — never enumerate fNNN here |
| **Labs** | Dualform · Frontier · home hero · Modal sample |

**Prove is the wave spine.** One link per wave, labeled `Wave N — Topic`
(matching coverage.html headings), pointing at that wave's proof page: an
existing primary proof (`/kitchen-sink`, `/route-matrix`) where one exists, a
**cut certificate** under `/waves/N-slug` otherwise. Artifacts (ledgers, tools
maps, JSON endpoints, narratives) live **on pages, never in nav** — the raw
machine surfaces are grouped behind the single `Sheets & indexes` link
(`/sheets`). The header renders exactly two levels; never nest deeper.

Growth rule: a wave **opens** → add its `/waves/N-slug` page (status
in-progress) + one Prove link + certification checks; a wave **cuts** → stamp
the page (status cut, timestamp, evidence pointers). Learnings go only under
the `/learnings` hub table through da-cli — **not** nav. Top-level stays
short; Prove is bounded at waves + 2 forever.

### Nav freshness (avoid content debt)

| Rule | Why |
|------|-----|
| **Learnings = hub link only** | fNNN list grows forever; the hub table is the index of record |
| **Prove submenu = one link per wave** | the nav mirrors the test plan; artifacts live on wave pages, never as nav peers |
| **JSON endpoints never in nav** | operator surfaces belong on `/sheets`, annotated, not as raw dropdown links |
| **Source of truth** | DA `/nav.html`; inspect/change/preview it through da-cli only |
| **When adding a learning** | author the page and hub row in DA through da-cli; **do not** edit nav |
| **When a wave opens** | DA `/waves/N-slug` page (in-progress) + one Prove link + certification checks |
| **When a wave cuts** | stamp the wave page: status cut, timestamp, evidence pointers, findings list |
| **Optional later** | query-index-driven nav for Prove only; Learnings stay hub-only forever |

Anti-pattern already logged: *“Nav that grows one link per finding.”*

---

## Relationship to validation

| Claim | Where it lives |
|-------|----------------|
| “We exercise content put/preview” | Wave 1 proof + evidence pack |
| “We exercise full block spectrum” | `/kitchen-sink` + contracts audit |
| “We found X and fixed it” | `/learnings/fNNN-…` + ROADMAP |
| “Release may cut” | `/test-plan` gate + all required waves green |

The site’s public HTML is the **human-readable ledger**; `dogfood/evidence/`
is the **machine-readable ledger**. Both are part of the documentation.

---

## Anti-patterns

- One mega-page that mixes thesis, all waves, and all findings
- Renaming or deleting learning URLs after the fact
- Calling a lab page a wave cut
- Authored-content mirrors in Git or out-of-band DA admin writes
- Nav that grows one link per finding (use the learnings index)
