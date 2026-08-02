# ============================================================
# BIG_ANIMAL — ADAPTED SCAFFOLD FOR MASTERCORE
# ============================================================

from dataclasses import dataclass, field
from typing import Dict, Any

# Tribe modules (stubs)
from core.TribeConfig import TRIBE_CONFIG
from core.TribeEconomy import TRIBE_ECONOMY
from core.TribeTech import TRIBE_TECH
from core.TribeRituals import TRIBE_RITUALS
from core.TribeCorruption import TRIBE_CORRUPTION
from core.TribeAscension import TRIBE_ASCENSION
from core.TribeCataclysm import TRIBE_CATACLYSM
from core.TribeRebirth import TRIBE_REBIRTH


# ============================================================
# WORLD STATE
# ============================================================

@dataclass
class BigAnimalState:
    tribes: Dict[str, Dict[str, float]] = field(default_factory=dict)
    alliances: Dict[str, float] = field(default_factory=dict)
    economy: Dict[str, Any] = field(default_factory=dict)
    tech: Dict[str, Any] = field(default_factory=dict)
    rituals: Dict[str, Any] = field(default_factory=dict)
    corruption: Dict[str, Any] = field(default_factory=dict)
    ascension: Dict[str, Any] = field(default_factory=dict)
    cataclysm: Dict[str, Any] = field(default_factory=dict)
    rebirth: Dict[str, Any] = field(default_factory=dict)
    era: str = "Genesis"


# ============================================================
# BIG_ANIMAL CORE
# ============================================================

class BigAnimalCore:

    def __init__(self):
        self.state = BigAnimalState()
        self._init_tribes()

    # ----------------------------------------------------------
    # INITIALIZE TRIBES
    # ----------------------------------------------------------
    def _init_tribes(self):
        self.state.tribes = {
            name: {
                "power": 0.5,
                "strategy": 0.5,
                "intelligence": 0.5,
                "stability": 0.5,
                "production": 0.5,
                "aggression": 0.5,
                "chaos": 0.5,
                "tech": 0.5
            }
            for name in TRIBE_CONFIG.keys()
        }

    # ----------------------------------------------------------
    # PRE-TICK (MasterCore calls this first)
    # ----------------------------------------------------------
    def pre_tick(self, snapshot: Dict[str, Any]):
        # You can read physics, transformed_physics, etc.
        # For now, this is a stub.
        pass

    # ----------------------------------------------------------
    # TICK (MasterCore calls this second)
    # ----------------------------------------------------------
    def tick(self, snapshot: Dict[str, Any]):
        # Update all tribe systems
        self._update_alliances(snapshot)
        self._update_economy(snapshot)
        self._update_tech(snapshot)
        self._update_rituals(snapshot)
        self._update_corruption(snapshot)
        self._update_ascension(snapshot)
        self._update_cataclysm(snapshot)
        self._update_rebirth(snapshot)
        self._update_era()

    # ----------------------------------------------------------
    # POST-TICK (MasterCore calls this last)
    # ----------------------------------------------------------
    def post_tick(self, snapshot: Dict[str, Any]):
        # Logging, cleanup, etc.
        pass

    # ----------------------------------------------------------
    # SUBSYSTEMS (stubs for now)
    # ----------------------------------------------------------
    def _update_alliances(self, snapshot):
        self.state.alliances = snapshot.get("alliances", {})

    def _update_economy(self, snapshot):
        eco_state = {}
        for name, tribe in self.state.tribes.items():
            eco = TRIBE_ECONOMY[name]
            eco_state[name] = {
                "production": eco["production"] * tribe["power"],
                "consumption": eco["consumption"] * (1 - tribe["power"]),
                "trade": eco["trade"] * tribe["power"]
            }
        self.state.economy = eco_state

    def _update_tech(self, snapshot):
        tech_state = {}
        for name, tribe in self.state.tribes.items():
            levels = TRIBE_TECH[name]["levels"]
            unlocked = int(tribe["power"] * len(levels))
            bonuses = {}
            for i in range(unlocked):
                for k, v in levels[i]["bonus"].items():
                    bonuses[k] = bonuses.get(k, 0) + v
            tech_state[name] = bonuses
        self.state.tech = tech_state

    def _update_rituals(self, snapshot):
        self.state.rituals = {name: {} for name in self.state.tribes}

    def _update_corruption(self, snapshot):
        self.state.corruption = {name: {} for name in self.state.tribes}

    def _update_ascension(self, snapshot):
        self.state.ascension = {name: {} for name in self.state.tribes}

    def _update_cataclysm(self, snapshot):
        self.state.cataclysm = {name: {} for name in self.state.tribes}

    def _update_rebirth(self, snapshot):
        self.state.rebirth = {name: {} for name in self.state.tribes}

    def _update_era(self):
        self.state.era = "NewEra"

    # ----------------------------------------------------------
    # SNAPSHOT (MasterCore reads this)
    # ----------------------------------------------------------
    def snapshot(self):
        return {
            "tribes": self.state.tribes,
            "alliances": self.state.alliances,
            "economy": self.state.economy,
            "tech": self.state.tech,
            "rituals": self.state.rituals,
            "corruption": self.state.corruption,
            "ascension": self.state.ascension,
            "cataclysm": self.state.cataclysm,
            "rebirth": self.state.rebirth,
            "era": self.state.era
        }
