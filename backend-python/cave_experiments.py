"""Reproducible, dependency-free toy experiments for Cave Physics."""

from __future__ import annotations

import argparse
import csv
import heapq
import json
import math
import random
import statistics
from functools import lru_cache
from pathlib import Path
from typing import Iterable, Sequence

Point = tuple[int, int]
Vector = tuple[float, float, float]


def _pearson(left: Sequence[float], right: Sequence[float]) -> float:
    left_mean = statistics.mean(left)
    right_mean = statistics.mean(right)
    left_delta = [value - left_mean for value in left]
    right_delta = [value - right_mean for value in right]
    denominator = math.sqrt(
        sum(value * value for value in left_delta)
        * sum(value * value for value in right_delta)
    )
    if denominator == 0:
        return 0.0
    return sum(a * b for a, b in zip(left_delta, right_delta)) / denominator


def _beta_continued_fraction(a: float, b: float, x: float) -> float:
    maximum_iterations = 200
    epsilon = 3e-14
    minimum_value = 1e-300
    qab = a + b
    qap = a + 1.0
    qam = a - 1.0
    c_value = 1.0
    d_value = 1.0 - qab * x / qap
    if abs(d_value) < minimum_value:
        d_value = minimum_value
    d_value = 1.0 / d_value
    result = d_value

    for iteration in range(1, maximum_iterations + 1):
        twice_iteration = 2 * iteration
        coefficient = (
            iteration * (b - iteration) * x
            / ((qam + twice_iteration) * (a + twice_iteration))
        )
        d_value = 1.0 + coefficient * d_value
        if abs(d_value) < minimum_value:
            d_value = minimum_value
        c_value = 1.0 + coefficient / c_value
        if abs(c_value) < minimum_value:
            c_value = minimum_value
        d_value = 1.0 / d_value
        result *= d_value * c_value

        coefficient = (
            -(a + iteration) * (qab + iteration) * x
            / ((a + twice_iteration) * (qap + twice_iteration))
        )
        d_value = 1.0 + coefficient * d_value
        if abs(d_value) < minimum_value:
            d_value = minimum_value
        c_value = 1.0 + coefficient / c_value
        if abs(c_value) < minimum_value:
            c_value = minimum_value
        d_value = 1.0 / d_value
        delta = d_value * c_value
        result *= delta
        if abs(delta - 1.0) < epsilon:
            return result
    raise ArithmeticError("incomplete beta continued fraction did not converge")


def _regularized_incomplete_beta(x: float, a: float, b: float) -> float:
    if x <= 0.0:
        return 0.0
    if x >= 1.0:
        return 1.0
    beta_term = math.exp(
        math.lgamma(a + b) - math.lgamma(a) - math.lgamma(b)
        + a * math.log(x) + b * math.log1p(-x)
    )
    if x < (a + 1.0) / (a + b + 2.0):
        return beta_term * _beta_continued_fraction(a, b, x) / a
    return 1.0 - beta_term * _beta_continued_fraction(b, a, 1.0 - x) / b


def _student_t_two_sided_p(t_statistic: float, degrees_freedom: int) -> float:
    if math.isinf(t_statistic):
        return 0.0
    beta_x = degrees_freedom / (degrees_freedom + t_statistic * t_statistic)
    return _regularized_incomplete_beta(beta_x, degrees_freedom / 2.0, 0.5)


@lru_cache(maxsize=None)
def _student_t_critical_975(degrees_freedom: int) -> float:
    lower = 0.0
    upper = 64.0
    for _ in range(80):
        midpoint = (lower + upper) / 2.0
        if _student_t_two_sided_p(midpoint, degrees_freedom) > 0.05:
            lower = midpoint
        else:
            upper = midpoint
    return (lower + upper) / 2.0


def _estimate_mean(values: Sequence[float], alternative: str = "two-sided") -> dict:
    if len(values) < 2:
        raise ValueError("at least two independent seeds are required for inference")
    mean_value = statistics.mean(values)
    standard_deviation = statistics.stdev(values)
    standard_error = standard_deviation / math.sqrt(len(values))
    if standard_error == 0.0:
        t_statistic = 0.0 if mean_value == 0.0 else None
        tail_probability = 0.5 ** len(values)
        if mean_value == 0.0:
            p_value = 1.0
            test_method = "degenerate_zero"
        elif alternative == "greater":
            p_value = tail_probability if mean_value > 0 else 1.0 - tail_probability
            test_method = "exact_sign"
        elif alternative == "less":
            p_value = tail_probability if mean_value < 0 else 1.0 - tail_probability
            test_method = "exact_sign"
        elif alternative == "two-sided":
            p_value = min(1.0, 2.0 * tail_probability)
            test_method = "exact_sign"
        else:
            raise ValueError("alternative must be 'less', 'greater', or 'two-sided'")
    else:
        t_statistic = mean_value / standard_error
        two_sided_p = _student_t_two_sided_p(t_statistic, len(values) - 1)
        if alternative == "greater":
            p_value = two_sided_p / 2.0 if mean_value >= 0 else 1.0 - two_sided_p / 2.0
        elif alternative == "less":
            p_value = two_sided_p / 2.0 if mean_value <= 0 else 1.0 - two_sided_p / 2.0
        elif alternative == "two-sided":
            p_value = two_sided_p
        else:
            raise ValueError("alternative must be 'less', 'greater', or 'two-sided'")
        test_method = "student_t"

    critical_value = _student_t_critical_975(len(values) - 1)
    margin = critical_value * standard_error
    return {
        "n_seeds": len(values),
        "mean": mean_value,
        "sd": standard_deviation,
        "ci95_low": mean_value - margin,
        "ci95_high": mean_value + margin,
        "t_statistic": t_statistic,
        "p_value": p_value,
        "alternative": alternative,
        "test_method": test_method,
    }


