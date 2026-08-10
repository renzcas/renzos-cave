# ============================================================
# TribeCataclysm.py — Collapse / Endgame Breakdown Layer
# ============================================================

TRIBE_CATACLYSM = {
    "BinaryCommand": {
        "name": "Logic Collapse",
        "trigger": {"strategy": -0.5, "chaos": 1.0},
        "effect": {"power": -0.8, "intelligence": -0.6}
    },

    "BalancedOrder": {
        "name": "Harmony Shatter",
        "trigger": {"stability": -0.6},
        "effect": {"alliances": -1.0, "stability": -0.8}
    },

    "ArchiveLords": {
        "name": "Memory Blackout",
        "trigger": {"eventCascade": 5},
        "effect": {"intelligence": -0.7, "strategy": -0.5}
    },

    "PatternSeekers": {
        "name": "Foresight Burnout",
        "trigger": {"strategy": -0.4},
        "effect": {"intelligence": -0.6, "chaos": 0.5}
    },

    "TruthJudges": {
        "name": "Purity Implosion",
        "trigger": {"stability": -0.7},
        "effect": {"stability": -1.0, "strategy": -0.4}
    },

    "DecisionStrategists": {
        "name": "Branch Collapse",
        "trigger": {"intelligence": -0.5},
        "effect": {"strategy": -0.6, "intelligence": -0.6}
    },

    "MilitiaSwarm": {
        "name": "Hive Overrun",
        "trigger": {"chaos": 1.2},
        "effect": {"aggression": 1.0, "chaos": 1.0}
    },

    "IndustrialIron": {
        "name": "Iron Meltdown",
        "trigger": {"production": -0.5},
        "effect": {"power": -1.0, "production": -0.8}
    },

    "TechnoDominion": {
        "name": "Neural Collapse",
        "trigger": {"tech": -0.4},
        "effect": {"tech": -1.0, "intelligence": -0.7}
    },

    "Nature": {
        "name": "Worldheart Winter",
        "trigger": {"season": "winter", "production": -0.4},
        "effect": {"stability": -1.0, "production": -0.6}
    }
}
s