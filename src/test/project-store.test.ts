/* ═══════════════════════════════════════════════════════════════════════════
   project-store.test.ts
   Tests: CRUD, lookup, localStorage persistence
   ═══════════════════════════════════════════════════════════════════════════ */

import { describe, it, expect, beforeEach } from "vitest";
import useProjectStore from "../store/project";
import type { Project } from "../types/project";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeProject(overrides: Partial<Project> = {}): Project {
    return {
        id: "proj-1",
        title: "LED Blink",
        description: "Basic GPIO output via onboard LED",
        category: ["embedded_systems"],
        status: "planning",
        difficulty: "beginner",
        startDate: "2025-01-10",
        components: [],
        ...overrides,
    };
}

beforeEach(() => {
    localStorage.clear();
    useProjectStore.setState({ projects: [] });
});

// ─── addProject ──────────────────────────────────────────────────────────────

describe("addProject", () => {
    it("adds a project to an empty store", () => {
        useProjectStore.getState().addProject(makeProject());
        expect(useProjectStore.getState().projects).toHaveLength(1);
    });

    it("stores all fields correctly", () => {
        const proj = makeProject({ title: "PWM Demo", status: "in-progress" });
        useProjectStore.getState().addProject(proj);
        expect(useProjectStore.getState().projects[0]).toEqual(proj);
    });

    it("appends multiple projects in insertion order", () => {
        const p1 = makeProject({ id: "a", title: "Alpha" });
        const p2 = makeProject({ id: "b", title: "Beta" });
        const p3 = makeProject({ id: "c", title: "Gamma" });
        [p1, p2, p3].forEach((p) => useProjectStore.getState().addProject(p));
        const titles = useProjectStore.getState().projects.map((p) => p.title);
        expect(titles).toEqual(["Alpha", "Beta", "Gamma"]);
    });

    it("handles optional fields as undefined", () => {
        const proj = makeProject({
            linkedTutorialId: undefined,
            deadline: undefined,
        });
        useProjectStore.getState().addProject(proj);
        const stored = useProjectStore.getState().projects[0];
        expect(stored.linkedTutorialId).toBeUndefined();
        expect(stored.deadline).toBeUndefined();
    });

    it("accepts every project status", () => {
        const statuses: Project["status"][] = [
            "planning",
            "in-progress",
            "completed",
            "on-hold",
        ];
        statuses.forEach((status, i) => {
            useProjectStore
                .getState()
                .addProject(makeProject({ id: String(i), status }));
        });
        const stored = useProjectStore.getState().projects.map((p) => p.status);
        expect(stored).toEqual(statuses);
    });

    it("accepts every difficulty level", () => {
        const diffs: Project["difficulty"][] = [
            "beginner",
            "intermediate",
            "advanced",
        ];
        diffs.forEach((difficulty, i) => {
            useProjectStore
                .getState()
                .addProject(makeProject({ id: String(i), difficulty }));
        });
        const stored = useProjectStore
            .getState()
            .projects.map((p) => p.difficulty);
        expect(stored).toEqual(diffs);
    });

    it("stores linkedTutorialId for tutorial-linked projects", () => {
        const proj = makeProject({ linkedTutorialId: "basic-01.1" });
        useProjectStore.getState().addProject(proj);
        expect(useProjectStore.getState().projects[0].linkedTutorialId).toBe(
            "basic-01.1",
        );
    });
});

// ─── removeProject ───────────────────────────────────────────────────────────

describe("removeProject", () => {
    it("removes the matching project", () => {
        useProjectStore.getState().addProject(makeProject({ id: "rm" }));
        useProjectStore.getState().removeProject("rm");
        expect(useProjectStore.getState().projects).toHaveLength(0);
    });

    it("only removes the targeted project", () => {
        const p1 = makeProject({ id: "keep", title: "Keep" });
        const p2 = makeProject({ id: "drop", title: "Drop" });
        useProjectStore.getState().addProject(p1);
        useProjectStore.getState().addProject(p2);

        useProjectStore.getState().removeProject("drop");

        expect(useProjectStore.getState().projects).toHaveLength(1);
        expect(useProjectStore.getState().projects[0].id).toBe("keep");
    });

    it("is a no-op for a non-existent id", () => {
        useProjectStore.getState().addProject(makeProject());
        useProjectStore.getState().removeProject("ghost");
        expect(useProjectStore.getState().projects).toHaveLength(1);
    });

    it("results in empty array after removing the last project", () => {
        useProjectStore.getState().addProject(makeProject({ id: "only" }));
        useProjectStore.getState().removeProject("only");
        expect(useProjectStore.getState().projects).toHaveLength(0);
    });
});

// ─── getProjectById ──────────────────────────────────────────────────────────

describe("getProjectById", () => {
    it("returns the matching project", () => {
        const proj = makeProject({ id: "find-me", title: "Target" });
        useProjectStore.getState().addProject(proj);

        const found = useProjectStore.getState().getProjectById("find-me");
        expect(found).toBeDefined();
        expect(found!.title).toBe("Target");
    });

    it("returns undefined when no match", () => {
        useProjectStore.getState().addProject(makeProject({ id: "a" }));
        expect(useProjectStore.getState().getProjectById("z")).toBeUndefined();
    });

    it("finds the correct project among many", () => {
        ["a", "b", "c", "d"].forEach((id) => {
            useProjectStore
                .getState()
                .addProject(makeProject({ id, title: `Proj-${id}` }));
        });
        expect(useProjectStore.getState().getProjectById("c")!.title).toBe(
            "Proj-c",
        );
    });

    it("returns undefined on empty store", () => {
        expect(
            useProjectStore.getState().getProjectById("any"),
        ).toBeUndefined();
    });
});

// ─── localStorage persistence ────────────────────────────────────────────────

describe("localStorage persistence", () => {
    it("writes to localStorage after addProject", () => {
        useProjectStore.getState().addProject(makeProject());
        const raw = localStorage.getItem("esp32-projects");
        expect(raw).not.toBeNull();
        const parsed = JSON.parse(raw!);
        expect(parsed.state.projects).toHaveLength(1);
    });

    it("removes project from localStorage after removeProject", () => {
        useProjectStore.getState().addProject(makeProject({ id: "bye" }));
        useProjectStore.getState().removeProject("bye");
        const raw = localStorage.getItem("esp32-projects");
        const parsed = JSON.parse(raw!);
        expect(parsed.state.projects).toHaveLength(0);
    });

    it("stores date fields as plain strings (no Date objects)", () => {
        const proj = makeProject({
            startDate: "2025-04-08",
            deadline: "2025-05-01",
        });
        useProjectStore.getState().addProject(proj);
        const raw = localStorage.getItem("esp32-projects");
        const stored = JSON.parse(raw!).state.projects[0];
        expect(typeof stored.startDate).toBe("string");
        expect(typeof stored.deadline).toBe("string");
    });

    it("persists multiple projects and retrieves them all", () => {
        for (let i = 0; i < 5; i++) {
            useProjectStore
                .getState()
                .addProject(makeProject({ id: String(i), title: `P${i}` }));
        }
        const raw = localStorage.getItem("esp32-projects");
        const parsed = JSON.parse(raw!);
        expect(parsed.state.projects).toHaveLength(5);
    });
});
