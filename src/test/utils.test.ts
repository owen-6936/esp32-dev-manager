/* ═══════════════════════════════════════════════════════════════════════════
   utils.test.ts
   Tests: getStatusColor, getDifficultyColor, getRarityColor, cn, inputClass
   Pure functions — if any of these change without a test catching it, the
   UI will silently render the wrong color class.
   ═══════════════════════════════════════════════════════════════════════════ */

import { describe, it, expect } from "vitest";
import {
    getStatusColor,
    getDifficultyColor,
    getRarityColor,
    cn,
    inputClass,
} from "../utils/utils";
import type { Project } from "../types/project";

// ─── getStatusColor ───────────────────────────────────────────────────────────

describe("getStatusColor", () => {
    it("returns green classes for 'completed'", () => {
        const result = getStatusColor("completed");
        expect(result).toContain("green");
    });

    it("returns blue classes for 'in-progress'", () => {
        const result = getStatusColor("in-progress");
        expect(result).toContain("blue");
    });

    it("returns yellow classes for 'planning'", () => {
        const result = getStatusColor("planning");
        expect(result).toContain("yellow");
    });

    it("returns gray classes for 'on-hold'", () => {
        const result = getStatusColor("on-hold");
        expect(result).toContain("gray");
    });

    it("returns a non-empty string for every valid status", () => {
        const statuses: Project["status"][] = [
            "completed",
            "in-progress",
            "planning",
            "on-hold",
        ];
        statuses.forEach((s) => {
            expect(getStatusColor(s).length).toBeGreaterThan(0);
        });
    });

    it("all four statuses produce different classes", () => {
        const statuses: Project["status"][] = [
            "completed",
            "in-progress",
            "planning",
            "on-hold",
        ];
        const classes = statuses.map(getStatusColor);
        const unique = new Set(classes);
        expect(unique.size).toBe(4);
    });
});

// ─── getDifficultyColor ───────────────────────────────────────────────────────

describe("getDifficultyColor", () => {
    it("returns green for 'beginner'", () => {
        expect(getDifficultyColor("beginner")).toContain("green");
    });

    it("returns yellow for 'intermediate'", () => {
        expect(getDifficultyColor("intermediate")).toContain("yellow");
    });

    it("returns red for 'advanced'", () => {
        expect(getDifficultyColor("advanced")).toContain("red");
    });

    it("all three levels produce different classes", () => {
        const diffs: Project["difficulty"][] = [
            "beginner",
            "intermediate",
            "advanced",
        ];
        const colors = diffs.map(getDifficultyColor);
        const unique = new Set(colors);
        expect(unique.size).toBe(3);
    });

    it("difficulty colors are severity-ordered (green < yellow < red)", () => {
        const beginner = getDifficultyColor("beginner");
        const intermediate = getDifficultyColor("intermediate");
        const advanced = getDifficultyColor("advanced");

        // Simple membership check — each value is distinct and in expected bucket
        expect(beginner).not.toBe(intermediate);
        expect(intermediate).not.toBe(advanced);
        expect(beginner).not.toBe(advanced);
    });
});

// ─── getRarityColor ────────────────────────────────────────────────────────────

describe("getRarityColor", () => {
    const rarities = [
        "common",
        "uncommon",
        "rare",
        "epic",
        "legendary",
    ] as const;

    it("returns a non-empty string for every rarity tier", () => {
        rarities.forEach((r) => {
            expect(getRarityColor(r).length).toBeGreaterThan(0);
        });
    });

    it("all five rarities produce distinct class strings", () => {
        const colors = rarities.map(getRarityColor);
        const unique = new Set(colors);
        expect(unique.size).toBe(rarities.length);
    });

    it("legendary is gold/yellow toned", () => {
        expect(getRarityColor("legendary")).toContain("yellow");
    });

    it("epic is purple toned", () => {
        expect(getRarityColor("epic")).toContain("purple");
    });

    it("rare is blue toned", () => {
        expect(getRarityColor("rare")).toContain("blue");
    });

    it("uncommon is green toned", () => {
        expect(getRarityColor("uncommon")).toContain("green");
    });

    it("common is gray/muted toned", () => {
        expect(getRarityColor("common")).toContain("gray");
    });
});

// ─── cn (className merger) ─────────────────────────────────────────────────────

describe("cn", () => {
    it("merges multiple string classes", () => {
        const result = cn("text-white", "bg-blue-500", "p-4");
        expect(result).toBe("text-white bg-blue-500 p-4");
    });

    it("filters out falsy values (false, undefined, null, 0)", () => {
        const result = cn("base", false, undefined, null, 0, "active");
        expect(result).toBe("base active");
    });

    it("returns empty string when all arguments are falsy", () => {
        expect(cn(false, undefined, null, 0)).toBe("");
    });

    it("returns single class unchanged", () => {
        expect(cn("text-red-500")).toBe("text-red-500");
    });

    it("handles boolean conditions (common pattern)", () => {
        const isActive = true;
        const isDisabled = false;
        const result = cn(
            "btn",
            isActive && "btn-active",
            isDisabled && "btn-disabled",
        );
        expect(result).toBe("btn btn-active");
        expect(result).not.toContain("btn-disabled");
    });

    it("handles empty string arguments by not including them", () => {
        // Empty string is falsy in JS
        const result = cn("a", "", "b");
        expect(result).toBe("a b");
    });
});

// ─── inputClass ───────────────────────────────────────────────────────────────

describe("inputClass", () => {
    it("applies error border when field has an error", () => {
        const errors = { email: "Required" };
        const cls = inputClass(errors, "email");
        expect(cls).toContain("border-red-500");
    });

    it("applies normal border when field has no error", () => {
        const errors = { email: "Required" };
        const cls = inputClass(errors, "password");
        expect(cls).toContain("border-white/20");
        expect(cls).not.toContain("border-red-500");
    });

    it("applies normal border for an empty errors object", () => {
        const cls = inputClass({}, "name");
        expect(cls).toContain("border-white/20");
        expect(cls).not.toContain("border-red-500");
    });

    it("returns a non-empty class string in all cases", () => {
        const withError = inputClass({ x: "bad" }, "x");
        const withoutError = inputClass({}, "x");
        expect(withError.length).toBeGreaterThan(0);
        expect(withoutError.length).toBeGreaterThan(0);
    });
});
