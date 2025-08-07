import { X } from "lucide-react";
import { useProjectStore } from "../../../store/project/project";

export default function PowerCalculator({
  setShowPowerCalculator,
}: {
  setShowPowerCalculator: (show: boolean) => void;
}) {
  const projects = useProjectStore((state) => state.projects);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Power Consumption Calculator
          </h3>
          <button
            onClick={() => setShowPowerCalculator(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* ESP32 Base Consumption */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">
              ESP32 S3 Base Consumption
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">80mA</div>
                <div className="text-blue-200 text-sm">Active Mode</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">10µA</div>
                <div className="text-blue-200 text-sm">Deep Sleep</div>
              </div>
            </div>
          </div>

          {/* Project Power Analysis */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">
              Project Power Analysis
            </h4>
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-blue-200">{project.title}</span>
                  <span className="text-white">
                    {project.powerConsumption}mW
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-lg">
                <span className="text-white font-semibold">
                  Total Estimated:
                </span>
                <span className="text-green-400 font-bold">
                  {projects.reduce((acc, p) => acc + p.powerConsumption, 0)}mW
                </span>
              </div>
            </div>
          </div>

          {/* Battery Life Estimation */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">
              Battery Life Estimation
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-yellow-400">~12h</div>
                <div className="text-blue-200 text-sm">2000mAh Battery</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-400">~6h</div>
                <div className="text-blue-200 text-sm">1000mAh Battery</div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-400">~3h</div>
                <div className="text-blue-200 text-sm">500mAh Battery</div>
              </div>
            </div>
            <p className="text-blue-200 text-xs mt-3 text-center">
              *Estimates based on continuous operation without deep sleep
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
