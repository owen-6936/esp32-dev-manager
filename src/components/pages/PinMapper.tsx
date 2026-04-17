import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Circle, BookOpen, FolderOpen } from "lucide-react";
import { esp32s3Pins, PinFunction } from "../../constants/esp32s3-pins";
import useProjectStore from "../../store/project";
import type { PinConfig } from "../../types/pin-config";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../hooks/useTutorialData";
import GlassCard, { GlassCardHeader } from "../ui/glass/GlassCard";

type PinFilter = "all" | "used" | "free" | "special";

interface PinUsage extends PinConfig {
    projectTitle: string;
    projectId: string;
    linkedTutorialId?: string;
}

const PIN_FUNC_COLOR: Record<PinFunction, string> = {
    [PinFunction.GPIO_PIN]: "#3b82f6",
    [PinFunction.ADC_PIN]: "#f59e0b",
    [PinFunction.I2C_SDA_PIN]: "#8b5cf6",
    [PinFunction.I2C_SCL_PIN]: "#8b5cf6",
    [PinFunction.SPI_MOSI_PIN]: "#ec4899",
    [PinFunction.SPI_MISO_PIN]: "#ec4899",
    [PinFunction.SPI_SCK_PIN]: "#ec4899",
    [PinFunction.UART_RX_PIN]: "#22c55e",
    [PinFunction.UART_TX_PIN]: "#22c55e",
    [PinFunction.USB_JTAG_PIN]: "#06b6d4",
    [PinFunction.STRAPPING_PIN]: "#f97316",
};

const SPECIAL_FUNCS = new Set([PinFunction.STRAPPING_PIN, PinFunction.USB_JTAG_PIN]);

