import json
import tempfile
import unittest
from pathlib import Path
from xml.etree import ElementTree

from cave_experiments import (
    _estimate_mean,
    _holm_adjust,
    _student_t_critical_975,
    _write_outputs,
    run_recursive_stress_test,
    run_multi_seed_analysis,
    run_residue_experiment,
)


class SeedStatisticsTests(unittest.TestCase):
    def test_student_t_interval_and_p_value(self):
        summary = _estimate_mean([1.0, 2.0, 3.0], alternative="greater")

        self.assertAlmostEqual(summary["mean"], 2.0)
        self.assertAlmostEqual(_student_t_critical_975(1), 12.706204736, places=6)
        self.assertLess(summary["p_value"], 0.1)
        self.assertLess(summary["ci95_low"], summary["mean"])
        self.assertGreater(summary["ci95_high"], summary["mean"])

    def test_holm_adjustment_is_monotone_in_rank(self):
        adjusted = _holm_adjust({"a": 0.01, "b": 0.03, "c": 0.2})

        self.assertAlmostEqual(adjusted["a"], 0.03)
        self.assertAlmostEqual(adjusted["b"], 0.06)
        self.assertAlmostEqual(adjusted["c"], 0.2)

    def test_constant_nonzero_effect_uses_finite_exact_sign_test(self):
        summary = _estimate_mean([-1.0, -1.0, -1.0], alternative="less")

        self.assertIsNone(summary["t_statistic"])
        self.assertEqual(summary["test_method"], "exact_sign")
        self.assertAlmostEqual(summary["p_value"], 0.125)


class MultiSeedAnalysisTests(unittest.TestCase):
    def test_batch_is_reproducible_and_has_the_declared_schema(self):
        parameters = {
            "seed_count": 3,
            "seed_start": 50,
            "size": 7,
            "rounds": 4,
            "agents_per_round": 2,
        }
        first = run_multi_seed_analysis(**parameters)
        second = run_multi_seed_analysis(**parameters)

        self.assertEqual(first, second)
        self.assertEqual(len(first["seed_records"]), 3)
        required_fields = {
            "seed", "delta_concentration", "delta_resistance_change",
            "geodesic_length", "treatment_mean_route_length",
            "treatment_excess_steps", "treatment_stretch",
            "treatment_efficiency", "treatment_detour_rate",
        }
        self.assertTrue(required_fields.issubset(first["seed_records"][0]))
        self.assertEqual(first["parameters"]["seed_end"], 52)
        self.assertIn("p_holm", first["primary_outcomes"]["delta_concentration"])
        self.assertIn("p_bh", first["secondary_outcomes"]["treatment_excess_stretch"])

    def test_batch_outputs_include_parseable_dashboard_and_tables(self):
        analysis = run_multi_seed_analysis(
            seed_count=3,
            seed_start=70,
            size=5,
            rounds=3,
            agents_per_round=2,
        )
        residue = run_residue_experiment(size=5, rounds=3, agents_per_round=2)
        feedback = run_recursive_stress_test(
            feedback_levels=[0.0, 0.5, 1.0], steps=10, replicates=3
        )
        with tempfile.TemporaryDirectory() as temporary_directory:
            output = Path(temporary_directory)
            _write_outputs(output, residue, feedback, analysis)
            ElementTree.parse(output / "multi_seed_dashboard.svg")
            for name in (
                "multi_seed_records.csv",
                "multi_seed_aggregate.csv",
                "multi_seed_summary.json",
            ):
                self.assertTrue((output / name).is_file())


