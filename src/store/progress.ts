import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProjectStatus = "not_started" | "in_progress" | "completed";

export interface ProjectProgress {
    projectId: string;
    status: ProjectStatus;
    /** Index of the last completed wiring/learning step */
    checkpoint: number;
    startedAt?: string;
    completedAt?: string;
    xpAwarded: boolean;
}

export const XP_PER_DIFFICULTY: Record<number, number> = {
    1: 50,
    2: 100,
    3: 200,
    4: 400,
    5: 800,
};

export const RANK_THRESHOLDS = [
    { rank: "Grandmaster", xp: 25000, color: "#f59e0b", icon: "👑" },
    { rank: "Master", xp: 10000, color: "#8b5cf6", icon: "🔮" },
    { rank: "Expert", xp: 4000, color: "#ef4444", icon: "⚡" },
    { rank: "Engineer", xp: 1500, color: "#3b82f6", icon: "🔧" },
    { rank: "Tinkerer", xp: 500, color: "#22c55e", icon: "🛠️" },
    { rank: "Apprentice", xp: 100, color: "#06b6d4", icon: "📚" },
    { rank: "Novice", xp: 0, color: "#6b7280", icon: "🌱" },
] as const;

export type RankName = (typeof RANK_THRESHOLDS)[number]["rank"];

export function getRank(xp: number) {
    return (
        RANK_THRESHOLDS.find((r) => xp >= r.xp) ??
        RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1]
    );
}

export function getLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/** XP needed to reach next rank threshold (for progress bar) */
export function xpToNextRank(xp: number): {
    current: number;
    needed: number;
    nextRank: string;
} {
    const sorted = [...RANK_THRESHOLDS].reverse();
    const idx = sorted.findIndex((r) => xp >= r.xp);
    const nextIdx = idx - 1;
    if (nextIdx < 0) return { current: xp, needed: xp, nextRank: "Max" };
    const next = sorted[nextIdx];
    const prev = sorted[idx];
    return {
        current: xp - prev.xp,
        needed: next.xp - prev.xp,
        nextRank: next.rank,
    };
}

interface ProgressStore {
    progress: Record<string, ProjectProgress>;
    totalXp: number;

    startProject: (projectId: string) => void;
    advanceCheckpoint: (projectId: string, step: number) => void;
    /** Marks complete and awards XP. Returns 0 if already awarded. */
    completeProject: (projectId: string, difficulty: number) => number;
    getProgress: (projectId: string) => ProjectProgress;
    completedCount: () => number;
    completedProjects: () => string[];
    resetProject: (projectId: string) => void;
}

const useProgressStore = create<ProgressStore>()(
    persist(
        (set, get) => ({
            progress: {},
            totalXp: 0,

            startProject: (projectId) =>
                set((state) => {
                    if (state.progress[projectId]) return state;
                    return {
                        progress: {
                            ...state.progress,
                            [projectId]: {
                                projectId,
                                status: "in_progress",
                                checkpoint: 0,
                                startedAt: new Date().toISOString(),
                                xpAwarded: false,
                            },
                        },
                    };
                }),

            advanceCheckpoint: (projectId, step) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        [projectId]: {
                            projectId,
                            status: "in_progress",
                            xpAwarded: false,
                            ...(state.progress[projectId] ?? {}),
                            checkpoint: step,
                            startedAt:
                                state.progress[projectId]?.startedAt ??
                                new Date().toISOString(),
                        },
                    },
                })),

            completeProject: (projectId, difficulty) => {
                const state = get();
                const existing = state.progress[projectId];
                if (existing?.xpAwarded) return 0;
                const xp = XP_PER_DIFFICULTY[difficulty] ?? 100;
                set({
                    totalXp: state.totalXp + xp,
                    progress: {
                        ...state.progress,
                        [projectId]: {
                            projectId,
                            ...(existing ?? {}),
                            status: "completed",
                            completedAt: new Date().toISOString(),
                            xpAwarded: true,
                        },
                    },
                });
                return xp;
            },

            getProgress: (projectId) =>
                get().progress[projectId] ?? {
                    projectId,
                    status: "not_started",
                    checkpoint: 0,
                    xpAwarded: false,
                },

            completedCount: () =>
                Object.values(get().progress).filter(
                    (p) => p.status === "completed",
                ).length,

            completedProjects: () =>
                Object.values(get().progress)
                    .filter((p) => p.status === "completed")
                    .map((p) => p.projectId),

            resetProject: (projectId) =>
                set((state) => {
                    const existing = state.progress[projectId];
                    const xpToRemove = existing?.xpAwarded
                        ? (XP_PER_DIFFICULTY[0] ?? 0)
                        : 0;
                    const next = { ...state.progress };
                    delete next[projectId];
                    return {
                        progress: next,
                        totalXp: Math.max(0, state.totalXp - xpToRemove),
                    };
                }),
        }),
        { name: "esp32-progress-v1" },
    ),
);

export default useProgressStore;
