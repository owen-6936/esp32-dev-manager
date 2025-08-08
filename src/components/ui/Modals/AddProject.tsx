import { useState } from "react";
import { useProjectStore } from "../../../store/project/project";
import type { Project } from "../../../types/project/project";
import { useFormValidator } from "../../../hooks/useFormValidator";

export default function AddProject({
  setShowAddProject,
}: {
  setShowAddProject: (show: boolean) => void;
}) {
  const initialProject: Partial<Project> = {
    title: "",
    description: "",
    status: "planning",
    difficulty: "beginner",
    category: ["sensors"],
    components: [],
    progress: 0,
    timeSpent: 0,
    estimatedTime: 0,
    budget: 0,
    actualCost: 0,
    note: "",
    powerConsumption: 0,
  };

  const [newProject, setNewProject] =
    useState<Partial<Project>>(initialProject);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addProject = useProjectStore((state) => state.addProject);

  const { errors, validate, validateSingleField } = useFormValidator({
    title: { required: true, minLength: 3 },
    description: { required: true, minLength: 10 },
    estimatedTime: { required: false },
    budget: { required: false },
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    const isValid = validate({
      title: newProject.title?.trim() || "",
      description: newProject.description?.trim() || "",
      estimatedTime: String(newProject.estimatedTime ?? ""),
      budget: String(newProject.budget ?? ""),
    });

    if (isValid) {
      const fullProject: Project = {
        ...newProject,
        id: Date.now().toString(),
      } as Project;

      addProject(fullProject);
      setShowAddProject(false);
      setNewProject(initialProject);
    }

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setShowAddProject(false);
    setNewProject(initialProject);
  };

  const handleBlur = (field: string, value: string | number) => {
    validateSingleField(field, String(value).trim());
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 bg-white/10 border ${
      errors[field] ? "border-red-500" : "border-white/20"
    } rounded-lg text-white placeholder-blue-200`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-white mb-4">Add New Project</h3>
        <div className="space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Project Title"
              value={newProject.title || ""}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              onBlur={(e) => handleBlur("title", e.target.value)}
              className={inputClass("title")}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <textarea
              placeholder="Project Description"
              value={newProject.description || ""}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              onBlur={(e) => handleBlur("description", e.target.value)}
              className={`h-24 ${inputClass("description")}`}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Note */}
          <input
            type="text"
            placeholder="Project Note"
            value={newProject.note || ""}
            onChange={(e) =>
              setNewProject({ ...newProject, note: e.target.value })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
          />

          {/* Difficulty & Category */}
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newProject.difficulty || "beginner"}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  difficulty: e.target.value as Project["difficulty"],
                })
              }
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select
              value={newProject.status || "planning"}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  status: e.target.value as Project["status"],
                })
              }
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          {/* Status & Components */}
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newProject.category || ["sensors"]}
              multiple
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  category: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ) as Project["category"],
                })
              }
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="embedded_systems">Embedded Systems</option>
              <option value="iot">IoT</option>
              <option value="robotics">Robotics</option>
              <option value="web_development">Web Development</option>
              <option value="mobile_development">Mobile Development</option>
              <option value="data_processing">Data Processing</option>
              <option value="sensors">Sensors</option>
              <option value="connectivity">Connectivity</option>
              <option value="power_supply">Power Supply</option>
              <option value="actuators">Actuators</option>
              <option value="display">Display</option>
              <option value="automation">Automation</option>
              <option value="other">Other</option>
            </select>
            <select
              value={
                newProject.components?.length
                  ? "has-components"
                  : "no-components"
              }
              multiple
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  components: e.target.value === "has-components" ? [] : [],
                })
              }
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="no-components">No Components</option>
            </select>
          </div>
          {/* Estimated Time & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                placeholder="Estimated Time (hours)"
                value={newProject.estimatedTime || ""}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    estimatedTime: parseFloat(e.target.value) || 0,
                  })
                }
                onBlur={(e) =>
                  handleBlur("estimatedTime", parseFloat(e.target.value))
                }
                className={inputClass("estimatedTime")}
              />
              {errors.estimatedTime && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.estimatedTime}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                placeholder="Budget ($)"
                value={newProject.budget || ""}
                onChange={(e) =>
                  setNewProject({
                    ...newProject,
                    budget: parseFloat(e.target.value) || 0,
                  })
                }
                onBlur={(e) => handleBlur("budget", parseFloat(e.target.value))}
                className={inputClass("budget")}
              />
              {errors.budget && (
                <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Deadline */}
            <label className="text-white text-sm mb-2">
              Start Date (optional):
              <input
                type="date"
                placeholder="Start Date"
                value={newProject.startDate || ""}
                onChange={(e) =>
                  setNewProject({ ...newProject, startDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </label>
            <label className="text-white text-sm mb-2">
              Deadline (optional):
              <input
                type="date"
                placeholder="Deadline"
                value={newProject.deadline || ""}
                onChange={(e) =>
                  setNewProject({ ...newProject, deadline: e.target.value })
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 text-white py-2 rounded-lg transition-all ${
              isSubmitting
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Project"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
