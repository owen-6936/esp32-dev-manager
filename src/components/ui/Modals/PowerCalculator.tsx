import { X } from "lucide-react";
import useProjectStore from "../../../store/project";
import useKitStore from "../../../store/kit";
import useComponentStore from "../../../store/component";
import { useProjects, useKits } from "../../../hooks/useTutorialData";
import { useMemo } from "react";

/** Known typical power draws in mW for common component categories */
const COMPONENT_POWER_MAP: Record<string, number> = {
    led: 30,       // ~10mA @ 3V
    display: 100,  // typical OLED/LCD
    motor: 500,    // small DC motor
    camera: 200,   // OV2640 active
    sensor: 15,    // typical I2C sensor
    buzzer: 40,
    module: 50,    // WiFi/BT module overhead already in ESP32 base
    relay: 80,
};

const ESP32_BASE_MW = 264; // 80mA @ 3.3V active
const BATTERY_VOLTAGE = 3.7;

function batteryHours(capacityMah: number, totalMw: number): string {
    if (totalMw <= 0) return "∞";
    const hours = (capacityMah * BATTERY_VOLTAGE) / totalMw;
    if (hours >= 100) return ">100h";
    if (hours >= 10) return `~${Math.round(hours)}h`;
    return `~${hours.toFixed(1)}h`;
}

export default function PowerCalculator({
    setShowPowerCalculator,
}: {
    setShowPowerCalculator: (show: boolean) => void;
}) {
    const projects = useProjectStore((state) => state.projects);
    const { ownedSkus } = useKitStore();
    const userComponents = useComponentStore((s) => s.components);
    const { data: tutorialProjects } = useProjects();
    const { data: kits } = useKits();

    /** Sum of user-project powerConsumption values that have been explicitly set */
    const projectPower = useMemo(
        () =>
            projects.reduce(
                (acc, p) =>
                    acc + (typeof p.powerConsumption === "number" ? p.powerConsumption : 0),
                0,
            ),
        [projects],
    );

    /** Estimate from kit components \u2014 sums typical draws for each component category in the inventory */
    const componentEstimateMw = useMemo(() => {
        // Collect all kit-derived component categories
        const ownedTiers = new Set(
            kits.filter((k) => ownedSkus.includes(k.sku)).map((k) => k.tier),
        );
        const kitComponents = tutorialProjects
            .filter((p) => ownedTiers.has(p.kitTier))
            .flatMap((p) => p.components);

        // Deduplicate by name (just count each component type once)
        const seen = new Set<string>();
        let total = 0;
        for (const c of kitComponents) {
            if (!seen.has(c.name)) {
                seen.add(c.name);
                total += (COMPONENT_POWER_MAP[c.category] ?? 10) * Math.min(c.quantity, 4);
            }
        }
        // Also count user-added components
        for (const c of userComponents) {
            if (!seen.has(c.name)) {
                seen.add(c.name);
                const catKey = c.category.replace("power_supply", "module");
                total += (COMPONENT_POWER_MAP[catKey] ?? 10);
            }
        }
        return total;
    }, [kits, ownedSkus, tutorialProjects, userComponents]);

    /** Total estimated power = ESP32 base + sum of project fields (if any set) or component estimate */
    const totalMw = ESP32_BASE_MW + (projectPower > 0 ? projectPower : componentEstimateMw);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
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
                                <div className="text-2xl font-bold text-blue-400">
                                    80mA
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Active Mode (~{ESP32_BASE_MW}mW)
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">
                                    10µA
                                </div>
                                <div className="text-blue-200 text-sm">
                                    Deep Sleep
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Power Analysis */}
                    <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-3">
                            Project Power (user-defined)
                        </h4>
                        {projects.length === 0 ? (
                            <p className="text-blue-200/50 text-sm">No projects yet</p>
                        ) : (
                            <div className="space-y-2">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-blue-200 text-sm">
                                            {project.title}
                                        </span>
                                        <span className="text-white text-sm">
                                            {typeof project.powerConsumption === "number"
                                                ? `${project.powerConsumption}mW`
                                                : <span className="text-white/40">Not set</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {projectPower === 0 && (
                            <p className="text-blue-200/50 text-xs mt-2">
                                No power values set — using component-based estimate ({componentEstimateMw}mW)
                            </p>
                        )}
                        <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-center justify-between text-lg">
                                <span className="text-white font-semibold">
                                    Total Estimated:
                                </span>
                                <span className="text-green-400 font-bold">
                                    {totalMw}mW
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
                                <div className="text-xl font-bold text-yellow-400">
                                    {batteryHours(2000, totalMw)}
                                </div>
                                <div className="text-blue-200 text-sm">
                                    2000mAh Battery
                                </div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-orange-400">
                                    {batteryHours(1000, totalMw)}
                                </div>
                                <div className="text-blue-200 text-sm">
                                    1000mAh Battery
                                </div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-red-400">
                                    {batteryHours(500, totalMw)}
                                </div>
                                <div className="text-blue-200 text-sm">
                                    500mAh Battery
                                </div>
                            </div>
                        </div>
                        <p className="text-blue-200 text-xs mt-3 text-center">
                            *Continuous operation, includes ESP32-S3 base ({ESP32_BASE_MW}mW) + components
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
