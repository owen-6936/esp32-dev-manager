import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, Grid3X3, List, BookOpen, Clock, Cpu, ChevronRight, Layers, Lock,
} from "lucide-react";
import GlassCard from "../ui/glass/GlassCard";
import GlassBadge, { DifficultyBadge } from "../ui/glass/GlassBadge";
import GlassInput from "../ui/glass/GlassInput";
import type { TutorialCategory, DifficultyLevel, KitTier } from "../../types/tutorial";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProjects, useCategories, useKits } from "../../hooks/useTutorialData";
import useKitStore from "../../store/kit";
import { kitColor, sortKitsByTier } from "../../utils/kitHelpers";

type ViewMode = "grid" | "list";

export default function TutorialBrowser() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<TutorialCategory | "all">("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 0>(0);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [selectedKitTier, setSelectedKitTier] = useState<KitTier | "all">("all");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { ownedSkus } = useKitStore();

    // Pick up ?search= set by AI navigation tools
    useEffect(() => {
        const q = searchParams.get("search");
        if (q) setSearch(q);
    }, [searchParams]);

    const { data: freenoveProjects } = useProjects();
    const { data: tutorialCategories } = useCategories();
    const { data: kits } = useKits();
    // Total unique projects — always use actual fetched count
    const cloudTotal = freenoveProjects.length;

    const ownedTierSet = useMemo<Set<string>>(() => {
        return new Set(
            kits.filter((k) => ownedSkus.includes(k.sku)).map((k) => k.tier),
        );
    }, [ownedSkus, kits]);

    const filtered = useMemo(() => {
        return freenoveProjects.filter((p) => {
            if (selectedKitTier !== "all" && p.kitTier !== selectedKitTier) return false;
            if (selectedCategory !== "all" && p.category !== selectedCategory) return false;
            if (selectedDifficulty !== 0 && p.difficulty !== selectedDifficulty) return false;
            if (search) {
                const q = search.toLowerCase();
                return (
                    p.name.toLowerCase().includes(q) ||
                    p.fullName.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.concepts.some((c) => c.toLowerCase().includes(q)) ||
                    p.tags.some((t) => t.toLowerCase().includes(q))
                );
            }
            return true;
        });
    }, [freenoveProjects, search, selectedCategory, selectedDifficulty, selectedKitTier]);

    const stats = useMemo(() => ({
        total: cloudTotal,
        categories: tutorialCategories.length,
        avgTime: freenoveProjects.length
            ? Math.round(
                freenoveProjects.reduce((sum, p) => sum + p.timeEstimate, 0) / freenoveProjects.length,
            )
            : 0,
    }), [cloudTotal, freenoveProjects, tutorialCategories]);

    return (
        <div className="px-4 md:px-8 py-8 min-height-screen space-y-8">
            {/* ── Hero Section ──────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg glow-md">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white">
                                    Tutorial Library
                                </h1>
                                <p className="text-blue-200/60 text-sm mt-0.5">
                                    Freenove ESP32-S3 Complete Project Collection
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { label: "Projects", value: stats.total, icon: Layers },
                            { label: "Categories", value: stats.categories, icon: Grid3X3 },
                            { label: "Avg Time", value: `${stats.avgTime}m`, icon: Clock },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="glass flex items-center gap-2 px-4 py-2 rounded-xl"
                            >
                                <stat.icon className="w-4 h-4 text-blue-400" />
                                <span className="text-white font-semibold">{stat.value}</span>
                                <span className="text-blue-200/50 text-xs">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── Filters ──────────────────────────────────────────────── */}
            <GlassCard variant="strong" padding="p-5">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <GlassInput
                            variant="search"
                            placeholder="Search projects, concepts, components..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        {/* Category Filter */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as TutorialCategory | "all")}
                                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-blue-500/50 hover:bg-white/8 transition-all pr-8"
                            >
                                <option value="all">All Categories</option>
                                {tutorialCategories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
                        </div>

                        {/* Difficulty Filter */}
                        <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/8">
                            <button
                                onClick={() => setSelectedDifficulty(0)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${selectedDifficulty === 0
                                    ? "bg-blue-500/30 text-blue-300"
                                    : "text-white/40 hover:text-white/70"
                                    }`}
                            >
                                All
                            </button>
                            {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setSelectedDifficulty(selectedDifficulty === level ? 0 : level)}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedDifficulty === level
                                        ? "bg-blue-500/30 text-blue-300"
                                        : "text-white/40 hover:text-white/70"
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>

                        {/* View Toggle */}
                        <div className="flex gap-0.5 bg-white/5 rounded-xl p-1 border border-white/8">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "grid" ? "bg-blue-500/30 text-blue-300" : "text-white/40 hover:text-white/70"
                                    }`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-blue-500/30 text-blue-300" : "text-white/40 hover:text-white/70"
                                    }`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Active Filters */}
                {(selectedCategory !== "all" || selectedDifficulty !== 0 || search || selectedKitTier !== "all") && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                        <span className="text-xs text-white/30">Showing {filtered.length} results</span>
                        <button
                            onClick={() => {
                                setSearch("");
                                setSelectedCategory("all");
                                setSelectedDifficulty(0);
                                setSelectedKitTier("all");
                            }}
                            className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer ml-auto"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </GlassCard>

            {/* ── Kit Tier Filter ───────────────────────────────────────── */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                <button
                    onClick={() => setSelectedKitTier("all")}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${selectedKitTier === "all"
                        ? "bg-white/15 text-white border-white/30"
                        : "bg-white/5 text-white/50 border-white/8 hover:bg-white/10 hover:text-white/70"
                        }`}
                >
                    All Kits ({cloudTotal})
                </button>
                {sortKitsByTier(kits).map((kit) => {
                    const tier = kit.tier as KitTier;
                    const count = kit.projectCount;
                    const color = kitColor(kits, tier);
                    const isActive = selectedKitTier === tier;
                    return (
                        <button
                            key={kit.sku}
                            onClick={() => setSelectedKitTier(isActive ? "all" : tier)}
                            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border flex items-center gap-1.5 ${isActive
                                ? "border-opacity-50 glow-sm"
                                : "bg-white/5 text-white/50 border-white/8 hover:bg-white/10 hover:text-white/70"
                                }`}
                            style={isActive ? {
                                backgroundColor: `${color}20`,
                                borderColor: `${color}50`,
                                color,
                            } : undefined}
                        >
                            <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: color }}
                            />
                            {tier.charAt(0).toUpperCase() + tier.slice(1)} Kit
                            <span className="text-xs opacity-60">({count})</span>
                            {ownedTierSet.size > 0 && !ownedTierSet.has(tier) && (
                                <Lock className="w-3 h-3 opacity-50" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ── Category Pills (horizontal scroll) ───────────────────── */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
                <button
                    onClick={() => setSelectedCategory("all")}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${selectedCategory === "all"
                        ? "bg-blue-500/25 text-blue-300 border-blue-500/40 glow-sm"
                        : "bg-white/5 text-white/50 border-white/8 hover:bg-white/10 hover:text-white/70"
                        }`}
                >
                    All ({filtered.length})
                </button>
                {tutorialCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border flex items-center gap-2 ${selectedCategory === cat.id
                            ? "text-white border-opacity-40 glow-sm"
                            : "bg-white/5 text-white/50 border-white/8 hover:bg-white/10 hover:text-white/70"
                            }`}
                        style={
                            selectedCategory === cat.id
                                ? {
                                    backgroundColor: `${cat.color}20`,
                                    borderColor: `${cat.color}50`,
                                    color: cat.color,
                                }
                                : undefined
                        }
                    >
                        <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* ── Project Grid/List ────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                    <motion.div
                        key="grid"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {filtered.map((project, i) => {
                            const cat = tutorialCategories.find((c) => c.id === project.category);
                            const tierColor = kitColor(kits, project.kitTier);
                            const isLocked = ownedTierSet.size > 0 && !ownedTierSet.has(project.kitTier);
                            return (
                                <GlassCard
                                    key={project.id}
                                    variant="interactive"
                                    index={i}
                                    padding="p-5"
                                    onClick={() => navigate(`/tutorials/${project.id}`)}
                                >
                                    <div className={`flex items-start justify-between mb-3 ${isLocked ? "opacity-50" : ""}`}>
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                                            style={{
                                                backgroundColor: `${cat?.color ?? "#3b82f6"}15`,
                                                color: cat?.color ?? "#3b82f6",
                                                border: `1px solid ${cat?.color ?? "#3b82f6"}30`,
                                            }}
                                        >
                                            {project.displayId}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-[10px] font-medium px-1.5 py-0.5 rounded border"
                                                style={{ color: tierColor, borderColor: `${tierColor}30`, backgroundColor: `${tierColor}12` }}
                                            >
                                                {project.kitTier}
                                            </span>
                                            <DifficultyBadge level={project.difficulty} showLabel={false} />
                                        </div>
                                    </div>

                                    <h3 className={`font-semibold text-lg mb-1 ${isLocked ? "text-white/40" : "text-white"}`}>
                                        {project.name}
                                    </h3>
                                    <p className="text-blue-200/50 text-sm line-clamp-2 mb-4">
                                        {project.description}
                                    </p>

                                    {/* Concepts */}
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {project.concepts.slice(0, 3).map((concept) => (
                                            <GlassBadge key={concept} size="sm">
                                                {concept}
                                            </GlassBadge>
                                        ))}
                                        {project.concepts.length > 3 && (
                                            <GlassBadge size="sm" color="#64748b">
                                                +{project.concepts.length - 3}
                                            </GlassBadge>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                        <div className="flex items-center gap-3 text-xs text-white/40">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {project.timeEstimate}m
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Cpu className="w-3 h-3" />
                                                {project.components.length} parts
                                            </span>
                                            {project.language === "both" && (
                                                <GlassBadge size="sm" color="#22c55e">
                                                    C++ &amp; Python
                                                </GlassBadge>
                                            )}
                                        </div>
                                        {isLocked
                                            ? <Lock className="w-4 h-4 text-white/20" />
                                            : <ChevronRight className="w-4 h-4 text-white/20" />
                                        }
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {filtered.map((project, i) => {
                            const cat = tutorialCategories.find((c) => c.id === project.category);
                            const tierColor = kitColor(kits, project.kitTier);
                            const isLocked = ownedTierSet.size > 0 && !ownedTierSet.has(project.kitTier);
                            return (
                                <GlassCard
                                    key={project.id}
                                    variant="interactive"
                                    index={i}
                                    padding="px-5 py-4"
                                    onClick={() => navigate(`/tutorials/${project.id}`)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center text-sm font-bold ${isLocked ? "opacity-40" : ""}`}
                                            style={{
                                                backgroundColor: `${cat?.color ?? "#3b82f6"}15`,
                                                color: cat?.color ?? "#3b82f6",
                                                border: `1px solid ${cat?.color ?? "#3b82f6"}30`,
                                            }}
                                        >
                                            {project.displayId}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className={`font-semibold truncate ${isLocked ? "text-white/40" : "text-white"}`}>
                                                    {project.name}
                                                </h3>
                                                <DifficultyBadge level={project.difficulty} />
                                                <span
                                                    className="text-[10px] font-medium px-1.5 py-0.5 rounded border shrink-0"
                                                    style={{ color: tierColor, borderColor: `${tierColor}30`, backgroundColor: `${tierColor}12` }}
                                                >
                                                    {project.kitTier}
                                                </span>
                                            </div>
                                            <p className="text-blue-200/40 text-sm truncate mt-0.5">
                                                {project.description}
                                            </p>
                                        </div>
                                        <div className="hidden md:flex items-center gap-3 text-xs text-white/30">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {project.timeEstimate}m
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Cpu className="w-3.5 h-3.5" />
                                                {project.components.length}
                                            </span>
                                        </div>
                                        {isLocked
                                            ? <Lock className="w-4 h-4 text-white/20 shrink-0" />
                                            : <ChevronRight className="w-5 h-5 text-white/15 shrink-0" />
                                        }
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State */}
            {filtered.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <Search className="w-12 h-12 mx-auto text-white/10 mb-4" />
                    <h3 className="text-white/50 text-lg font-medium mb-1">No projects found</h3>
                    <p className="text-white/30 text-sm">Try adjusting your search or filters</p>
                </motion.div>
            )}
        </div>
    );
}
