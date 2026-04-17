import { describe, it, expect } from "vitest";
import {
    SEED_KITS,
    SEED_CATEGORIES,
    SEED_LEARNING_PATHS,
} from "../services/seedContent";

describe("seedContent — SEED_KITS", () => {
    it("has exactly 3 ESP32-S3 kits", () => {
        expect(SEED_KITS).toHaveLength(3);
    });

    it("each kit has required fields", () => {
        for (const kit of SEED_KITS) {
            expect(kit.sku).toBeTruthy();
            expect(kit.name).toBeTruthy();
            expect(kit.tier).toMatch(/^(basic|super|ultimate)$/);
            expect(kit.project_count).toBeGreaterThan(0);
        }
    });

    it("project_count follows tier hierarchy (basic ≤ super ≤ ultimate)", () => {
        const basic = SEED_KITS.find((k) => k.tier === "basic");
        const sup = SEED_KITS.find((k) => k.tier === "super");
        const ult = SEED_KITS.find((k) => k.tier === "ultimate");
        expect(basic).toBeDefined();
        expect(sup).toBeDefined();
        expect(ult).toBeDefined();

        expect(basic!.project_count).toBeLessThanOrEqual(sup!.project_count);
        expect(sup!.project_count).toBeLessThanOrEqual(ult!.project_count);
    });

    it("has correct SKUs", () => {
        const skus = SEED_KITS.map((k) => k.sku);
        expect(skus).toContain("FNK0082");
        expect(skus).toContain("FNK0083");
        expect(skus).toContain("FNK0084");
    });
});

describe("seedContent — SEED_CATEGORIES", () => {
    it("has at least 10 categories", () => {
        expect(SEED_CATEGORIES.length).toBeGreaterThanOrEqual(10);
    });

    it("each category has id, name, color, icon", () => {
        for (const cat of SEED_CATEGORIES) {
            expect(cat.id).toBeTruthy();
            expect(cat.name).toBeTruthy();
            expect(cat.color).toMatch(/^#[0-9a-fA-F]{6}$/);
            expect(cat.icon).toBeTruthy();
        }
    });

    it("category IDs are unique", () => {
        const ids = SEED_CATEGORIES.map((c) => c.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe("seedContent — SEED_LEARNING_PATHS", () => {
    it("has at least 5 learning paths", () => {
        expect(SEED_LEARNING_PATHS.length).toBeGreaterThanOrEqual(5);
    });

    it("each path references valid category IDs", () => {
        const validCategoryIds = new Set(SEED_CATEGORIES.map((c) => c.id));
        for (const path of SEED_LEARNING_PATHS) {
            for (const cat of path.categories) {
                expect(validCategoryIds.has(cat)).toBe(true);
            }
        }
    });

    it("has a complete-journey path", () => {
        const complete = SEED_LEARNING_PATHS.find(
            (p) => p.id === "complete-journey",
        );
        expect(complete).toBeDefined();
    });

    it("path IDs are unique", () => {
        const ids = SEED_LEARNING_PATHS.map((p) => p.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
