import { X } from "lucide-react";
import useProjectStore from "../../../store/project";
import { esp32s3Pins } from "../../../constants/esp32s3-pins";

export default function PinMapper({
    setShowPinMapper,
    selectedProject,
}: {
    setShowPinMapper: (show: boolean) => void;
    selectedProject?: string | null;
}) {
    const projects = useProjectStore((state) => state.projects);

    // Find the selected project to get its pin assignments
    const currentProject = selectedProject
        ? projects.find((project) => project.id === selectedProject)
        : null;

    // Create a Set of assigned pin numbers for efficient lookup
    const assignedPins = new Set(
        (currentProject?.pinConfig || []).map((config) => config.pin),
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-4xl border border-white/20 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                        ESP32 S3 Pin Mapper
                    </h3>
                    <button
                        onClick={() => setShowPinMapper(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pin Grid */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Pin Configuration
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {esp32s3Pins.map((pin) => {
                                const isAssigned = assignedPins.has(
                                    pin.pinNumber,
                                );
                                const colorClass = isAssigned
                                    ? "bg-red-900"
                                    : "bg-white/10";
                                const textClass = isAssigned
                                    ? "text-red-300"
                                    : "text-blue-200";
                                const statusText = isAssigned
                                    ? "Assigned"
                                    : "Available";

                                return (
                                    <div
                                        key={pin.pinNumber}
                                        className={`${colorClass} rounded p-2 text-center transition-colors duration-200`}
                                    >
                                        <div className="text-white text-sm font-bold">
                                            GPIO{pin.pinNumber}
                                        </div>
                                        <div
                                            className={`${textClass} text-xs mt-1`}
                                        >
                                            {statusText}
                                        </div>
                                        <div className="text-gray-400 text-xs mt-1">
                                            ({pin.function})
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Pin Assignments */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Current Assignments
                        </h4>
                        <div className="space-y-2">
                            {currentProject?.pinConfig?.length ? (
                                currentProject.pinConfig.map(
                                    (config, index) => (
                                        <div
                                            key={index}
                                            className="bg-white/5 rounded-lg p-3 flex items-center justify-between"
                                        >
                                            <div>
                                                <span className="text-white font-medium">
                                                    GPIO{config.pin}
                                                </span>
                                                <span className="text-blue-200 text-sm ml-2">
                                                    {config.function}
                                                </span>
                                            </div>
                                            <span className="text-green-400 text-sm">
                                                {config.component}
                                            </span>
                                        </div>
                                    ),
                                )
                            ) : (
                                <p className="text-blue-200 text-sm">
                                    No pin assignments yet. Select a project to
                                    view configurations.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
