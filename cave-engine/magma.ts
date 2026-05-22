// magma.ts
import { regions } from "./registry";

export function updateMagma() {
    regions.forEach(r => {
        r.magma += Math.random() * 0.02;

        if (r.magma > 1) {
            r.magma = 0;
            r.topologyState = "slip";
            r.star.brightness = 1;
        }
    });
}
