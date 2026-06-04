// universe-template.js
// Basic universe descriptor.

export function createUniverse({ id, label, physicsProfile }) {
  return {
    id,
    label,
    physicsProfile,
    state: {}
  };
}
