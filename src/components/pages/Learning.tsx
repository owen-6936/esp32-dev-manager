import { Target, Wifi } from "lucide-react";
import { useLearningStore } from "../../store/learning/learning";

export default function Learning() {
  const { learningMetrics } = useLearningStore();

  return (
    <div className="space-y-6 min-h-full sm:min-h-screen p-6">
      <h2 className="text-3xl font-bold text-white">Learning Progress</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">
            Skill Development
          </h3>
          <div className="space-y-4">
            {learningMetrics.map((metric, index) => {
              const percentage = (metric.completed / metric.total) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {metric.category}
                    </span>
                    <span className="text-blue-200 text-sm">
                      {metric.completed}/{metric.total}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`${metric.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Learning Goals</h3>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <Target className="w-5 h-5 text-blue-400" />
                <h4 className="text-white font-semibold">
                  Master GPIO Control
                </h4>
              </div>
              <p className="text-blue-200 text-sm mb-3">
                Learn digital and analog I/O operations
              </p>
              <div className="w-full bg-white/10 rounded-full h-1">
                <div className="bg-blue-500 h-1 rounded-full w-4/5"></div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <Wifi className="w-5 h-5 text-green-400" />
                <h4 className="text-white font-semibold">
                  Network Programming
                </h4>
              </div>
              <p className="text-blue-200 text-sm mb-3">
                WiFi, HTTP, MQTT protocols
              </p>
              <div className="w-full bg-white/10 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full w-3/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
