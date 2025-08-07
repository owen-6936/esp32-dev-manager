import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProjectStore } from "../../../store/project/project";
import type { Project } from "../../../types/project/project";

// Zod schema for validation
const ProjectFormSchema = z.object({
  title: z
    .string()
    .min(1, "Project title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Project description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .trim(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  category: z.enum([
    "sensors",
    "connectivity",
    "display",
    "automation",
    "other",
  ]),
  estimatedTime: z
    .number("Estimated time is required")
    .positive("Estimated time must be greater than 0")
    .max(10000, "Estimated time seems unrealistic (max 10,000 hours)")
    .optional(),
  budget: z
    .number("Must be a valid number")
    .nonnegative("Budget cannot be negative")
    .max(1000000, "Budget seems unrealistic (max $1,000,000)")
    .optional(),
  deadline: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const deadlineDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return deadlineDate >= today;
      },
      {
        message: "Deadline cannot be in the past",
      }
    ),
});

// Infer TypeScript type from Zod schema
type ProjectFormData = z.infer<typeof ProjectFormSchema>;

export default function AddProject({
  setShowAddProject,
}: {
  setShowAddProject: (show: boolean) => void;
}) {
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(ProjectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "beginner",
      category: "sensors",
      deadline: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  // Function to add the new project to the store
  const addProject = useProjectStore((state) => state.addProject);

  // Watch description for character count
  const description = watch("description");

  // Handle form submission
  const onSubmit = async (data: ProjectFormData) => {
    try {
      // Transform form data to match Project type
      const projectData: Project = {
        id: Date.now().toString(), // Generate temporary ID
        ...data,
        status: "planning",
        components: [],
        progress: 0,
        timeSpent: 0,
        actualCost: 0,
        notes: "",
        powerConsumption: 0,
        startDate: new Date().toISOString(),
        codeSnippets: [],
        pinConfig: [],
        photos: [],
      };

      addProject(projectData);
      setShowAddProject(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  // Helper function to get input classes based on error state
  const getInputClasses = (
    fieldName: keyof ProjectFormData,
    baseClasses: string
  ) => {
    const hasError = errors[fieldName];
    const errorClasses = hasError
      ? "border-red-400 bg-red-500/10"
      : "border-white/20 bg-white/10";
    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">Add New Project</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <div>
            <input
              type="text"
              placeholder="Project Title *"
              {...register("title")}
              className={getInputClasses(
                "title",
                "w-full px-3 py-2 border rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <textarea
              placeholder="Project Description *"
              {...register("description")}
              className={getInputClasses(
                "description",
                "w-full px-3 py-2 border rounded-lg text-white placeholder-blue-200 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {(description || "").length}/500 characters
            </p>
          </div>

          {/* Difficulty and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <select
                {...register("difficulty")}
                className={getInputClasses(
                  "difficulty",
                  "px-3 py-2 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.difficulty && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.difficulty.message}
                </p>
              )}
            </div>
            <div>
              <select
                {...register("category")}
                className={getInputClasses(
                  "category",
                  "px-3 py-2 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
              >
                <option value="sensors">Sensors</option>
                <option value="connectivity">Connectivity</option>
                <option value="display">Display</option>
                <option value="automation">Automation</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Estimated Time and Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                placeholder="Estimated Time (hours) *"
                {...register("estimatedTime", {
                  valueAsNumber: true,
                  setValueAs: (value) => (value === "" ? 0 : Number(value)),
                })}
                min="0"
                step="0.5"
                className={getInputClasses(
                  "estimatedTime",
                  "px-3 py-2 border rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
              />
              {errors.estimatedTime && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.estimatedTime.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                placeholder="Budget ($)"
                {...register("budget", {
                  valueAsNumber: true,
                  setValueAs: (value) => (value === "" ? 0 : Number(value)),
                })}
                min="0"
                step="0.01"
                className={getInputClasses(
                  "budget",
                  "px-3 py-2 border rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                )}
              />
              {errors.budget && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.budget.message}
                </p>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <input
              type="date"
              placeholder="Deadline"
              {...register("deadline")}
              className={getInputClasses(
                "deadline",
                "w-full px-3 py-2 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              )}
            />
            {errors.deadline && (
              <p className="text-red-400 text-sm mt-1">
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isSubmitting ? "Adding..." : "Add Project"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddProject(false)}
              disabled={isSubmitting}
              className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
