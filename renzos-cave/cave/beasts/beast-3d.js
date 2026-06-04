import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.module.js";

export function spawnBeast(scene, textureURL, x, y, z) {
  const tex = new THREE.TextureLoader().load(textureURL);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 1.0,
      color: 0xffffff
    })
  );

  sprite.scale.set(1.8, 1.8, 1.8);
  sprite.position.set(x, y, z);

  scene.add(sprite);

  return sprite;
}
