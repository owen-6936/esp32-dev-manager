import { Code, Edit3, Github, Plus } from "lucide-react";
import Button from "../Button";
import emptyAnimation from "../../assets/lottie/empty-state.json";
import type { Project } from "../../types/project";
import { getDifficultyColor, getStatusColor } from "../../utils/utils";
import EmptyState from "../EmptyState";

export default function Project() {
  const projects: Project[] = [];
  return (
    <div className="space-y-6 min-height p-6">
      <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-4 sm:justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          My Projects
        </h2>
        <div className="flex space-x-2">
          <Button variant="gradient">
            <Code className="w-5 h-5" />
            <span>Code Snippet</span>
          </Button>
          <Button variant="gradient">
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <EmptyState
          title="No Projects Yet"
          mediaType="lottie"
          media={emptyAnimation}
          message="Start by adding your first project to get started!"
        >
          <Button variant="gradient">
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {project.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-xs border ${getStatusColor(
                    project.status
                  )}`}
                >
                  {project.status.replace("-", " ")}
                </span>
              </div>

              <p className="text-blue-200 text-sm mb-4">
                {project.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Progress:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-white/10 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">
                      {project.progress}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Time Spent:</span>
                  <span className="text-white text-sm">
                    {project.timeSpent}h / {project.estimatedTime}h
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Budget:</span>
                  <span className="text-white text-sm">
                    ${project.actualCost} / ${project.budget}
                  </span>
                </div>
              </div>

              {project.components.length > 0 && (
                <div className="mt-4">
                  <p className="text-blue-200 text-sm mb-2">Components:</p>
                  <div className="flex flex-wrap gap-1">
                    {project.components.slice(0, 3).map((component, index) => (
                      <span
                        key={index}
                        className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs"
                      >
                        {component.name}
                      </span>
                    ))}
                    {project.components.length > 3 && (
                      <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs">
                        +{project.components.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getDifficultyColor(
                      project.difficulty
                    )}`}
                  ></div>
                  <span className="text-blue-200 text-xs capitalize">
                    {project.difficulty}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  <Button className="text-green-400 hover:text-green-300">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
