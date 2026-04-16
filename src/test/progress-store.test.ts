import { describe, it, expect } from "vitest";
import { RANK_THRESHOLDS, XP_PER_DIFFICULTY } from "../store/progress";

describe("progress store constants", () => {
    describe("RANK_THRESHOLDS", () => {
        it("has at least 5 ranks", () => {
            expect(RANK_THRESHOLDS.length).toBeGreaterThanOrEqual(5);
        });

        it("ranks are sorted by descending XP (for .find() lookup)", () => {
            for (let i = 1; i < RANK_THRESHOLDS.length; i++) {
                expect(RANK_THRESHOLDS[i].xp).toBeLessThan(
                    RANK_THRESHOLDS[i - 1].xp,
                );
            }
        });

        it("each rank has name, color, icon", () => {
            for (const rank of RANK_THRESHOLDS) {
                expect(rank.rank).toBeTruthy();
                expect(rank.color).toBeTruthy();
                expect(rank.icon).toBeTruthy();
                expect(typeof rank.xp).toBe("number");
            }
        });

        it("last rank starts at 0 XP (Novice)", () => {
            expect(RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1].xp).toBe(0);
        });
    });

    describe("XP_PER_DIFFICULTY", () => {
        it("covers difficulty levels 1-5", () => {
            for (let d = 1; d <= 5; d++) {
                expect(XP_PER_DIFFICULTY[d]).toBeDefined();
                expect(XP_PER_DIFFICULTY[d]).toBeGreaterThan(0);
            }
        });

        it("higher difficulty gives more XP", () => {
            for (let d = 2; d <= 5; d++) {
                expect(XP_PER_DIFFICULTY[d]).toBeGreaterThanOrEqual(
                    XP_PER_DIFFICULTY[d - 1],
                );
            }
        });
    });
});