def _holm_adjust(p_values: dict[str, float]) -> dict[str, float]:
    ordered = sorted(p_values.items(), key=lambda item: item[1])
    adjusted = {}
    running_maximum = 0.0
    count = len(ordered)
    for rank, (name, p_value) in enumerate(ordered):
        running_maximum = max(running_maximum, (count - rank) * p_value)
        adjusted[name] = min(1.0, running_maximum)
    return adjusted


def _benjamini_hochberg(p_values: dict[str, float]) -> dict[str, float]:
    ordered = sorted(p_values.items(), key=lambda item: item[1])
    adjusted = {}
    running_minimum = 1.0
    count = len(ordered)
    for rank in range(count - 1, -1, -1):
        name, p_value = ordered[rank]
        running_minimum = min(running_minimum, p_value * count / (rank + 1))
        adjusted[name] = min(1.0, running_minimum)
    return adjusted


def _find_path(
    size: int,
    residue: list[list[int]],
    wear_strength: float,
    adaptive: bool,
    rng: random.Random,
) -> tuple[list[Point], float]:
    """Find a minimum-resistance path on a blank four-neighbor grid."""
    start = (0, 0)
    target = (size - 1, size - 1)
    distances = {start: 0.0}
    previous: dict[Point, Point] = {}
    queue = [(0.0, rng.random(), start)]

    while queue:
        distance, _, point = heapq.heappop(queue)
        if distance > distances[point]:
            continue
        if point == target:
            break

        row, column = point
        neighbors = [
            (row - 1, column),
            (row + 1, column),
            (row, column - 1),
            (row, column + 1),
        ]
        rng.shuffle(neighbors)
        for neighbor in neighbors:
            next_row, next_column = neighbor
            if not (0 <= next_row < size and 0 <= next_column < size):
                continue
            usage = residue[next_row][next_column] if adaptive else 0
            step_cost = 1.0 / (1.0 + wear_strength * math.log1p(usage))
            candidate = distance + step_cost
            if candidate < distances.get(neighbor, math.inf) - 1e-12:
                distances[neighbor] = candidate
                previous[neighbor] = point
                heapq.heappush(queue, (candidate, rng.random(), neighbor))

    path = [target]
    while path[-1] != start:
        path.append(previous[path[-1]])
    path.reverse()
    return path, distances[target]


def _traffic_concentration(traffic: list[list[int]], endpoints: set[Point]) -> float:
    counts = [
        count
        for row, values in enumerate(traffic)
        for column, count in enumerate(values)
        if (row, column) not in endpoints and count > 0
    ]
    total = sum(counts)
    if not total:
        return 0.0
    return sum((count / total) ** 2 for count in counts)


def _top_traffic_cells(traffic: list[list[int]], endpoints: set[Point]) -> set[Point]:
    ranked = sorted(
        (
            (-count, row, column)
            for row, values in enumerate(traffic)
            for column, count in enumerate(values)
            if (row, column) not in endpoints and count > 0
        )
    )
    top_count = max(1, math.ceil(len(ranked) * 0.1))
    return {(row, column) for _, row, column in ranked[:top_count]}


