import { create, type StoreApi, type UseBoundStore } from "zustand";
import type { LearningGoalsState } from "../../types/learning";
import { initialLearningGoals } from "../../constants/learning/learning-goal";

export const useLearningGoalStore: UseBoundStore<StoreApi<LearningGoalsState>> =
  create<LearningGoalsState>((set) => ({
    // Initialize the store with an array of learning goals
    learningGoals: initialLearningGoals,

    addLearningGoal: (goal) =>
      set((state) => ({
        learningGoals: [...state.learningGoals, goal],
      })),

    updateLearningGoal: (category, updatedFields) =>
      set((state) => ({
        learningGoals: state.learningGoals.map((goal) =>
          goal.category === category ? { ...goal, ...updatedFields } : goal
        ),
      })),

    setLearningGoals: (goals) => set({ learningGoals: goals }),

    resetLearningGoals: () => set({ learningGoals: initialLearningGoals }),
  }));
