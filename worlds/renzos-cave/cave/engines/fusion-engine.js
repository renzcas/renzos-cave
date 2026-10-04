export function fusionEngine(stateBus, organs, fusionRecipes) {
  const previewOps = stateBus.getQueue("fusionPreview");
  const fusionOps = stateBus.getQueue("fusionOps");
  const state = stateBus.getState();

  // Preview fusion
  for (const op of previewOps) {
    const recipe = fusionRecipes.find(r =>
      r.organs.includes(op.organA) && r.organs.includes(op.organB)
    );

    state.fusionPreview = recipe ? recipe.result : null;
  }

  // Execute fusion
  for (const op of fusionOps) {
    const recipe = fusionRecipes.find(r =>
      r.organs.includes(op.organA) && r.organs.includes(op.organB)
    );

    if (recipe) {
      // Remove old organs
      const idxA = organs.findIndex(o => o.id === op.organA);
      const idxB = organs.findIndex(o => o.id === op.organB);
      if (idxA !== -1) organs.splice(idxA, 1);
      if (idxB !== -1) organs.splice(idxB, 1);

      // Add new organ
      organs.push({
        id: recipe.result.id,
        name: recipe.result.name,
        level: 1,
        stats: {
          output: 20,
          stability: 20,
          corruptionResistance: 10
        }
      });

      state.fusionPreview = null;
      stateBus.append("fusionUpdate", {});
    }
  }

  stateBus.flushQueue("fusionPreview");
  stateBus.flushQueue("fusionOps");
}