class ResidueExperimentTests(unittest.TestCase):
    def test_residue_feedback_forms_a_more_concentrated_channel(self):
        result = run_residue_experiment(
            size=9,
            rounds=8,
            agents_per_round=3,
            seed=7,
        )

        self.assertGreater(result["channel_concentration_difference"], 0)
        self.assertGreater(result["treatment"]["total_residue"], 0)
        self.assertEqual(
            result["treatment"]["total_residue"],
            result["treatment"]["total_traffic"],
        )
        self.assertAlmostEqual(result["treatment"]["traffic_residue_correlation"], 1.0)
        self.assertAlmostEqual(result["treatment"]["geodesic_route_fraction"], 1.0)
        self.assertAlmostEqual(result["control"]["geodesic_route_fraction"], 1.0)
        self.assertAlmostEqual(result["control"]["detour_rate"], 0.0)
        self.assertGreaterEqual(result["treatment"]["channel_persistence"], 0.0)
        self.assertTrue(all(value >= 1.0 for value in result["treatment"]["mean_path_stretch_by_round"]))
        self.assertTrue(all(value <= 1.0 for value in result["treatment"]["mean_geodesic_efficiency_by_round"]))
        self.assertLess(
            result["treatment"]["mean_route_resistance_last_round"],
            result["treatment"]["mean_route_resistance_first_round"],
        )
        self.assertAlmostEqual(
            result["control"]["mean_route_resistance_last_round"],
            result["control"]["mean_route_resistance_first_round"],
        )

    def test_zero_wear_strength_matches_random_geodesic_control(self):
        result = run_residue_experiment(
            size=9,
            rounds=8,
            agents_per_round=3,
            seed=7,
            wear_strength=0,
        )

        self.assertEqual(result["treatment"]["traffic"], result["control"]["traffic"])
        self.assertAlmostEqual(result["channel_concentration_difference"], 0.0)


class RecursiveStressTests(unittest.TestCase):
    def test_feedback_sweep_tracks_drift_and_variance_crossover(self):
        result = run_recursive_stress_test(
            feedback_levels=[0.0, 1.0],
            steps=60,
            replicates=4,
            seed=19,
        )

        low, high = result["measurements"]
        self.assertAlmostEqual(low["model_to_sensory_variance_ratio"], 0.0)
        self.assertGreater(high["model_to_sensory_variance_ratio"], 1_000_000)
        self.assertGreater(high["validation_divergence"], low["validation_divergence"])
        self.assertAlmostEqual(result["variance_crossover_feedback"], 0.5)
        self.assertGreaterEqual(high["validation_divergence_sd"], 0.0)

    def test_noise_scales_set_the_variance_ratio_and_crossover(self):
        result = run_recursive_stress_test(
            feedback_levels=[0.5],
            steps=10,
            replicates=2,
            model_noise=0.03,
            sensory_noise=0.06,
        )

        self.assertAlmostEqual(
            result["measurements"][0]["model_to_sensory_variance_ratio"], 0.25
        )
        self.assertAlmostEqual(result["variance_crossover_feedback"], 2 / 3)

    def test_same_seed_is_reproducible(self):
        parameters = {
            "feedback_levels": [0.0, 0.5, 1.0],
            "steps": 20,
            "replicates": 2,
            "seed": 31,
        }
        self.assertEqual(
            run_recursive_stress_test(**parameters),
            run_recursive_stress_test(**parameters),
        )

    def test_outputs_include_metrics_and_figures(self):
        residue = run_residue_experiment(size=5, rounds=3, agents_per_round=2)
        feedback = run_recursive_stress_test(
            feedback_levels=[0.0, 1.0], steps=5, replicates=1
        )
        with tempfile.TemporaryDirectory() as temporary_directory:
            output = Path(temporary_directory)
            _write_outputs(output, residue, feedback)
            self.assertIn("experiment_ii", json.loads((output / "summary.json").read_text()))
            for name in (
                "traffic_heatmap.svg",
                "route_resistance.svg",
                "path_stretch.svg",
                "feedback_sweep.svg",
                "variance_ratio.svg",
                "feedback_metrics.csv",
            ):
                self.assertTrue((output / name).is_file())


if __name__ == "__main__":
    unittest.main()