# Content IA — living documentation for da-cli 0.6.0

This site is not a product marketing site. It is **living documentation that
certifies the `da` CLI surface**: each public page is either a narrative of
why we dogfood, a **proof surface** that exercises commands, a **learning**
from the field, or a **lab** specimen.

Git fixtures under `dogfood/fixtures/` remain upstream of DA (`construct.yaml`).

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
/kitchen-sink             Wave 2 block/audit/design proof (spectrum)
/blocks                   Short narrative: authoring vs proving → points to kitchen-sink

/learnings                Learnings hub — flywheel + index of all findings
/learnings/f001-…         One finding per route (stable id, append-only history)
/learnings/f002-…
  …

/labs/dualform            Dualform PE lab (optional; not Wave 2 gate)

/tests/orphan-demo        Deliberate demo artifact for route ownership
/data/coverage.json       Sheet: command family × wave × class

# Operator surfaces (not prose)
/query-index.json         Published index (wave/surface/status)
dogfood/evidence/**       CLI JSON evidence packs (git, not always DA pages)
dogfood/WAVES.md          Execution board (git)
dogfood/ROADMAP.md        Coverage spine (git)
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
   section), wire `construct.yaml`, capture `dogfood/evidence/wave-N/`.
2. **Bug found while operating** → open a **learning** page
   `/learnings/fNNN-slug` with: symptom, command, wrong behavior, resolution,
   lock (test/PR). Link from `/learnings` index. Update ROADMAP findings log.
3. **Aesthetic PE** → **lab** page under `/labs/…`; do not mark Wave N cut
   because a lab looks good.
4. **Coverage** → prefer index-driven list; until then hand-curate
   `coverage.html` from the same metadata fields.

Primary **nav stays small** (spine only). Coverage and learnings absorb growth.

---

## Primary nav (spine)

Keep intentional and short:

1. Home  
2. Why  
3. Test plan  
4. Coverage  
5. Learnings  
6. Kitchen sink *(Wave 2 proof — temporary prominence until cut)*  
7. Labs *(optional single entry to dualform)*  

Everything else lives under Coverage or Learnings.

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
- Hand-only DA edits that drift fixtures  
- Nav that grows one link per finding (use the learnings index)  
