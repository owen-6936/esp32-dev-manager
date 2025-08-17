import { create } from "zustand";
import type { ProjectStoreState } from "../types/project";

const useProjectStore = create<ProjectStoreState>((set, get) => ({
  projects: [],
  getProjectById: (id) => get().projects.find((project) => project.id === id),
  addProject: (project) =>
    set((state: ProjectStoreState) => ({
      projects: [...state.projects, project],
    })),
  removeProject: (id) =>
    set((state: ProjectStoreState) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
}));

export default useProjectStore;
