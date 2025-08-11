import { CheckCircle } from "lucide-react";
import { achievements } from "../../../constants/achievements";
import { getRarityColor } from "../../../utils/general-utils";

export default function Achievements() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((a) => (
          <div
            key={a.id}
            className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border ${
              a.earned
                ? "border-white/20 hover:bg-white/15"
                : "border-white/10 opacity-60"
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${getRarityColor(a.rarity)}`}>
                <a.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-bold text-white">{a.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs capitalize ${getRarityColor(
                      a.rarity
                    )}`}
                  >
                    {a.rarity}
                  </span>
                </div>
                <p className="text-blue-200 text-sm mb-3">{a.description}</p>
                {a.earned ? (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">
                      Earned on{" "}
                      {a.date
                        ? new Date(a.date).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                  </div>
                ) : a.progress ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-200">Progress</span>
                      <span className="text-white">
                        {a.progress} / {a.total}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(a.progress / a.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Not started</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
