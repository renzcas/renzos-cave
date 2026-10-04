export const arenaWaves = [
  {
    wave: 1,
    enemies: ["beast_wolf"],
    modifiers: [],
    boss: false
  },
  {
    wave: 2,
    enemies: ["beast_wolf", "beast_wolf"],
    modifiers: ["+10% corruption"],
    boss: false
  },
  {
    wave: 3,
    enemies: ["beast_tiger"],
    modifiers: ["+20% aggression"],
    boss: false
  },
  {
    wave: 4,
    enemies: ["beast_tiger", "beast_wolf"],
    modifiers: ["+10% corruption", "+10% hp"],
    boss: false
  },
  {
    wave: 5,
    enemies: ["beast_minotaur"],
    modifiers: ["Boss Wave", "+30% hp", "+20% corruption"],
    boss: true
  }
];