def _run_routing_condition(
    *, size: int, rounds: int, agents_per_round: int, seed: int,
    wear_strength: float, adaptive: bool,
) -> dict:
    rng = random.Random(seed)
    traffic = [[0 for _ in range(size)] for _ in range(size)]
    residue = [[0 for _ in range(size)] for _ in range(size)]
    early_traffic = [[0 for _ in range(size)] for _ in range(size)]
    late_traffic = [[0 for _ in range(size)] for _ in range(size)]
    mean_route_resistance = []
    mean_route_length = []
    mean_excess_steps = []
    mean_path_stretch = []
    mean_geodesic_efficiency = []
    geodesic_routes = 0
    route_count = rounds * agents_per_round
    endpoints = {(0, 0), (size - 1, size - 1)}
    geodesic_length = 2 * (size - 1)

    for round_index in range(rounds):
        costs = []
        lengths = []
        excess_steps = []
        path_stretches = []
        geodesic_efficiencies = []
        for _ in range(agents_per_round):
            path, path_cost = _find_path(size, residue, wear_strength, adaptive, rng)
            costs.append(path_cost / (len(path) - 1))
            path_length = len(path) - 1
            lengths.append(path_length)
            excess = path_length - geodesic_length
            geodesic_routes += excess == 0
            excess_steps.append(excess)
            path_stretches.append(path_length / geodesic_length)
            geodesic_efficiencies.append(geodesic_length / path_length)
            for row, column in path:
                traffic[row][column] += 1
                residue[row][column] += 1
                phase_traffic = early_traffic if round_index < rounds // 2 else late_traffic
                phase_traffic[row][column] += 1
        mean_route_resistance.append(statistics.mean(costs))
        mean_route_length.append(statistics.mean(lengths))
        mean_excess_steps.append(statistics.mean(excess_steps))
        mean_path_stretch.append(statistics.mean(path_stretches))
        mean_geodesic_efficiency.append(statistics.mean(geodesic_efficiencies))

    traffic_values = [value for row in traffic for value in row]
    residue_values = [value for row in residue for value in row]
    early_channels = _top_traffic_cells(early_traffic, endpoints)
    late_channels = _top_traffic_cells(late_traffic, endpoints)
    channel_union = early_channels | late_channels
    return {
        "total_traffic": sum(traffic_values),
        "total_residue": sum(residue_values),
        "traffic_residue_correlation": _pearson(traffic_values, residue_values),
        "channel_concentration": _traffic_concentration(traffic, endpoints),
        "early_channel_concentration": _traffic_concentration(early_traffic, endpoints),
        "late_channel_concentration": _traffic_concentration(late_traffic, endpoints),
        "channel_persistence": (
            len(early_channels & late_channels) / len(channel_union) if channel_union else 0.0
        ),
        "geodesic_route_fraction": geodesic_routes / route_count,
        "detour_rate": 1.0 - geodesic_routes / route_count,
        "mean_route_length_by_round": mean_route_length,
        "mean_excess_steps_by_round": mean_excess_steps,
        "mean_path_stretch_by_round": mean_path_stretch,
        "mean_geodesic_efficiency_by_round": mean_geodesic_efficiency,
        "mean_route_resistance_first_round": mean_route_resistance[0],
        "mean_route_resistance_last_round": mean_route_resistance[-1],
        "mean_route_resistance_by_round": mean_route_resistance,
        "traffic": traffic,
        "residue": residue,
    }


def run_residue_experiment(
    size: int = 31,
    rounds: int = 80,
    agents_per_round: int = 12,
    seed: int = 7,
    wear_strength: float = 0.35,
) -> dict:
    """Compare routes that respond to accumulated wear with a no-feedback control."""
    if size < 3 or rounds < 2 or agents_per_round < 1:
        raise ValueError("size >= 3, rounds >= 2, and agents_per_round >= 1 are required")
    if wear_strength < 0:
        raise ValueError("wear_strength must be non-negative")

    treatment = _run_routing_condition(
        size=size,
        rounds=rounds,
        agents_per_round=agents_per_round,
        seed=seed,
        wear_strength=wear_strength,
        adaptive=True,
    )
    control = _run_routing_condition(
        size=size,
        rounds=rounds,
        agents_per_round=agents_per_round,
        seed=seed,
        wear_strength=wear_strength,
        adaptive=False,
    )
    return {
        "parameters": {
            "size": size,
            "rounds": rounds,
            "agents_per_round": agents_per_round,
            "seed": seed,
            "wear_strength": wear_strength,
        },
        "treatment": treatment,
        "control": control,
        "channel_concentration_difference": (
            treatment["channel_concentration"] - control["channel_concentration"]
        ),
    }


