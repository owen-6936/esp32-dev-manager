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
  addLearningMetric: (metric: LearningMetric) => void;
  updateLearningMetric: (
    category: string,
    updatedFields: Partial<LearningMetric>
  ) => void;
  setLearningMetrics: (metrics: LearningMetric[]) => void;
  resetLearningMetrics: () => void;
}

export interface LearningGoalsState {
  learningGoals: LearningGoal[]; // Array to hold all learning goals

  // Actions to interact with the store
  addLearningGoal: (goal: LearningGoal) => void;
  updateLearningGoal: (
    category: string,
    updatedFields: Partial<LearningGoal>
  ) => void;
  setLearningGoals: (goals: LearningGoal[]) => void;
  resetLearningGoals: () => void;
}
