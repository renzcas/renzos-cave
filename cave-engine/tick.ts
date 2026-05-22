// tick.ts
import { regions } from "./registry";

export function tick() {
    regions.forEach(r => {
        r.stress += Math.random() * 0.02;

        r.magma += Math.random() * 0.01;
        if (r.magma > 1) {
            r.magma = 0;
            r.topologyState = "slip";
            r.star.brightness = 1;
        }

        if (r.topologyState === "slip") {
            r.topologyState = "stable";
        }

        r.star.brightness = Math.max(0.2, r.stress);
    });
}
