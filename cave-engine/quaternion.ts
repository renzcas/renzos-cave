// quaternion.ts
export function randomQuaternion() {
    return {
        w: 1,
        x: Math.random() * 0.1,
        y: Math.random() * 0.1,
        z: Math.random() * 0.1
    };
}
