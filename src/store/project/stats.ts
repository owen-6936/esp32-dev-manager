import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { StatsStore } from "../../types/project/stats";

export const useStatsStore: UseBoundStore<StoreApi<StatsStore>> = create(
  (set) => ({
    totalProjects: 0,
    completedProjects: 0,
    totalComponents: 0,
    totalValue: 0,
    timeSpent: 0,
    budgetUsed: 0,
  })
);
