import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { LearningMetricsState } from "../../types/learning";
import { initialLearningMetrics } from "../../constants/learning/learning-metrics";

export const useLearningStore: UseBoundStore<StoreApi<LearningMetricsState>> =
  create<LearningMetricsState>((set) => ({
    // Initialize the store with an array of learning metrics
    learningMetrics: initialLearningMetrics,

    addLearningMetric: (metric) =>
      set((state) => ({
        learningMetrics: [...state.learningMetrics, metric],
      })),

    updateLearningMetric: (category, updatedFields) =>
      set((state) => ({
        learningMetrics: state.learningMetrics.map((metric) =>
          metric.category === category
            ? { ...metric, ...updatedFields }
            : metric
        ),
      })),

    setLearningMetrics: (metrics) => set({ learningMetrics: metrics }),

    resetLearningMetrics: () =>
      set({ learningMetrics: initialLearningMetrics }),
  }));

export const useLearningGoalStore: UseBoundStore<
  StoreApi<LearningMetricsState>
> = create<LearningMetricsState>((set) => ({
  learningMetrics: initialLearningMetrics, // Set initial data
  // Action to add a new learning metric
  addLearningMetric: (metric) =>
    set((state) => ({
      learningMetrics: [...state.learningMetrics, metric],
    })),

  updateLearningMetric: (category, updatedFields) =>
    set((state) => ({
      learningMetrics: state.learningMetrics.map((metric) =>
        metric.category === category ? { ...metric, ...updatedFields } : metric
      ),
    })),

  setLearningMetrics: (metrics) => set({ learningMetrics: metrics }),

  resetLearningMetrics: () => set({ learningMetrics: initialLearningMetrics }),
}));
