export interface LearningMetric {
  category: string;
  completed: number;
  total: number;
  color: string;
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
