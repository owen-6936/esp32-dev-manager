import type { ReactNode } from "react";

export interface LearningMetric {
  category: string;
  completed: number;
  total: number;
  color: string;
}

export interface LearningGoal extends LearningMetric {
  description: string; // Description of the learning goal
  icon: ReactNode; // Icon name or component for the goal
}

export interface LearningMetricsState {
  learningMetrics: LearningMetric[]; // Array to hold all learning metrics

  // Actions to interact with the store
  addMetric: (metric: LearningMetric) => void;
  updateMetric: (
    category: string,
    updatedFields: Partial<LearningMetric>
  ) => void;
  setMetrics: (metrics: LearningMetric[]) => void;
  resetMetrics: () => void;
}

export interface LearningGoalsState {
  learningGoals: LearningGoal[]; // Array to hold all learning goals

  // Actions to interact with the store
  addGoal: (goal: LearningGoal) => void;
  updateGoal: (category: string, updatedFields: Partial<LearningGoal>) => void;
  setGoals: (goals: LearningGoal[]) => void;
  resetGoals: () => void;
}
