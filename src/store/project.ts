import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectStoreState } from "../types/project";

const useProjectStore = create<ProjectStoreState>()(
    persist(
        (set, get) => ({
            projects: [],
            getProjectById: (id) =>
                get().projects.find((project) => project.id === id),
            addProject: (project) =>
                set((state: ProjectStoreState) => ({
                    projects: [...state.projects, project],
                })),
            updateProject: (id, fields) =>
                set((state: ProjectStoreState) => ({
                    projects: state.projects.map((p) =>
                        p.id === id ? { ...p, ...fields } : p,
                    ),
                })),
            removeProject: (id) =>
                set((state: ProjectStoreState) => ({
                    projects: state.projects.filter(
                        (project) => project.id !== id,
                    ),
                })),
        }),
        { name: "esp32-projects" },
    ),
);

export default useProjectStore;
