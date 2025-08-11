import type { PinConfig } from "../pin-config";
import type { Component } from "../component";

export interface CodeSnippet {
  title: string;
  code: string;
  language: string;
  tags: string[];
}

export interface task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

export type Category =
  | "embedded_systems"
  | "iot"
  | "robotics"
  | "web_development"
  | "mobile_development"
  | "data_processing"
  | "sensors"
  | "connectivity"
  | "power_supply"
  | "actuators"
  | "display"
  | "automation"
  | "other";
export interface Project {
  id: string;
  title: string;
  description: string;
  category: Category[];
  status: "planning" | "in-progress" | "completed" | "on-hold";
  difficulty: "beginner" | "intermediate" | "advanced";
  startDate: string;
  completedDate?: string;
  deadline?: string;
  githubUrl?: string;
  components: Component[];
  progress?: number;
  timeSpent?: number;
  estimatedTime?: number;
  budget?: number;
  actualCost?: number;
  note?: string;
  codeSnippets?: CodeSnippet[];
  pinConfig?: PinConfig[];
  photos?: string[];
  powerConsumption?: number;
  tasks?: task[];
}

export interface ProjectStoreState {
  projects: Project[];
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
}
