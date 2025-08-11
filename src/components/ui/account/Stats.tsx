import {
  Award,
  CheckCircle,
  Clock,
  Code,
  Package,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { StatProps } from "../../../types/account/stats";

export default function Stats({
  totalProjects,
  completedProjects,
  totalComponents,
  timeSpent,
  streakDays,
  achievements,
}: StatProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Your Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Projects</p>
              <p className="text-3xl font-bold text-white">{totalProjects}</p>
              <p className="text-green-400 text-xs flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {completedProjects} completed
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Code className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Components</p>
              <p className="text-3xl font-bold text-white">{totalComponents}</p>
              <p className="text-blue-400 text-xs flex items-center mt-1">
                <Package className="w-3 h-3 mr-1" />
                Inventory managed
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Package className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm">Time Invested</p>
              <p className="text-3xl font-bold text-white">{timeSpent}h</p>
              <p className="text-purple-400 text-xs flex items-center mt-1">
                <Clock className="w-3 h-3 mr-1" />
                Development time
              </p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 text-sm">Current Streak</p>
              <p className="text-3xl font-bold text-white">{streakDays}</p>
              <p className="text-green-400 text-xs flex items-center mt-1">
                <Zap className="w-3 h-3 mr-1" />
                Days active
              </p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Achievements</p>
              <p className="text-3xl font-bold text-white">{achievements}</p>
              <p className="text-blue-400 text-xs flex items-center mt-1">
                <Award className="w-3 h-3 mr-1" />
                Unlocked badges
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-200 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold text-white">
                {Math.round((completedProjects / totalProjects) * 100)}%
              </p>
              <p className="text-green-400 text-xs flex items-center mt-1">
                <CheckCircle className="w-3 h-3 mr-1" />
                Success rate
              </p>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Target className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
