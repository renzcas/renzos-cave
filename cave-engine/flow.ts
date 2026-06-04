// flow.ts
import { regions } from "./registry";

export interface Flow {
    from: number;
    to: number;
    amount: number;
}

export function computeFlows(): Flow[] {
    const flows: Flow[] = [];

    regions.forEach(r => {
        r.neighbors.forEach(nid => {
            const target = regions[nid];
            const amount = r.stress - target.stress;

            flows.push({
                from: r.id,
                to: target.id,
                amount
            });
        });
    });

    return flows;
}
