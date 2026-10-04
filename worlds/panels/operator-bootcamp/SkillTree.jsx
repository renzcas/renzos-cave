import React from "react";

export default function SkillTree({ skillTrees }) {
  return (
    <div>
      <h2>Skill Trees</h2>
      <pre>{JSON.stringify(skillTrees, null, 2)}</pre>
    </div>
  );
}
