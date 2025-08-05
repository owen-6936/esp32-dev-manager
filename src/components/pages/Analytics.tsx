import { useProjectStore } from "../../store/project/project";

export default function Analytics() {
  const projects = useProjectStore((state) => state.projects);
  const stats = {
    budgetUsed: projects.reduce((acc, p) => acc + p.budget, 0),
    timeSpent: projects.reduce((acc, p) => acc + p.timeSpent, 0),
  };
  return (
    <div className="space-y-6 min-h-full sm:min-h-screen p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">
        Project Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Project Status</h3>
          <div className="space-y-3">
            {["completed", "in-progress", "planning", "on-hold"].map(
              (status) => {
                const count = projects.filter(
                  (p) => p.status === status
                ).length;
                const percentage =
                  projects.length > 0 ? (count / projects.length) * 100 : 0;
                return (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <span className="text-blue-200 capitalize">
                      {status.replace("-", " ")}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-white/10 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            status === "completed"
                              ? "bg-green-500"
                              : status === "in-progress"
                              ? "bg-blue-500"
                              : status === "planning"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-white text-sm w-8">{count}</span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">
            Time vs Budget Analysis
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {(
                  (stats.budgetUsed /
                    (projects.reduce((acc, p) => acc + p.budget, 0) || 1)) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-blue-200 text-sm">Budget Efficiency</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {(
                  (stats.timeSpent /
                    (projects.reduce((acc, p) => acc + p.estimatedTime, 0) ||
                      1)) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-blue-200 text-sm">Time Efficiency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
