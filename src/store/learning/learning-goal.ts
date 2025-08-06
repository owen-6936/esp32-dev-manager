import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { LearningGoalsState } from "../../types/learning";
import { initialLearningGoals } from "../../constants/learning/learning-goal";

export const useLearningGoalStore: UseBoundStore<StoreApi<LearningGoalsState>> =
  create<LearningGoalsState>((set) => ({
    learningGoals: initialLearningGoals, // Set initial data
    // Action to add a new learning goal
    addGoal: (goal) =>
      set((state) => ({
        learningGoals: [...state.learningGoals, goal],
      })),

    // Action to update an existing learning goal by category
    updateGoal: (category, updatedFields) =>
      set((state) => ({
        learningGoals: state.learningGoals.map((goal) =>
          goal.category === category ? { ...goal, ...updatedFields } : goal
        ),
      })),

    // Action to completely replace the learning goals array
    setGoals: (goals) => set({ learningGoals: goals }),

    // Action to reset goals to their initial state
    resetGoals: () => set({ learningGoals: initialLearningGoals }),
  }));
