import { describe, it, expect } from "vitest";
import { includedTiers, tierOrder, sortKitsByTier } from "../utils/kitHelpers";
import type { FreenoveKit } from "../types/tutorial";

// Mock kits matching what SEED_KITS would produce after DB load
const MOCK_KITS: FreenoveKit[] = [
    {
        sku: "FNK0084",
        name: "Basic",
        tier: "basic",
        board: "esp32-s3-wroom",
        description: "",
        tutorialUrl: "",
        downloadUrl: "",
        projectCount: 34,
        componentCount: 60,
        color: "#22c55e",
        tierOrder: 0,
    },
    {
        sku: "FNK0083",
        name: "Super",
        tier: "super",
        board: "esp32-s3-wroom",
        description: "",
        tutorialUrl: "",
        downloadUrl: "",
        projectCount: 45,
        componentCount: 120,
        color: "#3b82f6",
        tierOrder: 1,
    },
    {
        sku: "FNK0082",
        name: "Ultimate",
        tier: "ultimate",
        board: "esp32-s3-wroom",
        description: "",
        tutorialUrl: "",
        downloadUrl: "",
        projectCount: 61,
        componentCount: 200,
        color: "#8b5cf6",
        tierOrder: 2,
    },
];

describe("Kit helpers (database-driven)", () => {
    describe("includedTiers", () => {
        it("basic tier only includes basic", () => {
            expect(includedTiers(MOCK_KITS, "basic")).toEqual(["basic"]);
        });

        it("super tier includes basic and super", () => {
            expect(includedTiers(MOCK_KITS, "super")).toEqual([
                "basic",
                "super",
            ]);
        });

        it("ultimate tier includes all three", () => {
            expect(includedTiers(MOCK_KITS, "ultimate")).toEqual([
                "basic",
                "super",
                "ultimate",
            ]);
        });

        it("tiers form a strict subset hierarchy", () => {
            const basic = new Set(includedTiers(MOCK_KITS, "basic"));
            const sup = new Set(includedTiers(MOCK_KITS, "super"));
            const ult = new Set(includedTiers(MOCK_KITS, "ultimate"));

            for (const t of basic) expect(sup.has(t)).toBe(true);
            for (const t of sup) expect(ult.has(t)).toBe(true);
            expect(basic.size).toBeLessThan(sup.size);
            expect(sup.size).toBeLessThan(ult.size);
        });
    });

    describe("tierOrder", () => {
        it("basic < super < ultimate", () => {
            expect(tierOrder(MOCK_KITS, "basic")).toBeLessThan(
                tierOrder(MOCK_KITS, "super"),
            );
            expect(tierOrder(MOCK_KITS, "super")).toBeLessThan(
                tierOrder(MOCK_KITS, "ultimate"),
            );
        });
    });

    describe("sortKitsByTier", () => {
        it("sorts kits in ascending tier order", () => {
            const shuffled = [MOCK_KITS[2], MOCK_KITS[0], MOCK_KITS[1]];
            const sorted = sortKitsByTier(shuffled);
            expect(sorted.map((k) => k.tier)).toEqual([
                "basic",
                "super",
                "ultimate",
            ]);
        });
    });
});