export default function PinMapper() {
    const [filter, setFilter] = useState<PinFilter>("all");
    const [selected, setSelected] = useState<number | null>(null);
    const navigate = useNavigate();

    const projects = useProjectStore((s) => s.projects);
    const { data: tutorials } = useProjects();

    // Build a map: pinNumber → PinUsage[]
    const pinUsageMap = useMemo(() => {
        const map = new Map<number, PinUsage[]>();
        for (const project of projects) {
            for (const pc of project.pinConfig ?? []) {
                const existing = map.get(pc.pin) ?? [];
                existing.push({
                    ...pc,
                    projectTitle: project.title,
                    projectId: project.id,
                    linkedTutorialId: project.linkedTutorialId,
                });
                map.set(pc.pin, existing);
            }
        }
        return map;
    }, [projects]);

    const usedPinCount = useMemo(() => pinUsageMap.size, [pinUsageMap]);
    const totalPins = esp32s3Pins.length;
    const freePins = totalPins - usedPinCount;

    const filteredPins = useMemo(() => {
        return esp32s3Pins.filter((p) => {
            const used = pinUsageMap.has(p.pinNumber);
            const special = SPECIAL_FUNCS.has(p.function);
            if (filter === "used") return used;
            if (filter === "free") return !used && !special;
            if (filter === "special") return special;
            return true;
        });
    }, [filter, pinUsageMap]);

    const selectedUsages = selected !== null ? (pinUsageMap.get(selected) ?? []) : [];
    const selectedPin = selected !== null ? esp32s3Pins.find((p) => p.pinNumber === selected) : null;

    const conflicted = useMemo(() => {
        const s = new Set<number>();
        pinUsageMap.forEach((usages, pin) => { if (usages.length > 1) s.add(pin); });
        return s;
    }, [pinUsageMap]);

    return (
        <div className="px-4 md:px-8 py-8 min-height-screen space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg glow-md">
                        <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Pin Mapper</h1>
                        <p className="text-blue-200/60 text-sm mt-0.5">ESP32-S3 GPIO allocation — synced with your workshop projects</p>
                    </div>
                </div>

                {/* Summary chips */}
                <div className="flex gap-3 flex-wrap">
                    {[
                        { label: "Total pins", value: totalPins, color: "#64748b" },
                        { label: "Used", value: usedPinCount, color: "#3b82f6" },
                        { label: "Free", value: freePins, color: "#22c55e" },
                        { label: "Conflicts", value: conflicted.size, color: "#ef4444" },
                    ].map((s) => (
                        <div key={s.label} className="glass flex items-center gap-2 px-4 py-2 rounded-xl">
                            <Circle className="w-2 h-2" style={{ color: s.color, fill: s.color }} />
                            <span className="text-white font-semibold">{s.value}</span>
                            <span className="text-blue-200/50 text-xs">{s.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Legend + filter */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                {/* Legend */}
                <div className="flex flex-wrap gap-3">
                    {[
                        { label: "GPIO", color: PIN_FUNC_COLOR[PinFunction.GPIO_PIN] },
                        { label: "ADC", color: PIN_FUNC_COLOR[PinFunction.ADC_PIN] },
                        { label: "I²C", color: PIN_FUNC_COLOR[PinFunction.I2C_SDA_PIN] },
                        { label: "SPI", color: PIN_FUNC_COLOR[PinFunction.SPI_MOSI_PIN] },
                        { label: "UART", color: PIN_FUNC_COLOR[PinFunction.UART_TX_PIN] },
                        { label: "USB", color: PIN_FUNC_COLOR[PinFunction.USB_JTAG_PIN] },
                        { label: "Boot pin", color: PIN_FUNC_COLOR[PinFunction.STRAPPING_PIN] },
                    ].map((l) => (
                        <span key={l.label} className="flex items-center gap-1.5 text-xs text-white/40">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
                            {l.label}
                        </span>
                    ))}
                </div>

                {/* Filter */}
                <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/8">
                    {(["all", "used", "free", "special"] as PinFilter[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize ${filter === f ? "bg-blue-500/30 text-blue-300" : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            {f === "special" ? "Boot/USB" : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pin Grid */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {filteredPins.map((pin) => {
                            const usages = pinUsageMap.get(pin.pinNumber);
                            const isUsed = !!usages;
                            const isConflict = conflicted.has(pin.pinNumber);
                            const isSpecial = SPECIAL_FUNCS.has(pin.function);
                            const isSelected = selected === pin.pinNumber;
                            const baseColor = PIN_FUNC_COLOR[pin.function];

                            return (
                                <motion.button
                                    key={pin.pinNumber}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setSelected(isSelected ? null : pin.pinNumber)}
                                    className={`relative flex flex-col items-center justify-center p-2 rounded-xl border text-center cursor-pointer transition-all ${isSelected
                                            ? "border-white/50 bg-white/15"
                                            : isConflict
                                                ? "border-red-500/50 bg-red-500/10"
                                                : isUsed
                                                    ? "border-opacity-40 bg-opacity-10"
                                                    : isSpecial
                                                        ? "border-orange-500/20 bg-orange-500/5 opacity-60"
                                                        : "border-white/8 bg-white/3 hover:bg-white/6"
                                        }`}
                                    style={isUsed && !isConflict ? {
                                        borderColor: `${baseColor}40`,
                                        backgroundColor: `${baseColor}12`,
                                    } : undefined}
                                >
                                    {/* Used indicator dot */}
                                    {isUsed && (
                                        <span
                                            className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${isConflict ? "bg-red-400" : ""}`}
                                            style={!isConflict ? { backgroundColor: baseColor } : undefined}
                                        />
                                    )}

                                    <span
                                        className="text-sm font-mono font-bold leading-none"
                                        style={{ color: isUsed ? baseColor : isSpecial ? "#f97316" : "rgba(255,255,255,0.35)" }}
                                    >
                                        {pin.pinNumber}
                                    </span>
                                    <span className="text-[9px] text-white/20 mt-0.5 leading-none truncate w-full">
                                        {pin.function.replace(/_PIN$/, "").replace(/_/g, " ")}
                                    </span>

                                    {/* Usage count badge */}
                                    {(usages?.length ?? 0) > 1 && usages && (
                                        <span className="text-[9px] text-red-300 font-bold mt-0.5">
                                            ×{usages.length}
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Detail Panel */}
                <div className="space-y-4">
                    {selected !== null && selectedPin ? (
                        <GlassCard variant="strong">
                            <GlassCardHeader
                                title={`GPIO ${selected}`}
                                icon={<Cpu className="w-5 h-5" style={{ color: PIN_FUNC_COLOR[selectedPin.function] }} />}
                            />
                            <div className="space-y-3">
                                <div className="bg-white/5 rounded-lg px-3 py-2 text-sm">
                                    <p className="text-white/40 text-xs mb-0.5">Function</p>
                                    <p className="text-white/80 font-medium">{selectedPin.function.replace(/_PIN$/, "").replace(/_/g, " ")}</p>
                                </div>
                                <div className="bg-white/5 rounded-lg px-3 py-2 text-sm">
                                    <p className="text-white/40 text-xs mb-0.5">Description</p>
                                    <p className="text-white/80">{selectedPin.description}</p>
                                </div>

                                {SPECIAL_FUNCS.has(selectedPin.function) && (
                                    <div className="bg-orange-500/8 border border-orange-500/20 rounded-lg px-3 py-2">
                                        <p className="text-orange-300/80 text-xs">⚠ This is a boot/USB pin — use with care. May affect programming or boot behaviour.</p>
                                    </div>
                                )}

                                {selectedUsages.length > 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-white/30 text-xs uppercase tracking-wider">Used by</p>
                                        {selectedUsages.map((u, i) => {
                                            const tutorial = tutorials.find((t) => t.id === u.linkedTutorialId);
                                            return (
                                                <div key={i} className="bg-white/5 border border-white/8 rounded-xl p-3 space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <FolderOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                        <span className="text-white/80 text-sm font-medium leading-snug">
                                                            {u.projectTitle}
                                                        </span>
                                                    </div>
                                                    <p className="text-white/40 text-xs ml-5">
                                                        {u.component} — {u.mode}
                                                    </p>
                                                    {tutorial && (
                                                        <button
                                                            onClick={() => navigate(`/tutorials/${tutorial.id}`)}
                                                            className="ml-5 flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs transition-colors cursor-pointer"
                                                        >
                                                            <BookOpen className="w-3 h-3" />
                                                            View tutorial: {tutorial.name}
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {selectedUsages.length > 1 && (
                                            <div className="bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-2">
                                                <p className="text-red-300/80 text-xs">
                                                    ⚡ Conflict: GPIO {selected} is assigned to {selectedUsages.length} projects simultaneously.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-white/25 text-sm text-center py-4">
                                        Pin is free — not assigned to any active workshop project.
                                    </p>
                                )}
                            </div>
                        </GlassCard>
                    ) : (
                        <GlassCard>
                            <div className="text-center py-8">
                                <Cpu className="w-10 h-10 mx-auto text-white/10 mb-3" />
                                <p className="text-white/30 text-sm">Tap any pin to see details</p>
                                {usedPinCount === 0 && (
                                    <p className="text-white/20 text-xs mt-2">
                                        Add projects from tutorials in the Learn tab to populate the mapper.
                                    </p>
                                )}
                            </div>
                        </GlassCard>
                    )}

                    {/* Projects using pins */}
                    {usedPinCount > 0 && (
                        <GlassCard>
                            <GlassCardHeader
                                title="Active Projects"
                                icon={<FolderOpen className="w-4 h-4" />}
                            />
                            <div className="space-y-2">
                                {projects
                                    .filter((p) => (p.pinConfig?.length ?? 0) > 0)
                                    .map((p) => {
                                        const pinCount = p.pinConfig?.length ?? 0;
                                        return (
                                            <div key={p.id} className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white/70 text-sm truncate font-medium">{p.title}</p>
                                                    <p className="text-white/30 text-xs">{pinCount} pin{pinCount !== 1 ? "s" : ""} allocated</p>
                                                </div>
                                                <span className="text-blue-400 text-xs font-mono">{pinCount}p</span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>
        </div>
    );
}
