import Deadline from "../ui/dashboard/Deadline";
import Hero from "../ui/dashboard/Hero";
import MicroControllerFeatures from "../ui/dashboard/MicroControllerFeatures";
import QuickActions from "../ui/dashboard/QuickActions";
import RecentActivity from "../ui/dashboard/RecentActivity";
import Stat from "../ui/dashboard/Stat";
import DailyTip from "../ui/dashboard/DailyTip";
import StreakWidget from "../ui/dashboard/StreakWidget";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Map, Cpu, Zap, ArrowRight, GraduationCap, Package, Cloud } from "lucide-react";
import GlassCard from "../ui/glass/GlassCard";
import { useProjects, useLearningPaths, useCategories, useKits } from "../../hooks/useTutorialData";
import useProjectStore from "../../store/project";
import useComponentStore from "../../store/component";

const LazyESP32Visual = lazy(() => import("../ui/dashboard/ESP32Visual"));

export default function Dashboard() {
    const { data: freenoveProjects } = useProjects();
    const { data: learningPaths } = useLearningPaths();
    const { data: tutorialCategories } = useCategories();
    const { data: kits } = useKits();
    // Total unique projects — always use actual fetched count, not kit metadata
    const cloudTotalProjects = freenoveProjects.length;
    const cloudTotalLabel = String(cloudTotalProjects);
    const projects = useProjectStore((s) => s.projects);
    const components = useComponentStore((s) => s.components);

    const realStats = {
        totalProjects: projects.length,
        completedProjects: projects.filter((p) => p.status === "completed").length,
        totalComponents: components.reduce((sum, c) => sum + c.quantity, 0),
        totalValue: components.reduce((sum, c) => sum + c.quantity * (c.unitPrice ?? 0), 0),
        timeSpent: projects.reduce((sum, p) => sum + (p.timeSpent ?? 0), 0),
        budgetUsed: projects.reduce((sum, p) => sum + (p.actualCost ?? 0), 0),
    };

    // Intersection observer for lazy mounting
    const [load3D, setLoad3D] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setLoad3D(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const featuredCategories = tutorialCategories.slice(0, 6);

    return (
        <main className="min-height-screen p-4 w-[90%] flex flex-col gap-8 sm:gap-12 mx-auto max-w-7xl">
            <Hero />
            <DailyTip />

            {/* ── Streak ──────────────────────────────────────────────── */}
            <div className="flex justify-end -mt-6">
                <StreakWidget />
            </div>

            {/* ── Freenove Tutorial Gateway ─────────────────────────── */}
            <section className="space-y-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <GlassCard variant="strong" index={0} padding="p-0">
                        <div className="relative overflow-hidden">
                            {/* Gradient accent bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-cyan-500" />

                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                            <GraduationCap className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                                Freenove ESP32-S3 Tutorials
                                            </h2>
                                            <p className="text-blue-200/50 text-sm">
                                                {cloudTotalLabel} projects &middot;{" "}
                                                {learningPaths.length} learning paths
                                                <span className="ml-2 inline-flex items-center gap-1 text-blue-300/60 text-xs bg-blue-500/10 border border-blue-500/20 rounded-full px-1.5 py-0.5">
                                                    <Cloud className="w-2.5 h-2.5" /> Cloud
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/learn"
                                        className="flex items-center gap-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-blue-500/20"
                                    >
                                        Browse All
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Quick stats row */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                                    {[
                                        {
                                            label: "Total Tutorials",
                                            value: cloudTotalLabel,
                                            icon: BookOpen,
                                            color: "#3b82f6",
                                            cloud: true,
                                        },
                                        {
                                            label: "Learning Paths",
                                            value: learningPaths.length,
                                            icon: Map,
                                            color: "#8b5cf6",
                                        },
                                        {
                                            label: "Categories",
                                            value: tutorialCategories.length,
                                            icon: Cpu,
                                            color: "#06b6d4",
                                        },
                                        {
                                            label: "Difficulty Levels",
                                            value: 5,
                                            icon: Zap,
                                            color: "#f59e0b",
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="bg-white/5 rounded-xl p-3 border border-white/5"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <item.icon
                                                    className="w-4 h-4"
                                                    style={{ color: item.color }}
                                                />
                                                <span className="text-white/40 text-xs">
                                                    {item.label}
                                                </span>
                                                {"cloud" in item && item.cloud && (
                                                    <span className="ml-auto flex items-center gap-0.5 text-blue-300/60 text-[10px] bg-blue-500/10 border border-blue-500/20 rounded-full px-1.5 py-0.5">
                                                        <Cloud className="w-2.5 h-2.5" />
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-2xl font-bold text-white">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Category pills */}
                                <div className="flex flex-wrap gap-2">
                                    {featuredCategories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            to="/learn"
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
                                            style={{
                                                backgroundColor: `${cat.color}15`,
                                                color: cat.color,
                                                border: `1px solid ${cat.color}25`,
                                            }}
                                        >
                                            <span>{cat.icon}</span>
                                            {cat.name}
                                        </Link>
                                    ))}
                                    <Link
                                        to="/learn"
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-white/40 border border-white/8 hover:bg-white/10 transition-all"
                                    >
                                        +{tutorialCategories.length - 6} more
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Quick nav cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/learn">
                        <GlassCard variant="interactive" index={1} padding="p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/20">
                                    <BookOpen className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold">Tutorial Browser</h3>
                                    <p className="text-white/40 text-sm">
                                        Browse {cloudTotalLabel} projects from Freenove
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-white/20" />
                            </div>
                        </GlassCard>
                    </Link>
                    <Link to="/learn">
                        <GlassCard variant="interactive" index={2} padding="p-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
                                    <Map className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold">Learning Roadmap</h3>
                                    <p className="text-white/40 text-sm">
                                        {learningPaths.length} curated paths from beginner to expert
                                    </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-white/20" />
                            </div>
                        </GlassCard>
                    </Link>
                </div>

                {/* Kit Sources */}
                {kits.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-white/80 text-sm font-semibold">Freenove Kit Sources</h3>
                                <p className="text-white/30 text-xs">ESP32-S3 tutorial data from Freenove kits</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {kits.map((kit) => {
                                const tierColors: Record<string, string> = {
                                    ultimate: "#8b5cf6",
                                    super: "#3b82f6",
                                    basic: "#22c55e",
                                };
                                const color = tierColors[kit.tier] ?? "#6b7280";
                                return (
                                    <div
                                        key={kit.sku}
                                        className="bg-white/5 border border-white/8 rounded-xl p-4 hover:bg-white/8 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div
                                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                                style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
                                            >
                                                <Package className="w-4 h-4" style={{ color }} />
                                            </div>
                                            <span className="flex items-center gap-1 text-xs text-blue-300/70 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">
                                                <Cloud className="w-3 h-3" />
                                                Cloud
                                            </span>
                                        </div>
                                        <p className="text-white text-sm font-medium leading-snug line-clamp-2 mb-1.5">
                                            {kit.name}
                                        </p>
                                        <p className="text-white/30 text-xs font-mono">
                                            {kit.sku} &middot; {kit.projectCount} projects
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </section>

            {/* ESP32 3D Viewer Lazy Section */}
            <div
                ref={ref}
                className="min-h-100 flex items-center justify-center"
            >
                {load3D ? (
                    <Suspense
                        fallback={
                            <div className="text-center text-blue-300 animate-pulse">
                                Loading ESP32 3D Model...
                            </div>
                        }
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full"
                        >
                            <LazyESP32Visual />
                        </motion.div>
                    </Suspense>
                ) : (
                    <div className="text-center text-blue-300 animate-pulse">
                        Preparing 3D Viewer...
                    </div>
                )}
            </div>
            <Stat
                budgetUsed={realStats.budgetUsed}
                totalProjects={realStats.totalProjects}
                completedProjects={realStats.completedProjects}
                totalComponents={realStats.totalComponents}
                totalValue={realStats.totalValue}
                timeSpent={realStats.timeSpent}
            />

            {/* ── New-user onboarding CTA ───────────────────────────── */}
            {projects.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-linear-to-br from-blue-600/10 via-purple-600/5 to-cyan-600/10 p-8 text-center">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl" />
                        </div>
                        <div className="relative">
                            <div className="text-5xl mb-4">🛠️</div>
                            <h3 className="text-white text-xl font-bold mb-2">
                                Start your first project
                            </h3>
                            <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
                                Track your ESP32 builds, log progress, and level up your embedded skills — all in one place.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link
                                    to="/learn"
                                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-blue-500/25"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Browse Tutorials
                                </Link>
                                <Link
                                    to="/workshop"
                                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 px-5 py-2.5 rounded-xl font-medium text-sm transition-colors border border-white/10"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                    Go to Workshop
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <QuickActions />
            <RecentActivity />
            <Deadline projects={projects} />
            <MicroControllerFeatures />
        </main>
    );
}
