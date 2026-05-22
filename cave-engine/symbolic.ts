// symbolic.ts
import { splitHexagram } from "./twist";
import { trigramForces } from "./trigram";

export function buildSymbolicProfile(hex: number) {
    const { upper, lower } = splitHexagram(hex);

    return {
        upper,
        lower,
        forceUpper: trigramForces[upper],
        forceLower: trigramForces[lower]
    };
}
