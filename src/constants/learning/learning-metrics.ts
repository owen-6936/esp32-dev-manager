import type { LearningMetric } from "../../types/learning";

export const initialLearningMetrics: LearningMetric[] = [
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
