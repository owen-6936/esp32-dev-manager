import { create } from "zustand";
import type {
  SharedProject,
  SharedProjectStoreState,
} from "../../types/project/project";

const initialSharedProjects: SharedProject[] = [
  {
    id: "public-1",
    title: "ESP32 Weather Station",
    author: "Adafruit",
    description:
      "A project to build a simple weather station using an ESP32-S3 and DHT11 sensor.",
    likes: 125,
    difficulty: "beginner",
    components: ["ESP32-S3", "DHT11", "OLED Display"],
    githubUrl: "https://github.com/adafruit/esp32-weather-station",
  },
  {
    id: "public-2",
    title: "Smart Home Automation System",
    author: "SparkFun",
    description:
      "An advanced system for controlling lights and appliances using a central ESP32 hub.",
    likes: 580,
    difficulty: "intermediate",
    components: ["ESP32-S3", "Relay Module", "PIR Sensor"],
    githubUrl: "https://github.com/sparkfun/home-automation",
  },
  {
    id: "public-3",
    title: "Custom-Built Drone",
    author: "Owen",
    description: "An open-source project to build a custom drone from scratch.",
    likes: 3,
    difficulty: "advanced",
    components: ["ESP32-S3", "Motor Controller", "GPS Module"],
    githubUrl: undefined,
  },
];
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
