import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { Component } from "../../types/component";
import type { Project } from "../../types/project/project";
import { useProjectStore } from "./project";
import { useComponentStore } from "../component/component";

interface StatsStore {
  totalProjects: number;
  completedProjects: number;
  totalComponents: number;
  totalValue: number;
  timeSpent: number;
  budgetUsed: number;
}

// 1. A helper function to calculate project-related stats
const getProjectStats = (projects: Project[]) => {
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;
  // You can add more project-based stats here if needed
  return {
    totalProjects: projects.length,
    completedProjects,
  };
};

// 2. A helper function to calculate component-related stats using reduce
const getComponentStats = (components: Component[]) => {
  const totalValue = components.reduce(
    (sum, component) => sum + (component.totalCost || 0),
    0
  );
  const budgetUsed = components.reduce(
    (sum, component) => sum + (component.budget || 0),
    0
  );

  return {
    totalComponents: components.length,
    totalValue,
    budgetUsed,
  };
};

// 3. Create the main stats store
export const useStatsStore: UseBoundStore<StoreApi<StatsStore>> = create(() => {
  // Get initial state from both stores
  const initialProjects = useProjectStore.getState().projects;
  const initialComponents = useComponentStore.getState().components;

  const projectStats = getProjectStats(initialProjects);
  const componentStats = getComponentStats(initialComponents);

  return {
    ...projectStats,
    ...componentStats,
    timeSpent: initialProjects.reduce(
      (sum, project) => sum + (project.timeSpent || 0),
      0
    ),
  };
});

// Subscribe to both stores to keep stats updated

// Listen to the project store
useProjectStore.subscribe((projectStoreState) => {
  const projectStats = getProjectStats(projectStoreState.projects);
  useStatsStore.setState(projectStats);
});

// Listen to the component store
useComponentStore.subscribe((componentStoreState) => {
  const componentStats = getComponentStats(componentStoreState.components);
  useStatsStore.setState(componentStats);
});
