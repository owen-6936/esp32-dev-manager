import { activityData } from "../../../constants/activity-data";

export default function Activity() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Recent Activity</h2>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
        <div className="p-6">
          <div className="space-y-4">
            {activityData.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    activity.type === "project"
                      ? "bg-blue-400"
                      : activity.type === "component"
                      ? "bg-green-400"
                      : activity.type === "code"
                      ? "bg-purple-400"
                      : activity.type === "achievement"
                      ? "bg-yellow-400"
                      : "bg-gray-400"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-white">{activity.description}</p>
                  <p className="text-blue-200 text-sm">
                    {new Date(activity.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs capitalize ${
                    activity.type === "project"
                      ? "bg-blue-500/20 text-blue-300"
                      : activity.type === "component"
                      ? "bg-green-500/20 text-green-300"
                      : activity.type === "code"
                      ? "bg-purple-500/20 text-purple-300"
                      : activity.type === "achievement"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-gray-500/20 text-gray-300"
                  }`}
                >
                  {activity.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
