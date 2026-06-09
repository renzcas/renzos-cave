import { EntranceScene } from './scenes/entranceScene.js';
import { HydraChamberScene } from './scenes/hydraChamberScene.js';
import { TransitionSystem } from './systems/transitionSystem.js';

let currentScene = new EntranceScene(scene, player);

function gameLoop() {
  requestAnimationFrame(gameLoop);

  currentScene.update();
  TransitionSystem.update(player, currentScene);

  renderer.render(scene, camera);
}

gameLoop();