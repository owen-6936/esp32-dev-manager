/* ═══════════════════════════════════════════════════════════════════════════
   tutorial-service.test.ts
   Tests: offline (no Supabase) paths, localStorage cache, source tracking,
   search + filter helpers — all without hitting the network.
   ═══════════════════════════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Always run with Supabase unconfigured so we exercise the offline/cache paths
vi.mock("../lib/supabase", () => ({
    getSupabaseClient: () => null,
    isSupabaseConfigured: () => false,
}));

import {
    fetchProjects,
    fetchProjectById,
    fetchProjectsByCategory,
    fetchProjectsByDifficulty,
    fetchSearchProjects,
    fetchKits,
    getDataSource,
    invalidateCache,
} from "../services/tutorialService";
import type { TutorialProject, FreenoveKit } from "../types/tutorial";

// ─── Fixtures ────────────────────────────────────────────────────────────────

const MOCK_PROJECTS: TutorialProject[] = [
    {
        id: "basic-01.1",
        sketchId: "basic-01.1",
        displayId: "01.1",
        name: "Blink",
        fullName: "Sketch_01.1_Blink",
        category: "led_basics",
        difficulty: "beginner",
        description: "Blink the onboard LED",
        concepts: ["GPIO", "digitalWrite"],
        components: [],
        pinsUsed: [],
        libraries: [],
        prerequisites: [],
        arduinoPath: "C/Sketches/Sketch_01.1_Blink",
        timeEstimate: 15,
        learningObjectives: ["GPIO output"],
        kitTier: "basic",
        tags: ["led", "gpio"],
        language: "arduino",
    },
    {
        id: "basic-05.1",
        sketchId: "basic-05.1",
        displayId: "05.1",
        name: "PWM LED",
        fullName: "Sketch_05.1_RandomColorLight",
        category: "led_basics",
        difficulty: "intermediate",
        description: "PWM control of RGB LED",
        concepts: ["PWM", "analogWrite"],
        components: [],
        pinsUsed: [],
        libraries: [],
        prerequisites: ["basic-01.1"],
        arduinoPath: "C/Sketches/Sketch_05.1",
        timeEstimate: 30,
        learningObjectives: ["PWM"],
        kitTier: "basic",
        tags: ["led", "pwm"],
        language: "arduino",
    },
    {
        id: "ultimate-13.1",
        sketchId: "ultimate-13.1",
        displayId: "13.1",
        name: "Thermometer",
        fullName: "Sketch_13.1_Thermometer",
        category: "environmental_sensors",
        difficulty: "intermediate",
        description: "Read temperature via thermistor ADC",
        concepts: ["ADC", "temperature"],
        components: [],
        pinsUsed: [],
        libraries: [],
        prerequisites: [],
        arduinoPath: "C/Sketches/Sketch_13.1",
        timeEstimate: 45,
        learningObjectives: ["ADC", "sensor"],
        kitTier: "ultimate",
        tags: ["sensor", "adc"],
        language: "arduino",
    },
];

const MOCK_KITS: FreenoveKit[] = [
    {
        sku: "FNK0084",
        name: "Basic",
        tier: "basic",
        board: "esp32-s3-wroom",
        description: "Starter kit",
        tutorialUrl: "https://example.com",
        downloadUrl: "https://example.com",
        projectCount: 34,
        componentCount: 60,
    },
    {
        sku: "FNK0082",
        name: "Ultimate",
        tier: "ultimate",
        board: "esp32-s3-wroom",
        description: "Full kit",
        tutorialUrl: "https://example.com",
        downloadUrl: "https://example.com",
        projectCount: 61,
        componentCount: 200,
    },
];

// Helper — write fixture data to the localStorage cache the service reads
function populateProjectCache(projects = MOCK_PROJECTS) {
    localStorage.setItem(
        "esp32_svc_projects",
        JSON.stringify({ data: projects, ts: Date.now() }),
    );
}

function populateKitCache(kits = MOCK_KITS) {
    localStorage.setItem(
        "esp32_svc_kits",
        JSON.stringify({ data: kits, ts: Date.now() }),
    );
}

beforeEach(() => {
    localStorage.clear();
});

// ─── fetchProjects ────────────────────────────────────────────────────────────

describe("fetchProjects — no Supabase", () => {
    it("returns empty array when cache is empty", async () => {
        const result = await fetchProjects();
        expect(result).toEqual([]);
    });

    it("returns cached projects when cache is populated", async () => {
        populateProjectCache();
        const result = await fetchProjects();
        expect(result).toHaveLength(MOCK_PROJECTS.length);
        expect(result[0].id).toBe("basic-01.1");
    });

    it("getDataSource returns 'cache' after a cache hit", async () => {
        populateProjectCache();
        await fetchProjects();
        expect(getDataSource()).toBe("cache");
    });

    it("getDataSource returns 'empty' when nothing is cached", async () => {
        await fetchProjects();
        expect(getDataSource()).toBe("empty");
    });
});

// ─── fetchProjectById ─────────────────────────────────────────────────────────

describe("fetchProjectById — no Supabase", () => {
    it("returns undefined when cache is empty", async () => {
        const result = await fetchProjectById("basic-01.1");
        expect(result).toBeUndefined();
    });

    it("returns the matching project from cache", async () => {
        populateProjectCache();
        const result = await fetchProjectById("basic-01.1");
        expect(result).toBeDefined();
        expect(result!.name).toBe("Blink");
    });

    it("returns undefined for an id not in cache", async () => {
        populateProjectCache();
        const result = await fetchProjectById("super-99.9");
        expect(result).toBeUndefined();
    });
});

// ─── fetchProjectsByCategory ──────────────────────────────────────────────────

describe("fetchProjectsByCategory — no Supabase", () => {
    it("returns empty array when cache is empty", async () => {
        const result = await fetchProjectsByCategory("led_basics");
        expect(result).toEqual([]);
    });

    it("filters to only matching category", async () => {
        populateProjectCache();
        const result = await fetchProjectsByCategory("led_basics");
        expect(result).toHaveLength(2);
        result.forEach((p) => expect(p.category).toBe("led_basics"));
    });

    it("returns only environmental_sensors projects", async () => {
        populateProjectCache();
        const result = await fetchProjectsByCategory("environmental_sensors");
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("ultimate-13.1");
    });

    it("returns empty array for a category with no matches", async () => {
        populateProjectCache();
        const result = await fetchProjectsByCategory("camera");
        expect(result).toEqual([]);
    });
});

// ─── fetchProjectsByDifficulty ────────────────────────────────────────────────

describe("fetchProjectsByDifficulty — no Supabase", () => {
    it("returns empty array when cache is empty", async () => {
        expect(await fetchProjectsByDifficulty("beginner")).toEqual([]);
    });

    it("returns only beginner projects", async () => {
        populateProjectCache();
        const result = await fetchProjectsByDifficulty("beginner");
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("basic-01.1");
    });

    it("returns all intermediate projects", async () => {
        populateProjectCache();
        const result = await fetchProjectsByDifficulty("intermediate");
        expect(result).toHaveLength(2);
    });

    it("returns empty for a difficulty level with no matches", async () => {
        populateProjectCache();
        const result = await fetchProjectsByDifficulty("advanced");
        expect(result).toEqual([]);
    });
});

// ─── fetchSearchProjects ──────────────────────────────────────────────────────

describe("fetchSearchProjects — no Supabase", () => {
    it("returns empty array when cache is empty regardless of query", async () => {
        expect(await fetchSearchProjects("blink")).toEqual([]);
    });

    it("matches by name (case-insensitive)", async () => {
        populateProjectCache();
        const result = await fetchSearchProjects("BLINK");
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("basic-01.1");
    });

    it("matches by description", async () => {
        populateProjectCache();
        const result = await fetchSearchProjects("thermistor");
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("ultimate-13.1");
    });

    it("matches by fullName", async () => {
        populateProjectCache();
        const result = await fetchSearchProjects("RandomColorLight");
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe("basic-05.1");
    });

    it("returns multiple results when query matches several projects", async () => {
        populateProjectCache();
        const result = await fetchSearchProjects("sketch"); // fullName contains 'Sketch_'
        expect(result.length).toBeGreaterThan(1);
    });

    it("returns empty array when query matches nothing", async () => {
        populateProjectCache();
        const result = await fetchSearchProjects("zyxwvutsrq");
        expect(result).toEqual([]);
    });
});

// ─── fetchKits ────────────────────────────────────────────────────────────────

describe("fetchKits — no Supabase", () => {
    it("returns empty array when cache is empty", async () => {
        expect(await fetchKits()).toEqual([]);
    });

    it("returns cached kits", async () => {
        populateKitCache();
        const result = await fetchKits();
        expect(result).toHaveLength(2);
        expect(result.map((k) => k.sku)).toContain("FNK0084");
    });
});

// ─── invalidateCache ─────────────────────────────────────────────────────────

describe("invalidateCache", () => {
    it("clears a specific cache key", () => {
        populateProjectCache();
        expect(localStorage.getItem("esp32_svc_projects")).not.toBeNull();

        invalidateCache("projects");

        expect(localStorage.getItem("esp32_svc_projects")).toBeNull();
    });

    it("leaves other cache keys intact when a specific key is cleared", () => {
        populateProjectCache();
        populateKitCache();

        invalidateCache("projects");

        expect(localStorage.getItem("esp32_svc_kits")).not.toBeNull();
    });

    it("clears all cache keys when called with no argument", () => {
        populateProjectCache();
        populateKitCache();

        invalidateCache(); // clears all

        expect(localStorage.getItem("esp32_svc_projects")).toBeNull();
        expect(localStorage.getItem("esp32_svc_kits")).toBeNull();
    });
});
