# Data Cancer: BIG_ANIMAL Game Mechanic

## Fit and premise

BIG_ANIMAL already models tribes, alliances, eras, and a corruption subsystem. Data Cancer belongs here as an information-contagion mechanic that affects how tribes make decisions. Each tribe may encounter, repeat, investigate, contain, or correct claims. This is a systems mechanic, not a judgment that a tribe's beliefs are automatically false.

A claim becomes dangerous when weakly sourced information spreads, repetition is mistaken for confirmation, and tribes make consequential decisions before checking it. The game tracks evidence independently from popularity and impact.

## Claim model

Represent each claim with:

- Stable claim ID, origin, and provenance trail.
- Status: `unverified`, `supported`, `contradicted`, `mixed`, or `unresolved`.
- Evidence references, source reliability, and source independence.
- Reach across tribes, repetition, and impact on the world.
- A separate containment/correction status.

Copied versions retain the same claim ID and source history. Repetition can increase reach and impact but does not create independent evidence. High impact raises investigation priority; it does not make a claim more or less likely to be true.

## Corruption spread system

### Network

Tribes are nodes in an information network. Alliances, trade, migration, rituals, and shared institutions can carry claims between them. Each tribe has a verification capacity influenced by its systems, such as intelligence, stability, technology, and trusted archives.

### Turn-by-turn spread

On each simulation tick, a tribe holding an unchecked claim may pass it to connected tribes. Keep factors normalized from 0 to 1:

```text
spreadChance = clamp(
  baseRate
  + 0.20 * sourceReach
  + 0.15 * repetition
  + 0.15 * sourceInfluence
  - 0.25 * destinationVerification
  - 0.20 * activeSafeguards,
  0,
  0.65
)
```

Successful exposure adds the same claim ID to the destination tribe and updates reach. Independent verification reduces future spread. Publishing a sourced correction lowers reach over subsequent ticks. Preserve the evidence history when claims are quarantined or corrected.

### Consequences

- **Low reach:** rumors create minor trust or strategy shifts.
- **Medium reach:** tribes repeat the claim and adjust alliances, production, or technology priorities.
- **High reach:** institutions act on it, alliances destabilize, and crises can emerge.
- **Containment:** temporarily slows transmission while investigation continues; it can cost trust, trade, or access.
- **Correction:** a sourced update can spread through the network, but its credibility depends on evidence and provenance.

The player sees network reach and affected tribes, with uncertain or unverified links clearly distinguished from proven effects. Corruption should not silently turn a claim into fact in the simulation.

## Player evidence toolkit

Each action should add a transparent record to a claim ledger, with evidence quality and limitations visible.

| Tool | Player action | Gameplay result |
|---|---|---|
| **Observe** | Inspect a tribe's conditions and the claimed consequences. | Records direct observations and possible mismatches. |
| **Trace** | Follow a claim through alliances, trade, migration, or shared institutions. | Reveals its origin and which repetitions are copies. |
| **Cross-check** | Compare independent sources across tribes. | Adds corroboration or contradiction; source independence matters. |
| **Ask** | Question leaders, archivists, or witnesses about their evidence and what could change their minds. | Reveals assumptions, uncertainty, and testable predictions without forcing agreement. |
| **Test** | Run a safe in-world trial, forecast check, or controlled intervention. | Adds results, method, and limits; inconclusive tests remain inconclusive. |
| **Archive** | Preserve the claim, evidence, and chain of custody. | Makes the record auditable and prevents correction from erasing history. |
| **Publish correction** | Share a concise, sourced update through trusted tribal channels. | Reduces spread when sources are credible and evidence is relevant. |
| **Quarantine** | Temporarily limit an actively harmful, unverified claim's reach. | Slows propagation during investigation, with a trust or coordination cost. |

The ledger distinguishes source count from independent source count: ten copied reports may have one origin. Confidence describes the available evidence and its gaps; it is not a hidden truth detector.

## Implementation status and integration with BIG_ANIMAL

The current core exposes a `corruption` field in `BigAnimalState`, calls `_update_corruption(snapshot)` during `tick`, and includes corruption in `snapshot()`. Use that subsystem for per-tribe exposure, claim records, verification capacity, safeguards, and outcomes.

The first implementation slice is in `core/data_cancer_engine.py`: it defines claim/evidence/exposure records, independent-source counting, the documented bounded spread formula, one-hop-per-tick propagation, and quarantine. `tests/test_data_cancer_engine.py` covers the formula, bounds, deterministic spread, evidence independence, and quarantine. It is intentionally standalone and is not yet wired into `BigAnimalCore._update_corruption`; this checkout does not include BIG_ANIMAL's imported tribe modules, so the existing core cannot currently be imported for an integration test.

Example:

```python
import random

from BIG_ANIMAL.core.data_cancer_engine import DataCancerEngine

engine = DataCancerEngine(base_rate=0.1, rng=random.Random(7))
engine.add_claim("claim-1", "ArchiveLords", impact=0.8, influence=0.7)
events = engine.advance_tick(
    {"ArchiveLords": {"PatternSeekers": 0.9}},
    verification={"PatternSeekers": 0.4},
    safeguards={"PatternSeekers": 0.2},
)
```

Remaining integration steps:

1. Connect the engine to `_update_corruption(snapshot)` and BIG_ANIMAL's actual tribe network inputs.
2. Derive verification capacity and safeguards from the chosen tribe stats without changing unrelated economy, tech, or rebirth systems.
3. Add explicit player operations and evidence-ledger persistence for cross-checking, correction, and containment costs.
4. Add integration tests for tribe-level outcomes and correction reach.

## Fairness and player goals

- Do not mark a claim false because it is unpopular, unfamiliar, or inconvenient.
- Preserve evidence for and against the player's initial theory.
- Reward correcting one's own mistaken belief as much as correcting another tribe.
- Allow containment while a claim is unresolved, but make its costs visible.
- Score careful investigation, source independence, transparent uncertainty, and effective corrections—not the number of claims erased.
- Avoid presenting a benchmark statistic as a universal hallucination rate; only use real-world figures when their source and exact measurement are verified.
