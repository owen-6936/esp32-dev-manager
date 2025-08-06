import { create } from "zustand";
import type {
  SharedProject,
  SharedProjectStoreState,
} from "../../types/project/project";

const initialSharedProjects: SharedProject[] = [];
export const useSharedProjectStore = create<SharedProjectStoreState>((set) => ({
  sharedProjects: initialSharedProjects,
  isLoading: false,

  // Action to completely replace the projects array (e.g., after fetching)
  setSharedProjects: (projects) => set({ sharedProjects: projects }),

  // Action to increment the likes for a project
  likeProject: (id) =>
    set((state) => ({
      sharedProjects: state.sharedProjects.map((project) =>
        project.id === id ? { ...project, likes: project.likes + 1 } : project
      ),
    })),

  // Action to simulate fetching projects from an API
  fetchSharedProjects: async () => {
    set({ isLoading: true });
    // In a real app, you would make an API call here.
    // For now, let's simulate a network delay.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({
      sharedProjects: initialSharedProjects, // Reset to initial data after fetch
      isLoading: false,
    });
  },
}));
