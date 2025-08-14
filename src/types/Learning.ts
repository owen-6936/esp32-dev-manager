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
