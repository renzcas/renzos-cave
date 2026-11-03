"""Claim records and a deterministic-testable information spread engine."""

from dataclasses import dataclass, field
import random
from typing import Dict, List, Mapping, Optional, Set


CLAIM_STATUSES = {"unverified", "supported", "contradicted", "mixed", "unresolved"}
SPREADABLE_STATUSES = {"unverified", "unresolved"}


def _unit_interval(name: str, value: float) -> float:
    if not isinstance(value, (int, float)) or isinstance(value, bool):
        raise TypeError(f"{name} must be a number between 0 and 1")
    if not 0 <= value <= 1:
        raise ValueError(f"{name} must be between 0 and 1")
    return float(value)


def _nonempty_string(name: str, value: str) -> str:
    if not isinstance(value, str):
        raise TypeError(f"{name} must be a string")
    if not value.strip():
        raise ValueError(f"{name} must not be empty")
    return value


def calculate_spread_probability(
    base_rate: float,
    source_reach: float,
    repetition: float,
    source_influence: float,
    destination_verification: float,
    active_safeguards: float,
) -> float:
    """Return one-tick spread probability from normalized, auditable factors."""
    values = {
        "base_rate": base_rate,
        "source_reach": source_reach,
        "repetition": repetition,
        "source_influence": source_influence,
        "destination_verification": destination_verification,
        "active_safeguards": active_safeguards,
    }
    normalized = {name: _unit_interval(name, value) for name, value in values.items()}
    probability = (
        normalized["base_rate"]
        + 0.20 * normalized["source_reach"]
        + 0.15 * normalized["repetition"]
        + 0.15 * normalized["source_influence"]
        - 0.25 * normalized["destination_verification"]
        - 0.20 * normalized["active_safeguards"]
    )
    return min(0.65, max(0.0, probability))


@dataclass
class EvidenceRecord:
    evidence_id: str
    source_id: str
    independence_key: str
    quality: float
    supports_claim: Optional[bool] = None

    def __post_init__(self) -> None:
        for field_name in ("evidence_id", "source_id", "independence_key"):
            _nonempty_string(field_name, getattr(self, field_name))
        self.quality = _unit_interval("quality", self.quality)
        if self.supports_claim is not None and not isinstance(self.supports_claim, bool):
            raise ValueError("supports_claim must be True, False, or None")


@dataclass
class ClaimExposure:
    tribe_id: str
    reach: float
    repetition: float
    influence: float

    def __post_init__(self) -> None:
        _nonempty_string("tribe_id", self.tribe_id)
        self.reach = _unit_interval("reach", self.reach)
        self.repetition = _unit_interval("repetition", self.repetition)
        self.influence = _unit_interval("influence", self.influence)


@dataclass
class ClaimRecord:
    claim_id: str
    origin_tribe: str
    status: str = "unverified"
    impact: float = 0.5
    evidence: List[EvidenceRecord] = field(default_factory=list)
    exposures: Dict[str, ClaimExposure] = field(default_factory=dict)
    quarantined_tribes: Set[str] = field(default_factory=set)

    def __post_init__(self) -> None:
        _nonempty_string("claim_id", self.claim_id)
        _nonempty_string("origin_tribe", self.origin_tribe)
        if self.status not in CLAIM_STATUSES:
            raise ValueError(f"status must be one of {sorted(CLAIM_STATUSES)}")
        self.impact = _unit_interval("impact", self.impact)

    @property
    def independent_source_count(self) -> int:
        return len({item.independence_key for item in self.evidence})

    def add_evidence(self, record: EvidenceRecord) -> None:
        if any(existing.evidence_id == record.evidence_id for existing in self.evidence):
            raise ValueError(f"duplicate evidence_id: {record.evidence_id}")
        self.evidence.append(record)


@dataclass(frozen=True)
class Transmission:
    claim_id: str
    source_tribe: str
    destination_tribe: str
    probability: float


