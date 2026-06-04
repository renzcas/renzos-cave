// twist.ts
export function splitHexagram(hex: number): { upper: string; lower: string } {
    const trigrams = ["☰", "☷", "☵", "☲", "☳", "☶", "☴", "☱"];
    return {
        upper: trigrams[hex % 8],
        lower: trigrams[(hex + 3) % 8]
    };
}
