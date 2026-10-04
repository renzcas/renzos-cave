# ============================================================
# TribeRituals.py — Mythic Ritual Powers for Each Tribe
# ============================================================

TRIBE_RITUALS = {
    "BinaryCommand": {
        "name": "Logic Ascension",
        "trigger": {"synergy": 0.7},
        "effect": {"strategy": 0.3, "intelligence": 0.2}
    },

    "BalancedOrder": {
        "name": "Harmony Bloom",
        "trigger": {"stress": -0.3},
        "effect": {"alliances": 0.4, "stability": 0.3}
    },

    "ArchiveLords": {
        "name": "Memory Echo",
        "trigger": {"eventCascade": 2},
        "effect": {"strategy": 0.2, "intelligence": 0.3}
    },

    "PatternSeekers": {
        "name": "Foresight Burst",
        "trigger": {"synergy": 0.6},
        "effect": {"strategy": 0.4, "intelligence": 0.4}
    },

    "TruthJudges": {
        "name": "Purity Surge",
        "trigger": {"mode": "WW3"},
        "effect": {"stability": 0.4, "strategy": 0.2}
    },

    "DecisionStrategists": {
        "name": "Branch Split",
        "trigger": {"chaos": 0.4},
        "effect": {"strategy": 0.3, "intelligence": 0.3}
    },

    "MilitiaSwarm": {
        "name": "Hive Surge",
        "trigger": {"chaos": 0.7},
        "effect": {"aggression": 0.5, "chaos": 0.5}
    },

    "IndustrialIron": {
        "name": "Iron Overdrive",
        "trigger": {"production": 0.8},
        "effect": {"power": 0.4, "production": 0.3}
    },

    "TechnoDominion": {
        "name": "Cyber Ascension",
        "trigger": {"tech": 0.7},
        "effect": {"tech": 0.5, "intelligence": 0.4}
    },

    "Nature": {
        "name": "Eco Bloom",
        "trigger": {"season": "spring"},
        "effect": {"production": 0.3, "stability": 0.4}
    }
}