def run_multi_seed_analysis(
    seed_count: int = 100,
    seed_start: int = 1000,
    size: int = 31,
    rounds: int = 80,
    agents_per_round: int = 12,
    wear_strength: float = 0.35,
) -> dict:
    """Run paired treatment/control trials and summarize independent seeds."""
    if seed_count < 2:
        raise ValueError("seed_count must be at least 2")

    seed_records = []
    trajectories = {
        condition: {metric: [] for metric in (
            "mean_route_resistance_by_round",
            "mean_path_stretch_by_round",
            "mean_geodesic_efficiency_by_round",
        )}
        for condition in ("treatment", "control")
    }

    for seed in range(seed_start, seed_start + seed_count):
        run = run_residue_experiment(
            size=size,
            rounds=rounds,
            agents_per_round=agents_per_round,
            seed=seed,
            wear_strength=wear_strength,
        )
        treatment = run["treatment"]
        control = run["control"]
        treatment_efficiency = statistics.mean(
            treatment["mean_geodesic_efficiency_by_round"]
        )
        control_efficiency = statistics.mean(
            control["mean_geodesic_efficiency_by_round"]
        )
        treatment_resistance_change = (
            treatment["mean_route_resistance_last_round"]
            - treatment["mean_route_resistance_first_round"]
        )
        control_resistance_change = (
            control["mean_route_resistance_last_round"]
            - control["mean_route_resistance_first_round"]
        )
        seed_records.append({
            "seed": seed,
            "geodesic_length": 2 * (size - 1),
            "delta_concentration": run["channel_concentration_difference"],
            "delta_resistance_change": treatment_resistance_change - control_resistance_change,
            "treatment_resistance_change": treatment_resistance_change,
            "control_resistance_change": control_resistance_change,
            "delta_efficiency": treatment_efficiency - control_efficiency,
            "treatment_mean_route_length": statistics.mean(treatment["mean_route_length_by_round"]),
            "control_mean_route_length": statistics.mean(control["mean_route_length_by_round"]),
            "treatment_excess_steps": statistics.mean(treatment["mean_excess_steps_by_round"]),
            "treatment_efficiency": treatment_efficiency,
            "control_efficiency": control_efficiency,
            "treatment_stretch": statistics.mean(treatment["mean_path_stretch_by_round"]),
            "treatment_excess_stretch": (
                statistics.mean(treatment["mean_path_stretch_by_round"]) - 1.0
            ),
            "control_stretch": statistics.mean(control["mean_path_stretch_by_round"]),
            "treatment_detour_rate": treatment["detour_rate"],
            "control_detour_rate": control["detour_rate"],
            "delta_detour_rate": treatment["detour_rate"] - control["detour_rate"],
            "delta_channel_persistence": (
                treatment["channel_persistence"] - control["channel_persistence"]
            ),
            "treatment_geodesic_fraction": treatment["geodesic_route_fraction"],
            "control_geodesic_fraction": control["geodesic_route_fraction"],
        })
        for condition, data in (("treatment", treatment), ("control", control)):
            for metric in trajectories[condition]:
                trajectories[condition][metric].append(data[metric])

    primary_specs = {
        "delta_concentration": "greater",
        "delta_resistance_change": "less",
        "delta_efficiency": "two-sided",
    }
    primary = {
        metric: _estimate_mean([record[metric] for record in seed_records], alternative)
        for metric, alternative in primary_specs.items()
    }
    primary_adjusted = _holm_adjust({
        metric: result["p_value"] for metric, result in primary.items()
    })
    for metric, adjusted_p in primary_adjusted.items():
        primary[metric]["p_holm"] = adjusted_p

    secondary_specs = {
        "treatment_excess_steps": ("greater", "Treatment mean excess steps"),
        "delta_detour_rate": ("greater", "Treatment-control detour rate"),
        "delta_channel_persistence": ("greater", "Treatment-control corridor persistence"),
        "treatment_excess_stretch": ("greater", "Treatment excess stretch"),
    }
    secondary = {}
    for metric, (alternative, _) in secondary_specs.items():
        secondary[metric] = _estimate_mean(
            [record[metric] for record in seed_records], alternative
        )
    secondary_adjusted = _benjamini_hochberg({
        metric: result["p_value"] for metric, result in secondary.items()
    })
    for metric, adjusted_p in secondary_adjusted.items():
        secondary[metric]["p_bh"] = adjusted_p

    trajectory_summary = {}
    for condition, condition_series in trajectories.items():
        trajectory_summary[condition] = {}
        for metric, runs in condition_series.items():
            trajectory_summary[condition][metric] = [
                _estimate_mean([run[index] for run in runs])
                for index in range(rounds)
            ]

    return {
        "parameters": {
            "seed_count": seed_count,
            "seed_start": seed_start,
            "seed_end": seed_start + seed_count - 1,
            "size": size,
            "rounds": rounds,
            "agents_per_round": agents_per_round,
            "wear_strength": wear_strength,
        },
        "primary_outcomes": primary,
        "secondary_outcomes": secondary,
        "seed_records": seed_records,
        "trajectories": trajectory_summary,
    }


def _normalize(vector: Iterable[float]) -> Vector:
    values = tuple(vector)
    length = math.sqrt(sum(value * value for value in values))
    if length == 0:
        return (1.0, 0.0, 0.0)
    return tuple(value / length for value in values)  # type: ignore[return-value]


def _cosine_distance(left: Vector, right: Vector) -> float:
    return max(0.0, min(2.0, 1.0 - sum(a * b for a, b in zip(left, right))))


def _rotate_model_state(state: Vector, angle: float, noise: float, rng: random.Random) -> Vector:
    cosine = math.cos(angle)
    sine = math.sin(angle)
    rotated = (
        cosine * state[0] - sine * state[1],
        sine * state[0] + cosine * state[1],
        state[2],
    )
    perturbed = tuple(value + rng.gauss(0.0, noise) for value in rotated)
    return _normalize(perturbed)


