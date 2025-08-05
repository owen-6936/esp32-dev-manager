import type { JournalEntry } from "../journal/journal";
import type { PinConfig } from "../pin-config";

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
  status: "in-progress" | "completed" | "on-hold";
  difficulty: "beginner" | "intermediate" | "advanced";
  components: string[];
  progress: number;
  budget: number;
  codeSnippets: CodeSnippet[];
  pinConfig: PinConfig[]; // Note: This depends on another type, so you'd import it.
  journalEntries: JournalEntry[]; // Note: This depends on another type
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date; // Optional field for deadline
}

export interface SharedProject {
  id: string;
  title: string;
  author: string;
  likes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface ProjectStoreState {
  projects: Project[];
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
}
