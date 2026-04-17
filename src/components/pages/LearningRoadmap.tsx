import { useState } from "react";
import { motion } from "framer-motion";
import {
    Map, Clock, ChevronRight, Trophy, Zap, Star,
    Rocket, Lightbulb, Radar, Cog, Monitor, Wifi, Camera, Usb,
} from "lucide-react";
import GlassCard, { GlassCardHeader } from "../ui/glass/GlassCard";
import GlassBadge, { DifficultyBadge } from "../ui/glass/GlassBadge";
import type { LearningPath } from "../../types/tutorial";
import { useNavigate } from "react-router-dom";
import { useLearningPaths, useProjects } from "../../hooks/useTutorialData";
import useProgressStore from "../../store/progress";

const iconMap: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
    Rocket, Lightbulb, Radar, Cog, Monitor, Wifi, Camera, Usb, Trophy,
};

export default function LearningRoadmap() {
    const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
    const navigate = useNavigate();
    const { data: learningPaths } = useLearningPaths();
    const { data: freenoveProjects } = useProjects();
    const { completedProjects } = useProgressStore();

    const completed = completedProjects();
    const totalHours = learningPaths.reduce((sum, p) => sum + p.estimatedHours, 0);

    return (
        <div className="px-4 md:px-8 py-8 min-height-screen space-y-8">
            {/* ── Hero ─────────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg glow-md">
                            <Map className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                Learning Roadmap
                            </h1>
                            <p className="text-blue-200/60 text-sm mt-0.5">
                                Structured paths from beginner to expert
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <div className="glass flex items-center gap-2 px-4 py-2 rounded-xl">
                            <Map className="w-4 h-4 text-amber-400" />
                            <span className="text-white font-semibold">{learningPaths.length}</span>
                            <span className="text-blue-200/50 text-xs">Paths</span>
                        </div>
                        <div className="glass flex items-center gap-2 px-4 py-2 rounded-xl">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-white font-semibold">{totalHours}h</span>
                            <span className="text-blue-200/50 text-xs">Total</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Path Overview Grid ───────────────────────────────────── */}
            {!selectedPath && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {learningPaths.map((path, i) => {
                        const Icon = iconMap[path.icon] ?? Zap;
                        return (
                            <GlassCard
                                key={path.id}
                                variant="interactive"
                                index={i}
                                padding="p-6"
                                onClick={() => setSelectedPath(path)}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                        style={{
                                            backgroundColor: `${path.color}15`,
                                            border: `1px solid ${path.color}30`,
                                            boxShadow: `0 0 20px ${path.color}10`,
                                        }}
                                    >
                                        <Icon className="w-7 h-7" style={{ color: path.color }} />
                                    </div>
                                    <DifficultyBadge level={path.difficulty} />
                                </div>

                                <h3
                                    className="text-xl font-bold mb-1"
                                    style={{ color: path.color }}
                                >
                                    {path.name}
                                </h3>
                                <p className="text-blue-200/50 text-sm mb-5 line-clamp-2">
                                    {path.description}
                                </p>

                                {/* Stats */}
                                <div className="flex gap-4 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-white font-bold">{path.projects.length}</span>
                                        <span className="text-white/30 text-xs">Projects</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-white font-bold">{path.estimatedHours}h</span>
                                        <span className="text-white/30 text-xs">Duration</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-white font-bold">{path.skills.length}</span>
                                        <span className="text-white/30 text-xs">Skills</span>
                                    </div>
                                </div>

                                {/* Skills Preview */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {path.skills.slice(0, 3).map((skill) => (
                                        <GlassBadge key={skill} size="sm" color={path.color}>
                                            {skill}
                                        </GlassBadge>
                                    ))}
                                    {path.skills.length > 3 && (
                                        <GlassBadge size="sm">+{path.skills.length - 3}</GlassBadge>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="pt-3 border-t border-white/5">
                                    {(() => {
                                        const done = path.projects.filter((id) =>
                                            completed.includes(id),
                                        ).length;
                                        const pct = path.projects.length > 0
                                            ? Math.round((done / path.projects.length) * 100)
                                            : 0;
                                        return (
                                            <>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-xs text-white/30">Progress</span>
                                                    <span className="text-xs text-white/30">
                                                        {done}/{path.projects.length}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${pct}%`,
                                                            backgroundColor: path.color,
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}

            {/* ── Selected Path Detail ─────────────────────────────────── */}
            {selectedPath && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Path Header */}
                    <GlassCard variant="strong" padding="p-8">
                        <button
                            onClick={() => setSelectedPath(null)}
                            className="text-blue-300/60 hover:text-blue-300 text-sm flex items-center gap-1 mb-4 cursor-pointer"
                        >
                            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                            All Paths
                        </button>

                        <div className="flex items-center gap-4 mb-4">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{
                                    backgroundColor: `${selectedPath.color}15`,
                                    border: `1px solid ${selectedPath.color}30`,
                                }}
                            >
                                {(() => {
                                    const Icon = iconMap[selectedPath.icon] ?? Zap;
                                    return <Icon className="w-8 h-8" style={{ color: selectedPath.color }} />;
                                })()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{selectedPath.name}</h2>
                                <p className="text-blue-200/50">{selectedPath.description}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <GlassBadge size="md">
                                <Clock className="w-3.5 h-3.5" />
                                {selectedPath.estimatedHours} hours
                            </GlassBadge>
                            <DifficultyBadge level={selectedPath.difficulty} size="md" />
                            <GlassBadge size="md" color={selectedPath.color} variant="glow">
                                <Star className="w-3.5 h-3.5" />
                                {selectedPath.skills.length} skills
                            </GlassBadge>
                        </div>
                    </GlassCard>

                    {/* Skills to Learn */}
                    <GlassCard index={1}>
                        <GlassCardHeader title="Skills You'll Learn" icon={<Star className="w-5 h-5" />} />
                        <div className="flex flex-wrap gap-2">
                            {selectedPath.skills.map((skill) => (
                                <GlassBadge key={skill} size="md" color={selectedPath.color} variant="glow">
                                    {skill}
                                </GlassBadge>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Project Timeline */}
                    <GlassCard index={2}>
                        <GlassCardHeader
                            title="Project Sequence"
                            icon={<Map className="w-5 h-5" />}
                            subtitle={`${selectedPath.projects.length} projects in order`}
                        />
                        <div className="space-y-1">
                            {selectedPath.projects.map((projectId, i) => {
                                const project = freenoveProjects.find((p) => p.id === projectId);
                                if (!project) return null;
                                const isDone = completed.includes(projectId);

                                return (
                                    <div key={projectId} className="flex items-start gap-4">
                                        {/* Timeline Line */}
                                        <div className="flex flex-col items-center">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                                style={{
                                                    backgroundColor: isDone
                                                        ? `${selectedPath.color}30`
                                                        : `${selectedPath.color}20`,
                                                    color: isDone ? "#4ade80" : selectedPath.color,
                                                    border: `1px solid ${isDone ? "#4ade8060" : `${selectedPath.color}30`}`,
                                                }}
                                            >
                                                {isDone ? "✓" : i + 1}
                                            </div>
                                            {i < selectedPath.projects.length - 1 && (
                                                <div
                                                    className="w-0.5 h-12 my-1"
                                                    style={{ backgroundColor: `${selectedPath.color}15` }}
                                                />
                                            )}
                                        </div>

                                        {/* Project Card */}
                                        <div
                                            className="flex-1 glass-interactive rounded-xl px-4 py-3 mb-1 cursor-pointer"
                                            onClick={() => navigate(`/tutorials/${projectId}`)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-mono font-bold text-white/50">
                                                        {project.displayId}
                                                    </span>
                                                    <h4 className="text-white font-medium">{project.name}</h4>
                                                    <DifficultyBadge level={project.difficulty} showLabel={false} />
                                                </div>
                                                <div className="flex items-center gap-2 text-white/30 text-xs">
                                                    <Clock className="w-3 h-3" />
                                                    {project.timeEstimate}m
                                                    <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <p className="text-blue-200/40 text-sm mt-1 line-clamp-1">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>

                    {/* Prerequisites */}
                    {selectedPath.prerequisites.length > 0 && (
                        <GlassCard index={3}>
                            <GlassCardHeader title="Prerequisite Paths" />
                            <div className="flex flex-wrap gap-2">
                                {selectedPath.prerequisites.map((preId) => {
                                    const pre = learningPaths.find((p) => p.id === preId);
                                    if (!pre) return null;
                                    return (
                                        <button
                                            key={preId}
                                            onClick={() => setSelectedPath(pre)}
                                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2 transition-all cursor-pointer"
                                        >
                                            <span style={{ color: pre.color }} className="font-medium text-sm">
                                                {pre.name}
                                            </span>
                                            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                                        </button>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    )}
                </motion.div>
            )}
        </div>
    );
}