def _nearest_validation_distance(state: Vector, validation_set: Sequence[Vector]) -> float:
    return min(_cosine_distance(state, reference) for reference in validation_set)


def _run_feedback_trial(
    self_feedback: float,
    *,
    steps: int,
    seed: int,
    model_noise: float,
    sensory_noise: float,
    validation_set: Sequence[Vector],
    angle: float,
) -> dict:
    rng = random.Random(seed)
    baseline = (1.0, 0.0, 0.0)
    state = baseline
    states = []
    rounded_seen: set[tuple[float, float, float]] = set()
    repeat_steps = 0

    for _ in range(steps):
        modeled = _rotate_model_state(state, angle, model_noise, rng)
        sensory = _normalize(
            tuple(baseline[index] + rng.gauss(0.0, sensory_noise) for index in range(3))
        )
        mixed = tuple(
            (1.0 - self_feedback) * sensory[index]
            + self_feedback * modeled[index]
            for index in range(3)
        )
        state = _normalize(mixed)
        states.append(state)
        key = tuple(round(value, 2) for value in state)
        if key in rounded_seen:
            repeat_steps += 1
        rounded_seen.add(key)

    return {
        "final_baseline_divergence": _cosine_distance(state, baseline),
        "mean_baseline_divergence": statistics.mean(
            _cosine_distance(sample, baseline) for sample in states
        ),
        "validation_divergence": statistics.mean(
            _nearest_validation_distance(sample, validation_set) for sample in states
        ),
        "repeat_frequency": repeat_steps / steps,
    }


def run_recursive_stress_test(
    feedback_levels: Sequence[float] | None = None,
    steps: int = 200,
    replicates: int = 20,
    seed: int = 17,
    model_noise: float = 0.025,
    sensory_noise: float = 0.025,
    model_angle: float = 0.12,
    validation_tolerance: float = 0.08,
) -> dict:
    """Sweep self-feedback in a synthetic vector model; this is not an LLM test."""
    levels = list(feedback_levels or (index / 20 for index in range(21)))
    if steps < 1 or replicates < 1:
        raise ValueError("steps and replicates must be positive")
    if any(not 0.0 <= level <= 1.0 for level in levels):
        raise ValueError("feedback levels must be between 0 and 1")
    if model_noise < 0 or sensory_noise < 0 or model_angle < 0 or validation_tolerance < 0:
        raise ValueError("noise, angle, and validation tolerance must be non-negative")

    baseline = (1.0, 0.0, 0.0)
    validation_set = [
        baseline,
        _normalize((math.cos(0.15), math.sin(0.15), 0.0)),
        _normalize((math.cos(0.15), -math.sin(0.15), 0.0)),
    ]
    measurements = []
    for feedback in levels:
        trials = [
            _run_feedback_trial(
                feedback,
                steps=steps,
                seed=seed + replicate,
                model_noise=model_noise,
                sensory_noise=sensory_noise,
                validation_set=validation_set,
                angle=model_angle,
            )
            for replicate in range(replicates)
        ]
        row = {"self_feedback": feedback}
        for metric in trials[0]:
            values = [trial[metric] for trial in trials]
            row[metric] = statistics.mean(values)
            row[f"{metric}_sd"] = statistics.stdev(values) if len(values) > 1 else 0.0
            feedback_margin = (
                _student_t_critical_975(replicates - 1)
                * row[f"{metric}_sd"] / math.sqrt(replicates)
                if replicates > 1 else 0.0
            )
            row[f"{metric}_ci95_low"] = row[metric] - feedback_margin
            row[f"{metric}_ci95_high"] = row[metric] + feedback_margin
        row["model_to_sensory_variance_ratio"] = (
            (feedback * model_noise) ** 2
            / (((1.0 - feedback) * sensory_noise) ** 2 + 1e-12)
        )
        measurements.append(row)

    critical_candidates = [
        row["self_feedback"]
        for row in measurements
        if row["validation_divergence"] > validation_tolerance
    ]
    return {
        "parameters": {
            "steps": steps,
            "replicates": replicates,
            "seed": seed,
            "model_noise": model_noise,
            "sensory_noise": sensory_noise,
            "model_angle": model_angle,
            "validation_tolerance": validation_tolerance,
        },
        "measurements": measurements,
        "variance_crossover_feedback": (
            sensory_noise / (model_noise + sensory_noise)
            if model_noise + sensory_noise > 0 else None
        ),
        "estimated_critical_feedback": min(critical_candidates) if critical_candidates else None,
        "critical_threshold_definition": (
            "First swept feedback level with mean validation divergence above "
            "validation_tolerance; operational and model-specific."
        ),
    }


