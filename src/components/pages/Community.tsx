import { Activity, Download, Github } from "lucide-react";
import { useSharedProjectStore } from "../../store/project/sharedproject";
import emptyStateAnimation from "../../assets/lottie/empty-state.json";
import Lottie from "lottie-react";

export default function Community() {
  const sharedProjects = useSharedProjectStore((state) => state.sharedProjects);
  return (
    <div className="space-y-6 min-h-screen p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">
        Community Projects
      </h2>
      {sharedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-blue-200 p-12 bg-white/5 rounded-xl border border-white/10">
          <Lottie
            animationData={emptyStateAnimation}
            className="w-60 aspect-square"
            loop
            autoplay
          />
          <h3 className="text-white text-xl sm:text-2xl font-semibold mt-4">
            No Projects Yet
          </h3>
          <p className="text-blue-200 text-sm sm:text-base mt-2">
            There's currently no community projects available. Check back later
            or contribute your own!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sharedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-red-400 text-sm flex items-center">
                    <Activity className="w-4 h-4 mr-1" />
                    {project.likes}
                  </span>
                </div>
              </div>

              <p className="text-blue-200 text-sm mb-2">by {project.author}</p>
              <p className="text-blue-200 mb-4">{project.description}</p>

              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    project.difficulty === "beginner"
                      ? "bg-green-500/20 text-green-300"
                      : project.difficulty === "intermediate"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {project.difficulty}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-blue-200 text-sm mb-2">Components:</p>
                <div className="flex flex-wrap gap-1">
                  {project.components.map((component, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs"
                    >
                      {component}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-500/20 text-blue-200 py-2 rounded-lg hover:bg-blue-500/30 transition-all flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Fork Project</span>
                </button>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    className="bg-gray-500/20 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-500/30 transition-all flex items-center"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