class DataCancerEngine:
    """Propagate unverified claims through a directed tribe network one tick at a time."""

    def __init__(self, base_rate: float = 0.1, rng: Optional[random.Random] = None):
        self.base_rate = _unit_interval("base_rate", base_rate)
        self.rng = rng if rng is not None else random.Random()
        self.claims: Dict[str, ClaimRecord] = {}
        self.tick_count = 0

    def add_claim(
        self,
        claim_id: str,
        origin_tribe: str,
        *,
        status: str = "unverified",
        impact: float = 0.5,
        reach: float = 0.1,
        influence: float = 0.5,
    ) -> ClaimRecord:
        if claim_id in self.claims:
            raise ValueError(f"claim already exists: {claim_id}")
        claim = ClaimRecord(
            claim_id=claim_id,
            origin_tribe=origin_tribe,
            status=status,
            impact=impact,
            exposures={
                origin_tribe: ClaimExposure(
                    tribe_id=origin_tribe,
                    reach=reach,
                    repetition=0.0,
                    influence=influence,
                )
            },
        )
        self.claims[claim_id] = claim
        return claim

    def advance_tick(
        self,
        connections: Mapping[str, Mapping[str, float]],
        *,
        verification: Optional[Mapping[str, float]] = None,
        safeguards: Optional[Mapping[str, float]] = None,
    ) -> List[Transmission]:
        """Attempt one-hop transmissions; newly exposed tribes spread next tick."""
        verification = verification or {}
        safeguards = safeguards or {}
        transmissions: List[Transmission] = []

        for tribe_id, value in verification.items():
            _unit_interval(f"verification[{tribe_id}]", value)
        for tribe_id, value in safeguards.items():
            _unit_interval(f"safeguards[{tribe_id}]", value)
        for source, destinations in connections.items():
            if not isinstance(destinations, Mapping):
                raise TypeError(f"connections[{source}] must map tribes to strengths")
            for destination, strength in destinations.items():
                _unit_interval(f"connections[{source}][{destination}]", strength)

        for claim in sorted(self.claims.values(), key=lambda item: item.claim_id):
            if claim.status not in SPREADABLE_STATUSES:
                continue
            current_exposures = list(claim.exposures.values())
            for source_exposure in sorted(current_exposures, key=lambda item: item.tribe_id):
                for destination, connection_strength in sorted(
                    connections.get(source_exposure.tribe_id, {}).items()
                ):
                    if destination in claim.quarantined_tribes:
                        continue
                    probability = calculate_spread_probability(
                        self.base_rate,
                        source_exposure.reach,
                        source_exposure.repetition,
                        source_exposure.influence,
                        verification.get(destination, 0.0),
                        safeguards.get(destination, 0.0),
                    ) * connection_strength
                    if self.rng.random() >= probability:
                        continue

                    existing = claim.exposures.get(destination)
                    if existing is None:
                        claim.exposures[destination] = ClaimExposure(
                            tribe_id=destination,
                            reach=min(1.0, source_exposure.reach + 0.1 * connection_strength),
                            repetition=min(1.0, source_exposure.repetition + 0.1),
                            influence=source_exposure.influence,
                        )
                    else:
                        existing.reach = min(
                            1.0, max(existing.reach, source_exposure.reach + 0.1 * connection_strength)
                        )
                        existing.repetition = min(
                            1.0, existing.repetition + 0.1
                        )
                    transmissions.append(
                        Transmission(
                            claim_id=claim.claim_id,
                            source_tribe=source_exposure.tribe_id,
                            destination_tribe=destination,
                            probability=probability,
                        )
                    )

        self.tick_count += 1
        return transmissions

    def quarantine(self, claim_id: str, tribe_id: str) -> None:
        self.claims[claim_id].quarantined_tribes.add(tribe_id)

    def snapshot(self) -> dict:
        """Return plain data suitable for a simulation snapshot."""
        return {
            "tick": self.tick_count,
            "claims": {
                claim_id: {
                    "origin_tribe": claim.origin_tribe,
                    "status": claim.status,
                    "impact": claim.impact,
                    "independent_source_count": claim.independent_source_count,
                    "exposures": {
                        tribe_id: {
                            "reach": exposure.reach,
                            "repetition": exposure.repetition,
                            "influence": exposure.influence,
                        }
                        for tribe_id, exposure in sorted(claim.exposures.items())
                    },
                    "quarantined_tribes": sorted(claim.quarantined_tribes),
                }
                for claim_id, claim in sorted(self.claims.items())
            },
        }