def _svg_heatmap(grid: list[list[int]], title: str, destination: Path) -> None:
    cell = 12
    margin = 24
    rows = len(grid)
    columns = len(grid[0])
    maximum = max((value for row in grid for value in row), default=0) or 1
    elements = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{columns * cell + 2 * margin}" '
        f'height="{rows * cell + 2 * margin + 32}" viewBox="0 0 {columns * cell + 2 * margin} '
        f'{rows * cell + 2 * margin + 32}">',
        '<rect width="100%" height="100%" fill="#fbfaf7"/>',
        f'<text x="{margin}" y="20" font-family="sans-serif" font-size="14" fill="#202b2b">{title}</text>',
    ]
    for row_index, row in enumerate(grid):
        for column_index, value in enumerate(row):
            intensity = int(245 - 190 * value / maximum)
            fill = f"#{intensity:02x}{min(245, intensity + 8):02x}{min(245, intensity + 5):02x}"
            elements.append(
                f'<rect x="{margin + column_index * cell}" y="{margin + row_index * cell}" '
                f'width="{cell}" height="{cell}" fill="{fill}"/>'
            )
    elements.append("</svg>")
    destination.write_text("\n".join(elements), encoding="utf-8")


def _svg_lines(series: dict[str, Sequence[float]], title: str, destination: Path) -> None:
    width, height = 720, 360
    left, top, plot_width, plot_height = 56, 42, 620, 250
    values = [value for items in series.values() for value in items]
    low, high = min(values, default=0.0), max(values, default=1.0)
    if math.isclose(low, high):
        high = low + 1.0
    colors = ("#187a72", "#b44b35", "#315c8c")
    elements = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" fill="#fbfaf7"/>',
        f'<text x="{left}" y="24" font-family="sans-serif" font-size="16" fill="#202b2b">{title}</text>',
        f'<path d="M {left} {top} V {top + plot_height} H {left + plot_width}" fill="none" stroke="#596565"/>',
    ]
    for index, (label, items) in enumerate(series.items()):
        points = []
        for item_index, value in enumerate(items):
            x = left + plot_width * item_index / max(1, len(items) - 1)
            y = top + plot_height * (high - value) / (high - low)
            points.append(f"{x:.1f},{y:.1f}")
        elements.append(
            f'<polyline points="{" ".join(points)}" fill="none" stroke="{colors[index % len(colors)]}" stroke-width="2"/>'
        )
        legend_y = top + plot_height + 28 + (index // 2) * 18
        legend_x = left + (index % 2) * 260
        elements.append(
            f'<text x="{legend_x}" y="{legend_y}" font-family="sans-serif" font-size="12" fill="{colors[index % len(colors)]}">{label}</text>'
        )
    elements.append("</svg>")
    destination.write_text("\n".join(elements), encoding="utf-8")


def _svg_multi_seed_dashboard(summary: dict, feedback: dict, destination: Path) -> None:
    width, height = 1240, 900
    panel_width, panel_height = 570, 250
    positions = ((36, 42), (634, 42), (36, 328), (634, 328), (36, 614), (634, 614))
    elements = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" fill="#fbfaf7"/>',
        '<text x="36" y="26" font-family="sans-serif" font-size="20" fill="#202b2b">Cave Physics: paired multi-seed analysis</text>',
    ]

    def frame(x: int, y: int, title: str) -> None:
        elements.append(
            f'<rect x="{x}" y="{y}" width="{panel_width}" height="{panel_height}" fill="#ffffff" stroke="#c9d0ca"/>'
        )
        elements.append(
            f'<text x="{x + 14}" y="{y + 22}" font-family="sans-serif" font-size="14" fill="#202b2b">{title}</text>'
        )

    def histogram(
        x: int, y: int, title: str, values: Sequence[float], estimate: dict
    ) -> None:
        frame(x, y, title)
        plot_x, plot_y = x + 36, y + 38
        plot_width, plot_height = panel_width - 52, panel_height - 76
        low_value, high_value = min(values), max(values)
        if math.isclose(low_value, high_value):
            padding = max(abs(low_value) * 0.05, 0.025)
        else:
            padding = (high_value - low_value) * 0.08
        low_value -= padding
        high_value += padding
        bins = min(16, max(5, round(math.sqrt(len(values)))))
        counts = [0] * bins
        for value in values:
            index = min(bins - 1, int((value - low_value) / (high_value - low_value) * bins))
            counts[index] += 1
        peak = max(counts) or 1
        bar_width = plot_width / bins
        for index, count in enumerate(counts):
            bar_height = plot_height * count / peak
            elements.append(
                f'<rect x="{plot_x + index * bar_width:.2f}" y="{plot_y + plot_height - bar_height:.2f}" '
                f'width="{max(1.0, bar_width - 2):.2f}" height="{bar_height:.2f}" fill="#187a72" fill-opacity="0.78"/>'
            )
        mean_x = plot_x + plot_width * (estimate["mean"] - low_value) / (high_value - low_value)
        elements.append(
            f'<path d="M {mean_x:.2f} {plot_y} V {plot_y + plot_height}" stroke="#b44b35" stroke-width="2"/>'
        )
        summary_text = (
            f'n={estimate["n_seeds"]}; mean={estimate["mean"]:.4g}; '
            f'95% CI [{estimate["ci95_low"]:.4g}, {estimate["ci95_high"]:.4g}]'
        )
        elements.append(
            f'<text x="{x + 14}" y="{y + panel_height - 12}" font-family="sans-serif" font-size="11" fill="#354545">{summary_text}</text>'
        )

    records = summary["seed_records"]
    primary = summary["primary_outcomes"]
    histogram(
        *positions[0], "Traffic concentration difference (Delta C)",
        [record["delta_concentration"] for record in records], primary["delta_concentration"],
    )
    histogram(
        *positions[1], "Resistance change difference-in-differences (Delta R)",
        [record["delta_resistance_change"] for record in records], primary["delta_resistance_change"],
    )
    histogram(
        *positions[2], "Treatment stretch (La / Lg)",
        [record["treatment_stretch"] for record in records],
        _estimate_mean([record["treatment_stretch"] for record in records]),
    )
    histogram(
        *positions[3], "Treatment efficiency (Lg / La)",
        [record["treatment_efficiency"] for record in records],
        _estimate_mean([record["treatment_efficiency"] for record in records]),
    )

    table_x, table_y = positions[4]
    frame(table_x, table_y, "Primary paired effects with 95% CIs")
    labels = {
        "delta_concentration": "Delta C (greater)",
        "delta_resistance_change": "Delta R (less)",
        "delta_efficiency": "Delta efficiency (two-sided)",
    }
    for row_index, (metric, label) in enumerate(labels.items()):
        estimate = primary[metric]
        text = (
            f'{label}: {estimate["mean"]:.4g} [{estimate["ci95_low"]:.4g}, '
            f'{estimate["ci95_high"]:.4g}] p_Holm={estimate["p_holm"]:.4g}'
        )
        elements.append(
            f'<text x="{table_x + 16}" y="{table_y + 68 + row_index * 47}" font-family="sans-serif" font-size="12" fill="#354545">{text}</text>'
        )
    elements.append(
        f'<text x="{table_x + 16}" y="{table_y + 218}" font-family="sans-serif" font-size="10" fill="#596565">Holm-adjusted across the three preregistered primary tests.</text>'
    )

    chart_x, chart_y = positions[5]
    frame(chart_x, chart_y, "Synthetic feedback sweep: validation divergence")
    measurements = feedback["measurements"]
    plot_x, plot_y = chart_x + 48, chart_y + 38
    plot_width, plot_height = panel_width - 68, panel_height - 80
    tolerance = feedback["parameters"]["validation_tolerance"]
    maximum = max(tolerance, max(row["validation_divergence_ci95_high"] for row in measurements)) * 1.1
    maximum_feedback = max(row["self_feedback"] for row in measurements) or 1.0
    tolerance_y = plot_y + plot_height * (1.0 - tolerance / maximum)
    elements.append(
        f'<path d="M {plot_x} {tolerance_y:.2f} H {plot_x + plot_width}" stroke="#b44b35" stroke-dasharray="6 4" fill="none"/>'
    )
    means = []
    lower = []
    upper = []
    for row in measurements:
        x = plot_x + plot_width * row["self_feedback"] / maximum_feedback
        means.append((x, plot_y + plot_height * (1.0 - row["validation_divergence"] / maximum)))
        lower.append((x, plot_y + plot_height * (1.0 - row["validation_divergence_ci95_low"] / maximum)))
        upper.append((x, plot_y + plot_height * (1.0 - row["validation_divergence_ci95_high"] / maximum)))
    ribbon_points = upper + list(reversed(lower))
    ribbon = " ".join(f"{x:.2f},{y:.2f}" for x, y in ribbon_points)
    line = " ".join(f"{x:.2f},{y:.2f}" for x, y in means)
    elements.append(f'<polygon points="{ribbon}" fill="#187a72" fill-opacity="0.16"/>')
    elements.append(f'<polyline points="{line}" fill="none" stroke="#187a72" stroke-width="2"/>')
    threshold = feedback["estimated_critical_feedback"]
    threshold_text = f"alpha crossing={threshold}" if threshold is not None else "crossing not observed"
    elements.append(
        f'<text x="{chart_x + 14}" y="{chart_y + panel_height - 12}" font-family="sans-serif" font-size="10" fill="#354545">{threshold_text}; dashed=tolerance; shaded=95% CI</text>'
    )
    elements.append("</svg>")
    destination.write_text("\n".join(elements), encoding="utf-8")


