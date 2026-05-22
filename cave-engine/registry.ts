// registry.ts
import { Region } from "./region";
import { computeStarMeaning } from "./starMeaning";

export const regions: Region[] = [];

export function initRegions() {
    const gridW = 4;
    const gridH = 4;

    let id = 0;

    for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
            const hex = Math.floor(Math.random() * 64) + 1;

            const region: Region = {
                id,
                x,
                y,
                stress: 0,
                magma: 0,
                topologyState: "stable",
                hexagram: hex,
                upperTrig: "☰",
                lowerTrig: "☷",
                quaternion: { w: 1, x: 0, y: 0, z: 0 },
                neighbors: [],
                star: {
                    x: Math.random(),
                    y: Math.random(),
                    brightness: 0.3
                }
            };

            region.meaning = computeStarMeaning(region.hexagram, region.upperTrig, region.lowerTrig);

            regions.push(region);
            id++;
        }
    }

    // Build neighbors
    regions.forEach(r => {
        regions.forEach(other => {
            if (r.id !== other.id) {
                const dx = Math.abs(r.x - other.x);
                const dy = Math.abs(r.y - other.y);
                if (dx + dy === 1) r.neighbors.push(other.id);
            }
        });
    });
}
