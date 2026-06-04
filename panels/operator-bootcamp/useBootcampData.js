import lessons from "./data/lessons.json";
import labs from "./data/labs.json";
import challenges from "./data/challenges.json";
import xp from "./data/xp.json";
import skillTrees from "./data/skillTrees.json";

export function useBootcampData() {
  return {
    lessons,
    labs,
    challenges,
    xp,
    skillTrees
  };
}
