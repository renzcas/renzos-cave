import random
import unittest

from BIG_ANIMAL.core.data_cancer_engine import (
    ClaimRecord,
    DataCancerEngine,
    EvidenceRecord,
    calculate_spread_probability,
)


class AlwaysSpreadRandom(random.Random):
    def random(self):
        return 0.0


class DataCancerEngineTests(unittest.TestCase):
    def test_probability_uses_documented_factors(self):
        probability = calculate_spread_probability(
            base_rate=0.1,
            source_reach=0.5,
            repetition=0.4,
            source_influence=0.6,
            destination_verification=0.2,
            active_safeguards=0.3,
        )
        self.assertAlmostEqual(probability, 0.24)

    def test_probability_is_bounded_and_rejects_invalid_factors(self):
        self.assertEqual(
            calculate_spread_probability(1, 1, 1, 1, 0, 0),
            0.65,
        )
        self.assertEqual(
            calculate_spread_probability(0, 0, 0, 0, 1, 1),
            0.0,
        )
        with self.assertRaises(ValueError):
            calculate_spread_probability(0.1, 1.1, 0, 0, 0, 0)

    def test_transmission_moves_one_hop_per_tick(self):
        engine = DataCancerEngine(base_rate=0.65, rng=AlwaysSpreadRandom())
        claim = engine.add_claim("claim-1", "A")
        network = {"A": {"B": 1.0}, "B": {"C": 1.0}}

        first_tick = engine.advance_tick(network)
        self.assertEqual(
            [(item.source_tribe, item.destination_tribe) for item in first_tick],
            [("A", "B")],
        )
        self.assertNotIn("C", claim.exposures)

        second_tick = engine.advance_tick(network)
        self.assertIn("C", claim.exposures)
        self.assertTrue(any(item.destination_tribe == "C" for item in second_tick))

    def test_verification_safeguards_and_quarantine_suppress_spread(self):
        engine = DataCancerEngine(base_rate=0.1, rng=AlwaysSpreadRandom())
        engine.add_claim("claim-1", "A", reach=0, influence=0)

        engine.advance_tick({"A": {"B": 1}}, verification={"B": 1}, safeguards={"B": 1})
        self.assertNotIn("B", engine.claims["claim-1"].exposures)

        engine.quarantine("claim-1", "B")
        engine.advance_tick({"A": {"B": 1}})
        self.assertNotIn("B", engine.claims["claim-1"].exposures)

    def test_only_unverified_or_unresolved_claims_spread(self):
        engine = DataCancerEngine(base_rate=0.65, rng=AlwaysSpreadRandom())
        engine.add_claim("supported", "A", status="supported")
        engine.add_claim("unresolved", "A", status="unresolved")

        engine.advance_tick({"A": {"B": 1}})

        self.assertNotIn("B", engine.claims["supported"].exposures)
        self.assertIn("B", engine.claims["unresolved"].exposures)

    def test_evidence_tracks_independent_sources_and_snapshot(self):
        claim = ClaimRecord("claim-1", "A")
        claim.add_evidence(EvidenceRecord("e1", "archive-copy-1", "original-source", 0.8))
        claim.add_evidence(EvidenceRecord("e2", "archive-copy-2", "original-source", 0.7))
        self.assertEqual(claim.independent_source_count, 1)

        engine = DataCancerEngine()
        engine.claims[claim.claim_id] = claim
        snapshot = engine.snapshot()
        self.assertEqual(snapshot["claims"]["claim-1"]["independent_source_count"], 1)
        self.assertEqual(snapshot["claims"]["claim-1"]["status"], "unverified")

    def test_duplicate_claim_and_evidence_ids_are_rejected(self):
        engine = DataCancerEngine()
        engine.add_claim("claim-1", "A")
        with self.assertRaises(ValueError):
            engine.add_claim("claim-1", "B")

        claim = engine.claims["claim-1"]
        record = EvidenceRecord("e1", "archive", "source", 0.5)
        claim.add_evidence(record)
        with self.assertRaises(ValueError):
            claim.add_evidence(record)

    def test_seeded_engines_produce_the_same_spread(self):
        first = DataCancerEngine(base_rate=0.4, rng=random.Random(23))
        second = DataCancerEngine(base_rate=0.4, rng=random.Random(23))
        first.add_claim("claim-1", "A")
        second.add_claim("claim-1", "A")
        network = {"A": {"B": 1.0, "C": 0.8}, "B": {"C": 0.5}}

        for _ in range(5):
            first.advance_tick(network)
            second.advance_tick(network)
        self.assertEqual(first.snapshot(), second.snapshot())


if __name__ == "__main__":
    unittest.main()
