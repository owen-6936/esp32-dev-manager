import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { Project, ProjectStoreState } from "../types/project";

export const useProjectStore: UseBoundStore<StoreApi<ProjectStoreState>> =
  create((set) => ({
    projects: [] as Project[],
    addProject: (project) =>
      set((state) => ({ projects: [...state.projects, project] })),
    removeProject: (id) =>
      set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
  }));
