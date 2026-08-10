# ============================================================
# TribeCorruption.py — Corruption / Infestation Layer
# ============================================================

TRIBE_CORRUPTION = {
    "BinaryCommand": {
        "name": "Logic Fracture",
        "trigger": {"stress": 0.7},
        "effect": {"strategy": -0.3, "chaos": 0.4}
    },

    "BalancedOrder": {
        "name": "Harmony Collapse",
        "trigger": {"alliances": -0.5},
        "effect": {"stability": -0.4, "chaos": 0.3}
    },

    "ArchiveLords": {
        "name": "Memory Rot",
        "trigger": {"eventCascade": 3},
        "effect": {"intelligence": -0.3, "strategy": -0.2}
    },

    "PatternSeekers": {
        "name": "Prediction Spiral",
        "trigger": {"synergy": 0.2},
        "effect": {"strategy": -0.4, "chaos": 0.4}
    },

    "TruthJudges": {
        "name": "Purity Corruption",
        "trigger": {"mode": "WW3"},
        "effect": {"stability": -0.5, "chaos": 0.3}
    },

    "DecisionStrategists": {
        "name": "Branch Collapse",
        "trigger": {"chaos": 0.5},
        "effect": {"strategy": -0.3, "intelligence": -0.2}
    },

    "MilitiaSwarm": {
        "name": "Hive Corruption",
        "trigger": {"chaos": 0.8},
        "effect": {"aggression": 0.5, "chaos": 0.6}
    },

    "IndustrialIron": {
        "name": "Rust Plague",
        "trigger": {"production": 0.2},
        "effect": {"power": -0.4, "production": -0.3}
    },

    "TechnoDominion": {
        "name": "Cyber Infection",
        "trigger": {"tech": 0.8},
        "effect": {"tech": -0.5, "chaos": 0.5}
    },

    "Nature": {
        "name": "Eco Blight",
        "trigger": {"season": "winter"},
        "effect": {"production": -0.3, "stability": -0.4}
    }
}
