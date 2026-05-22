// STAR-MEANING ENGINE
// Maps hexagrams + trigrams → star archetypes + cosmic forces

export interface StarMeaning {
    archetype: string;
    forceUpper: string;
    forceLower: string;
    role: string;
    behaviorBias: string;
}

// 8 Trigram → Cosmic Force Map
const trigramForces: Record<string, string> = {
    "☰": "Expansion / Radiance",
    "☷": "Absorption / Stability",
    "☵": "Depth / Memory",
    "☲": "Illumination / Insight",
    "☳": "Shock / Activation",
    "☶": "Stillness / Boundary",
    "☴": "Influence / Diffusion",
    "☱": "Joy / Resonance"
};

// Minimal 64 Hexagram → Archetype Map (expand later)
const hexagramArchetypes: Record<number, string> = {
    1: "The Radiant Star",
    2: "The Deep Star",
    3: "The Turbulent Star",
    5: "The Patient Star",
    11: "The Harmonizing Star",
    43: "The Shattering Star",
    64: "The Unfinished Star"
};

// Compute STAR-MEANING for a region
export function computeStarMeaning(hexagram: number, upperTrig: string, lowerTrig: string): StarMeaning {
    const archetype = hexagramArchetypes[hexagram] || "Unknown Star";

    const forceUpper = trigramForces[upperTrig] || "Unknown Force";
    const forceLower = trigramForces[lowerTrig] || "Unknown Force";

    const role = `${forceUpper} over ${forceLower}`;

    const behaviorBias = `Regions with this star tend toward ${forceUpper.toLowerCase()}`;

    return {
        archetype,
        forceUpper,
        forceLower,
        role,
        behaviorBias
    };
}
