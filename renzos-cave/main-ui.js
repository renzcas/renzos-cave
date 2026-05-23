import { createLayout } from "./cave-ui/layout/layout.js";
import { attachPanelControls } from "./cave-ui/controls/panel-controls.js";

import { RuntimePanel } from "./cave-ui/panels/runtime-panel.js";
import { OrgansPanel } from "./cave-ui/panels/organs-panel.js";
import { BeastsPanel } from "./cave-ui/panels/beasts-panel.js";
import { TrialsPanel } from "./cave-ui/panels/trials-panel.js";
import { ArenaPanel } from "./cave-ui/panels/arena-panel.js";
import { DebugPanel } from "./cave-ui/panels/debug-panel.js";
import { RegionMapPanel } from "./cave-ui/panels/region-map-panel.js";
import { OperatorPanel } from "./cave-ui/panels/operator-panel.js";
import { ActionBar } from "./cave-ui/panels/action-bar.js";
import { BeastInteractionPanel } from "./cave-ui/panels/beast-interaction-panel.js";

import { stateBus } from "./cave/runtime/state-bus.js";
import { organs } from "./cave/data/organs.js";
import { beastRegistry } from "./cave/data/beasts.js";
import { trialRegistry } from "./cave/data/trials.js";
import { regionRegistry } from "./cave/data/regions.js";
import { operator } from "./cave/data/operator.js";

const layout = createLayout();
document.body.appendChild(layout.root);

// Mount panels
[
  ActionBar(stateBus),
  OperatorPanel(stateBus, operator),
  RegionMapPanel(stateBus, regionRegistry),
  BeastsPanel(stateBus, beastRegistry),
  BeastInteractionPanel(stateBus, beastRegistry),
  TrialsPanel(stateBus, trialRegistry),
  ArenaPanel(stateBus),
  RuntimePanel(stateBus),
  OrgansPanel(stateBus, organs),
  DebugPanel(stateBus)
].forEach(panel => {
  layout.mountPanel(panel);
  attachPanelControls(layout.root.lastChild);
});
