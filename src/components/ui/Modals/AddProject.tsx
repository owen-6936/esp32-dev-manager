import { useState } from "react";
import { useProjectStore } from "../../../store/project/project";
import type { Project } from "../../../types/project/project";

export default function AddProject({
  setShowAddProject,
}: {
  setShowAddProject: (show: boolean) => void;
}) {
  // State to hold new project data
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: "",
    description: "",
    status: "planning",
    difficulty: "beginner",
    category: "sensors",
    components: [],
    progress: 0,
    timeSpent: 0,
    estimatedTime: 0,
    budget: 0,
    actualCost: 0,
    notes: "",
    powerConsumption: 0,
  });
  // Function to add the new project to the store
  const addProject = useProjectStore((state) => state.addProject);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">Add New Project</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Project Title"
            value={newProject.title || ""}
            onChange={(e) =>
              setNewProject({ ...newProject, title: e.target.value })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
          />
          <textarea
            placeholder="Project Description"
            value={newProject.description || ""}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 h-24"
          />
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
              value={newProject.category || "sensors"}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  category: e.target.value as Project["category"],
                })
              }
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="sensors">Sensors</option>
              <option value="connectivity">Connectivity</option>
              <option value="display">Display</option>
              <option value="automation">Automation</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
            />
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
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
            />
          </div>
          <input
            type="date"
            placeholder="Deadline"
            value={newProject.deadline || ""}
            onChange={(e) =>
              setNewProject({ ...newProject, deadline: e.target.value })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => addProject(newProject as Project)}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Add Project
          </button>
          <button
            onClick={() => setShowAddProject(false)}
            className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
