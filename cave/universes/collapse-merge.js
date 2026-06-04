// collapse-merge.js
// Placeholder for universe collapse/merge operations.

export function collapseUniverse(universe) {
  return { ...universe, collapsed: true, collapsedAt: Date.now() };
}

export function mergeUniverses(a, b) {
  return {
    id: `${a.id}+${b.id}`,
    label: `${a.label} ⨂ ${b.label}`,
    physicsProfile: { ...a.physicsProfile, ...b.physicsProfile },
    state: { ...a.state, ...b.state },
    mergedAt: Date.now()
  };
}
