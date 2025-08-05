import type { PinConfig } from "../pin-config";
import type { Component } from "../component";

export interface CodeSnippet {
  title: string;
  code: string;
  language: string;
  tags: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "sensors" | "connectivity" | "display" | "automation" | "other";
  startDate: string;
  completedDate?: string;
  deadline?: string;
  githubUrl?: string;
  components: Component[];
  progress: number;
  timeSpent: number;
  estimatedTime: number;
  budget: number;
  actualCost: number;
  notes: string;
  codeSnippets: CodeSnippet[];
  pinConfig: PinConfig[];
  photos: string[];
  powerConsumption: number;
}

export interface SharedProject {
  id: string;
  title: string;
  author: string;
  description: string;
  difficulty: string;
  likes: number;
  components: string[];
  githubUrl?: string;
}

export interface ProjectStoreState {
  projects: Project[];
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
}

export interface SharedProjectStoreState {
  sharedProjects: SharedProject[];
  isLoading: boolean; // Add a loading state for fetching data

  // Actions
  setSharedProjects: (projects: SharedProject[]) => void;
  likeProject: (id: string) => void;
  fetchSharedProjects: () => Promise<void>;
}
