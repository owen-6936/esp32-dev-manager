import { create, type StoreApi, type UseBoundStore } from "zustand";
import type {
  LearningMetric,
  LearningMetricsState,
} from "../../types/learning";

const initialLearningMetrics: LearningMetric[] = [
  { category: "C++", completed: 0, total: 20, color: "bg-green-400" },
  { category: "Python", completed: 0, total: 10, color: "bg-blue-400" },
  {
    category: "JavaScript",
    completed: 0,
    total: 30,
    color: "bg-yellow-400",
  },
  {
    category: "Embedded C",
    completed: 0,
    total: 12,
    color: "bg-purple-400",
  },
  { category: "RTOS", completed: 0, total: 8, color: "bg-red-400" },
];

export const useLearningStore: UseBoundStore<StoreApi<LearningMetricsState>> =
  create<LearningMetricsState>((set) => ({
    learningMetrics: initialLearningMetrics, // Set initial data
    // Action to add a new learning metric
    addMetric: (metric) =>
      set((state) => ({
        learningMetrics: [...state.learningMetrics, metric],
      })),

    // Action to update an existing learning metric by category
    updateMetric: (category, updatedFields) =>
      set((state) => ({
        learningMetrics: state.learningMetrics.map((metric) =>
          metric.category === category
            ? { ...metric, ...updatedFields }
            : metric
        ),
      })),

    // Action to completely replace the learning metrics array
    setMetrics: (metrics) => set({ learningMetrics: metrics }),

    // Action to reset metrics to their initial state
    resetMetrics: () => set({ learningMetrics: initialLearningMetrics }),
  }));

export const useLearningGoalStore: UseBoundStore<
  StoreApi<LearningMetricsState>
> = create<LearningMetricsState>((set) => ({
  learningMetrics: initialLearningMetrics, // Set initial data
  // Action to add a new learning metric
  addMetric: (metric) =>
    set((state) => ({
      learningMetrics: [...state.learningMetrics, metric],
    })),

  // Action to update an existing learning metric by category
  updateMetric: (category, updatedFields) =>
    set((state) => ({
      learningMetrics: state.learningMetrics.map((metric) =>
        metric.category === category ? { ...metric, ...updatedFields } : metric
      ),
    })),

  // Action to completely replace the learning metrics array
  setMetrics: (metrics) => set({ learningMetrics: metrics }),

  // Action to reset metrics to their initial state
  resetMetrics: () => set({ learningMetrics: initialLearningMetrics }),
}));
