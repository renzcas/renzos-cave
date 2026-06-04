import { createLayout } from "./cave-ui/layout/layout.js";
import { attachPanelControls } from "./cave-ui/controls/panel-controls.js";

import { OperatorPanel } from "./cave-ui/panels/operator-panel.js";
import { BeastInteractionPanel } from "./cave-ui/panels/beast-interaction-panel.js";
import { ArenaCombatPanel } from "./cave-ui/panels/arena-combat-panel.js";
import { TrialCodexPanel } from "./cave-ui/panels/trial-codex-panel.js";
import { BeastCodexPanel } from "./cave-ui/panels/beast-codex-panel.js";
import { RegionEventTimelinePanel } from "./cave-ui/panels/region-event-timeline-panel.js";
import { RegionEffectsPanel } from "./cave-ui/panels/region-effects-panel.js";
import { OrganFusionPanel } from "./cave-ui/panels/organ-fusion-panel.js";
import { OrganUpgradePanel } from "./cave-ui/panels/organ-upgrade-panel.js";
import { InventoryPanel } from "./cave-ui/panels/inventory-panel.js";
import { OperatorSkillTreePanel } from "./cave-ui/panels/operator-skill-tree-panel.js";
import { BugBotControlPanel } from "./cave-ui/panels/bugbot-control-panel.js";
import { ActionBar } from "./cave-ui/panels/action-bar.js";

import { stateBus } from "./cave/runtime/state-bus.js";

// DATA
import { operator } from "./cave/data/operator.js";
import { beastRegistry } from "./cave/data/beasts.js";
import { trialRegistry } from "./cave/data/trials.js";
import { regions } from "./cave/data/regions.js";
import { organs } from "./cave/data/organs.js";
import { inventory } from "./cave/data/inventory.js";
import { bugbots } from "./cave/data/bugbots.js";

import { startRuntimeLoop } from "./cave/runtime/runtime-loop.js";

const layout = createLayout();
document.body.appendChild(layout.root);

// Mount panels
[
  ActionBar(stateBus),
  OperatorPanel(stateBus, operator),
  BeastInteractionPanel(stateBus, beastRegistry),
  ArenaCombatPanel(stateBus),
  BeastCodexPanel(stateBus, beastRegistry),
  TrialCodexPanel(stateBus, trialRegistry),
  RegionEventTimelinePanel(stateBus, regions),
  RegionEffectsPanel(stateBus, regions),
  OrganFusionPanel(stateBus, organs),
  OrganUpgradePanel(stateBus, organs),
  InventoryPanel(stateBus, inventory),
  OperatorSkillTreePanel(stateBus),
  BugBotControlPanel(stateBus, bugbots)
].forEach(panel => {
  layout.mountPanel(panel);
  attachPanelControls(layout.root.lastChild);
});

startRuntimeLoop();
