export function updateBeastAI(beasts, camera) {
  const cam = camera.position;

  for (let b of beasts) {
    const dx = cam.x - b.position.x;
    const dz = cam.z - b.position.z;
    const dist = Math.sqrt(dx*dx + dz*dz);

    // Face player
    b.material.rotation = Math.atan2(dx, dz);

    // Wander if far
    if (dist > 10) {
      b.position.x += Math.sin(performance.now() * 0.0005) * 0.01;
      b.position.z += Math.cos(performance.now() * 0.0005) * 0.01;
    }

    // Approach if medium distance
    if (dist < 10 && dist > 2) {
      b.position.x += dx * 0.003;
      b.position.z += dz * 0.003;

      // Snarl once when entering medium range
      if (!b.hasSnarled && b.snarlSound) {
        b.snarlSound.play();
        b.hasSnarled = true;
      }
    }

    // Attack if too close
    if (dist < 1.2) {
      if (!b.isAttacking && b.attackSound) {
        b.isAttacking = true;
        b.attackSound.play();

        // Knockback
        b.position.x -= dx * 0.1;
        b.position.z -= dz * 0.1;

        setTimeout(() => (b.isAttacking = false), 800);
      }
    }

    // Reset snarl when far again
    if (dist > 12) {
      b.hasSnarled = false;
    }
  }
}
