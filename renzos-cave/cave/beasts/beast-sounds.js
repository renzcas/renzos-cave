import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.module.js";

export function attachBeastSounds(beast, listener, type) {
  const audioLoader = new THREE.AudioLoader();

  // Idle loop (breathing / low growl)
  const idle = new THREE.PositionalAudio(listener);
  audioLoader.load(`https://cdn.jsdelivr.net/gh/renzcas/assets/${type}_idle.mp3`, (buffer) => {
    idle.setBuffer(buffer);
    idle.setRefDistance(4);
    idle.setLoop(true);
    idle.setVolume(0.35);
    idle.play();
  });
  beast.add(idle);

  // Snarl when player gets close
  const snarl = new THREE.PositionalAudio(listener);
  audioLoader.load(`https://cdn.jsdelivr.net/gh/renzcas/assets/${type}_snarl.mp3`, (buffer) => {
    snarl.setBuffer(buffer);
    snarl.setRefDistance(3);
    snarl.setLoop(false);
    snarl.setVolume(0.8);
  });
  beast.snarlSound = snarl;
  beast.add(snarl);

  // Attack roar
  const attack = new THREE.PositionalAudio(listener);
  audioLoader.load(`https://cdn.jsdelivr.net/gh/renzcas/assets/${type}_attack.mp3`, (buffer) => {
    attack.setBuffer(buffer);
    attack.setRefDistance(3);
    attack.setLoop(false);
    attack.setVolume(1.0);
  });
  beast.attackSound = attack;
  beast.add(attack);
}