def _write_outputs(
    output_dir: Path, residue: dict, feedback: dict, multi_seed: dict | None = None
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    summary = {
        "experiment_ii": {
            "parameters": residue["parameters"],
            "treatment": {key: value for key, value in residue["treatment"].items() if key not in ("traffic", "residue")},
            "control": {key: value for key, value in residue["control"].items() if key not in ("traffic", "residue")},
            "channel_concentration_difference": residue["channel_concentration_difference"],
        },
        "experiment_iii": feedback,
    }
    (output_dir / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")

    with (output_dir / "feedback_metrics.csv").open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=list(feedback["measurements"][0]))
        writer.writeheader()
        writer.writerows(feedback["measurements"])
    for condition in ("treatment", "control"):
        with (output_dir / f"{condition}_traffic.csv").open("w", newline="", encoding="utf-8") as file:
            csv.writer(file).writerows(residue[condition]["traffic"])
    _svg_heatmap(residue["treatment"]["traffic"], "Experiment II: traffic density with residue feedback", output_dir / "traffic_heatmap.svg")
    _svg_lines(
        {
            "adaptive residue routing": residue["treatment"]["mean_route_resistance_by_round"],
            "no-feedback control": residue["control"]["mean_route_resistance_by_round"],
        },
        "Mean route resistance by round",
        output_dir / "route_resistance.svg",
    )
    _svg_lines(
        {
            "adaptive path stretch": residue["treatment"]["mean_path_stretch_by_round"],
            "no-feedback path stretch": residue["control"]["mean_path_stretch_by_round"],
        },
        "Path stretch relative to Manhattan geodesic",
        output_dir / "path_stretch.svg",
    )
    _svg_lines(
        {
            "validation divergence": [row["validation_divergence"] for row in feedback["measurements"]],
            "repetition frequency": [row["repeat_frequency"] for row in feedback["measurements"]],
        },
        "Experiment III: self-feedback sweep",
        output_dir / "feedback_sweep.svg",
    )
    _svg_lines(
        {"model-to-sensory variance ratio": [
            row["model_to_sensory_variance_ratio"] for row in feedback["measurements"]
        ]},
        "Model-to-sensory variance ratio",
        output_dir / "variance_ratio.svg",
    )
    if multi_seed is not None:
        (output_dir / "multi_seed_summary.json").write_text(
            json.dumps(multi_seed, indent=2), encoding="utf-8"
        )
        records = multi_seed["seed_records"]
        with (output_dir / "multi_seed_records.csv").open(
            "w", newline="", encoding="utf-8"
        ) as file:
            writer = csv.DictWriter(file, fieldnames=list(records[0]))
            writer.writeheader()
            writer.writerows(records)

        aggregate_rows = []
        for family in ("primary_outcomes", "secondary_outcomes"):
            for metric, estimate in multi_seed[family].items():
                aggregate_rows.append({
                    "family": family,
                    "metric": metric,
                    **estimate,
                })
        with (output_dir / "multi_seed_aggregate.csv").open(
            "w", newline="", encoding="utf-8"
        ) as file:
            fieldnames = [
                "family", "metric", "n_seeds", "mean", "sd", "ci95_low",
                "ci95_high", "alternative", "p_value", "p_holm", "p_bh",
            ]
            writer = csv.DictWriter(file, fieldnames=fieldnames, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(aggregate_rows)
        _svg_multi_seed_dashboard(
            multi_seed, feedback, output_dir / "multi_seed_dashboard.svg"
        )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=Path("cave_experiment_results"))
    parser.add_argument("--size", type=int, default=31)
    parser.add_argument("--rounds", type=int, default=80)
    parser.add_argument("--agents-per-round", type=int, default=12)
    parser.add_argument("--steps", type=int, default=200)
    parser.add_argument("--replicates", type=int, default=100)
    parser.add_argument("--seed", type=int, default=7)
    parser.add_argument("--multi-seed-count", type=int, default=100)
    parser.add_argument("--multi-seed-start", type=int, default=1000)
    args = parser.parse_args()

    residue = run_residue_experiment(
        size=args.size,
        rounds=args.rounds,
        agents_per_round=args.agents_per_round,
        seed=args.seed,
    )
    feedback = run_recursive_stress_test(
        steps=args.steps,
        replicates=args.replicates,
        seed=args.seed + 10,
    )
    multi_seed = run_multi_seed_analysis(
        seed_count=args.multi_seed_count,
        seed_start=args.multi_seed_start,
        size=args.size,
        rounds=args.rounds,
        agents_per_round=args.agents_per_round,
    )
    _write_outputs(args.output_dir, residue, feedback, multi_seed)
    print(json.dumps({
        "experiment_ii_channel_concentration_difference": residue["channel_concentration_difference"],
        "experiment_ii_treatment_resistance_change": (
            residue["treatment"]["mean_route_resistance_last_round"]
            - residue["treatment"]["mean_route_resistance_first_round"]
        ),
        "experiment_iii_estimated_critical_feedback": feedback["estimated_critical_feedback"],
        "multi_seed_count": multi_seed["parameters"]["seed_count"],
        "primary_outcomes": multi_seed["primary_outcomes"],
        "outputs": str(args.output_dir),
    }, indent=2))


if __name__ == "__main__":
    main()