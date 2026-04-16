import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Shield, Database, BookOpen, Layers, Package, RefreshCw,
    Settings, BarChart3, FolderOpen, ExternalLink, Plus, Edit, Trash2,
    CloudUpload, Check, AlertCircle, Loader2, CircleAlert, Zap,
    Search, Filter, Star, Clock, Globe, Github, Scan, Activity,
} from "lucide-react";
import GlassCard, { GlassCardHeader } from "../ui/glass/GlassCard";
import GlassBadge from "../ui/glass/GlassBadge";
import GlassInput from "../ui/glass/GlassInput";
import { isSupabaseConfigured } from "../../lib/supabase";
import { seedStaticData, syncCodeFiles, getSyncLogs, type SyncProgress, type SyncLogEntry } from "../../services/syncService";
import { getDataSource, getDataSources } from "../../services/tutorialService";
import { useProjects, useKits, useCategories, useLearningPaths } from "../../hooks/useTutorialData";
import { scanFreenoveKits, filterKits, loadNormalizationFromSupabase, normalizeKitsToSupabase, cleanOrphanProjects, type ScannedKit, type KitFilter } from "../../services/kitScannerService";
import AnalyticsDashboard from "../ui/admin/AnalyticsDashboard";

type AdminTab = "overview" | "projects" | "kits" | "paths" | "data" | "settings" | "analytics";

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState<AdminTab>("overview");
    const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
    const [fileSyncProgress, setFileSyncProgress] = useState<SyncProgress | null>(null);

    // Kit scanner state
    const [scannedKits, setScannedKits] = useState<ScannedKit[]>([]);
    const [scanning, setScanning] = useState(false);
    const [kitSearch, setKitSearch] = useState("");
    const [kitFilter, setKitFilter] = useState<KitFilter>("all");
    const [selectedKits, setSelectedKits] = useState<Set<string>>(new Set());
    const [normalizing, setNormalizing] = useState(false);
    const [normProgress, setNormProgress] = useState<string | null>(null);
    const [normError, setNormError] = useState<string | null>(null);

    // Projects tab state
    const [projectSearch, setProjectSearch] = useState("");
    const [projectPage, setProjectPage] = useState(0);
    const PROJECTS_PER_PAGE = 20;

    const filteredScannedKits = filterKits(scannedKits, kitFilter, kitSearch);

    const handleScanKits = useCallback(async () => {
        setScanning(true);
        try {
            await loadNormalizationFromSupabase();
            const kits = await scanFreenoveKits();
            setScannedKits(kits);
        } finally {
            setScanning(false);
        }
    }, []);

    const toggleKitSelection = (sku: string) => {
        setSelectedKits((prev) => {
            const next = new Set(prev);
            if (next.has(sku)) next.delete(sku);
            else next.add(sku);
            return next;
        });
    };

    const handleNormalizeSelected = useCallback(async () => {
        const skus = [...selectedKits];
        setNormalizing(true);
        setNormProgress("Starting normalization…");
        setNormError(null);
        const result = await normalizeKitsToSupabase(skus, (msg) => setNormProgress(msg));
        setNormalizing(false);
        if (result.success) {
            const ts = new Date().toISOString();
            setScannedKits((prev) =>
                prev.map((kit) =>
                    selectedKits.has(kit.sku)
                        ? { ...kit, normalized: true, normalizedAt: ts }
                        : kit,
                ),
            );
            setSelectedKits(new Set());
        } else {
            setNormError(result.error ?? "Normalization failed");
        }
    }, [selectedKits]);

    // Auto-scan on kits tab mount
    useEffect(() => {
        if (activeTab === "kits" && scannedKits.length === 0 && !scanning) {
            handleScanKits();
        }
    }, [activeTab, scannedKits.length, scanning, handleScanKits]);

    // Sync history
    const [syncLogs, setSyncLogs] = useState<SyncLogEntry[]>([]);

    const refreshSyncLogs = useCallback(async () => {
        const logs = await getSyncLogs();
        setSyncLogs(logs);
    }, []);

    useEffect(() => {
        if (activeTab === "overview") {
            refreshSyncLogs();
        }
    }, [activeTab, refreshSyncLogs]);

    const { data: freenoveProjects } = useProjects();
    const { data: freenoveKits } = useKits();
    const { data: tutorialCategories } = useCategories();
    const { data: learningPaths } = useLearningPaths();
    // Total unique projects — always use actual fetched count
    const cloudTotal = freenoveProjects.length;

    const supabaseReady = isSupabaseConfigured();
    const dataSource = getDataSource();
    const tableSources = getDataSources();

    const handleSeedData = useCallback(async () => {
        setSyncProgress({ phase: "idle", current: 0, total: 0, message: "Starting..." });
        const result = await seedStaticData((p) => setSyncProgress(p));
        if (!result.success) {
            setSyncProgress({ phase: "error", current: 0, total: 0, message: result.error ?? "Failed" });
        }
        refreshSyncLogs();
    }, [refreshSyncLogs]);

    const handleSyncFiles = useCallback(async () => {
        setFileSyncProgress({ phase: "idle", current: 0, total: 0, message: "Starting..." });
        const result = await syncCodeFiles((p) => setFileSyncProgress(p));
        if (!result.success) {
            setFileSyncProgress({ phase: "error", current: 0, total: 0, message: result.error ?? "Failed" });
        }
        refreshSyncLogs();
    }, [refreshSyncLogs]);

    const tabs = [
        { key: "overview" as AdminTab, label: "Overview", icon: BarChart3 },
        { key: "analytics" as AdminTab, label: "Analytics", icon: Activity },
        { key: "projects" as AdminTab, label: "Projects", icon: BookOpen },
        { key: "kits" as AdminTab, label: "Kits", icon: Package },
        { key: "paths" as AdminTab, label: "Paths", icon: Layers },
        { key: "data" as AdminTab, label: "Data Sources", icon: Database },
        { key: "settings" as AdminTab, label: "Settings", icon: Settings },
    ];

    return (
        <div className="px-4 md:px-8 py-8 min-height-screen space-y-6">
            {/* ── Header ───────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3"
            >
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-lg glow-md">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Admin Panel</h1>
                    <p className="text-blue-200/60 text-sm mt-0.5">
                        Manage tutorials, kits, and data sources
                    </p>
                </div>
            </motion.div>

            {/* ── Tab Navigation ────────────────────────────────────────── */}
            <div className="flex gap-1 bg-white/5 rounded-2xl p-1.5 border border-white/8 overflow-x-auto scrollbar-none">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.key
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Overview Tab ──────────────────────────────────────────── */}
            {activeTab === "overview" && (
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Total Projects", value: `${cloudTotal}`, icon: BookOpen, color: "#3b82f6" },
                            { label: "Categories", value: tutorialCategories.length, icon: Layers, color: "#8b5cf6" },
                            { label: "Learning Paths", value: learningPaths.length, icon: Layers, color: "#f59e0b" },
                            { label: "Kits Supported", value: freenoveKits.length, icon: Package, color: "#22c55e" },
                        ].map((stat, i) => (
                            <GlassCard key={stat.label} index={i} padding="p-5">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{
                                            backgroundColor: `${stat.color}15`,
                                            border: `1px solid ${stat.color}30`,
                                        }}
                                    >
                                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        <p className="text-white/40 text-xs">{stat.label}</p>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Quick Actions — Freenove Sync */}
                    <GlassCard index={1}>
                        <GlassCardHeader
                            title="Quick Actions"
                            icon={<Zap className="w-5 h-5" />}
                            subtitle="Manage Freenove tutorial data"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <button
                                onClick={handleSeedData}
                                disabled={!supabaseReady || (syncProgress !== null && syncProgress.phase !== "done" && syncProgress.phase !== "error")}
                                className="flex items-center gap-3 bg-blue-500/10 hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed border border-blue-500/20 rounded-xl px-5 py-4 text-left transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    {syncProgress?.phase === "done" ? <Check className="w-5 h-5 text-green-400" /> :
                                        syncProgress && syncProgress.phase !== "error" && syncProgress.phase !== "idle" ? <Loader2 className="w-5 h-5 text-blue-400 animate-spin" /> :
                                            <CloudUpload className="w-5 h-5 text-blue-400" />}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">Seed Freenove Data</p>
                                    <p className="text-white/40 text-xs">Push {cloudTotal} projects to Supabase</p>
                                </div>
                            </button>
                            <button
                                onClick={handleSyncFiles}
                                disabled={!supabaseReady || (fileSyncProgress !== null && fileSyncProgress.phase !== "done" && fileSyncProgress.phase !== "error")}
                                className="flex items-center gap-3 bg-purple-500/10 hover:bg-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed border border-purple-500/20 rounded-xl px-5 py-4 text-left transition-all cursor-pointer group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                    {fileSyncProgress?.phase === "done" ? <Check className="w-5 h-5 text-green-400" /> :
                                        fileSyncProgress && fileSyncProgress.phase !== "error" && fileSyncProgress.phase !== "idle" ? <Loader2 className="w-5 h-5 text-purple-400 animate-spin" /> :
                                            <RefreshCw className="w-5 h-5 text-purple-400" />}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">Sync Code Files</p>
                                    <p className="text-white/40 text-xs">Download .ino/.py from GitHub</p>
                                </div>
                            </button>
                        </div>
                        {!supabaseReady && (
                            <div className="mt-3 flex items-center gap-2 text-amber-300/80 text-xs">
                                <CircleAlert className="w-3.5 h-3.5 shrink-0" />
                                <span>Supabase not configured — go to <button onClick={() => setActiveTab("data")} className="underline cursor-pointer hover:text-amber-200">Data Sources</button> tab for setup instructions.</span>
                            </div>
                        )}
                        {(syncProgress && syncProgress.phase !== "idle") && (
                            <div className="mt-3 space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-white/50">{syncProgress.message}</span>
                                    <span className="text-white/30">{syncProgress.phase === "done" ? "Complete" : syncProgress.phase === "error" ? "Error" : `${syncProgress.current}/${syncProgress.total}`}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-300 ${syncProgress.phase === "error" ? "bg-red-500" : syncProgress.phase === "done" ? "bg-green-500" : "bg-blue-500"}`} style={{ width: syncProgress.total > 0 ? `${(syncProgress.current / syncProgress.total) * 100}%` : syncProgress.phase === "done" ? "100%" : "0%" }} />
                                </div>
                            </div>
                        )}
                        {(fileSyncProgress && fileSyncProgress.phase !== "idle") && (
                            <div className="mt-3 space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-white/50">{fileSyncProgress.message}</span>
                                    <span className="text-white/30">{fileSyncProgress.phase === "done" ? "Complete" : fileSyncProgress.phase === "error" ? "Error" : `${fileSyncProgress.current}/${fileSyncProgress.total}`}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-300 ${fileSyncProgress.phase === "error" ? "bg-red-500" : fileSyncProgress.phase === "done" ? "bg-green-500" : "bg-purple-500"}`} style={{ width: fileSyncProgress.total > 0 ? `${(fileSyncProgress.current / fileSyncProgress.total) * 100}%` : fileSyncProgress.phase === "done" ? "100%" : "0%" }} />
                                </div>
                            </div>
                        )}
                    </GlassCard>

                    {/* Category Breakdown */}
                    <GlassCard index={4}>
                        <GlassCardHeader
                            title="Category Distribution"
                            icon={<BarChart3 className="w-5 h-5" />}
                        />
                        <div className="space-y-3">
                            {tutorialCategories.map((cat) => {
                                const count = freenoveProjects.filter((p) => p.category === cat.id).length;
                                const percentage = (count / freenoveProjects.length) * 100;
                                return (
                                    <div key={cat.id} className="flex items-center gap-3">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                        <span className="text-white/70 text-sm flex-1 truncate min-w-0">
                                            {cat.name}
                                        </span>
                                        <span className="text-white/40 text-xs font-mono shrink-0">
                                            {count}
                                        </span>
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden shrink-0">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: cat.color,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>

                    {/* Difficulty Distribution */}
                    <GlassCard index={5}>
                        <GlassCardHeader
                            title="Difficulty Distribution"
                            icon={<BarChart3 className="w-5 h-5" />}
                        />
                        <div className="grid grid-cols-5 gap-3">
                            {([1, 2, 3, 4, 5] as const).map((level) => {
                                const count = freenoveProjects.filter((p) => p.difficulty === level).length;
                                const labels = ["Beginner", "Elementary", "Intermediate", "Advanced", "Expert"];
                                const colors = ["#22c55e", "#3b82f6", "#eab308", "#f97316", "#ef4444"];
                                return (
                                    <div key={level} className="text-center">
                                        <div className="text-2xl font-bold text-white mb-1">{count}</div>
                                        <div
                                            className="text-xs font-medium mb-2"
                                            style={{ color: colors[level - 1] }}
                                        >
                                            {labels[level - 1]}
                                        </div>
                                        <div className="h-16 bg-white/5 rounded-lg overflow-hidden flex items-end">
                                            <div
                                                className="w-full rounded-t-md transition-all"
                                                style={{
                                                    height: `${(count / freenoveProjects.length) * 100}%`,
                                                    backgroundColor: colors[level - 1],
                                                    opacity: 0.6,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>

                    {/* Sync History */}
                    <GlassCard index={6}>
                        <GlassCardHeader
                            title="Sync History"
                            icon={<Clock className="w-5 h-5" />}
                            subtitle="Recent data sync operations"
                        />
                        {syncLogs.length === 0 ? (
                            <div className="flex flex-col items-center py-8 text-center">
                                <Clock className="w-10 h-10 text-white/15 mb-2" />
                                <p className="text-white/40 text-sm">No sync operations yet</p>
                                <p className="text-white/25 text-xs mt-1">Use Quick Actions above to seed or sync data.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {syncLogs.slice(0, 10).map((log, i) => (
                                    <div
                                        key={log.id ?? i}
                                        className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3"
                                    >
                                        <div
                                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${log.status === "completed"
                                                ? "bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]"
                                                : log.status === "failed"
                                                    ? "bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
                                                    : "bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.5)]"
                                                }`}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white/70 text-sm font-medium capitalize">
                                                {log.type === "seed" ? "Verify" : "Sync Files"}
                                            </p>
                                            <p className="text-white/30 text-xs">
                                                {log.itemsProcessed} items &middot;{" "}
                                                {new Date(log.startedAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <GlassBadge
                                            size="sm"
                                            color={
                                                log.status === "completed"
                                                    ? "#22c55e"
                                                    : log.status === "failed"
                                                        ? "#ef4444"
                                                        : "#eab308"
                                            }
                                        >
                                            {log.status}
                                        </GlassBadge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassCard>
                </div>
            )}

            {/* ── Analytics Tab ────────────────────────────────────────── */}
            {activeTab === "analytics" && <AnalyticsDashboard />}

            {/* ── Projects Tab ─────────────────────────────────────────── */}
            {activeTab === "projects" && (() => {
                const q = projectSearch.toLowerCase();
                const filteredProjects = q
                    ? freenoveProjects.filter(
                        (p) =>
                            p.name.toLowerCase().includes(q) ||
                            p.id.toLowerCase().includes(q) ||
                            p.category.toLowerCase().includes(q) ||
                            p.kitTier.toLowerCase().includes(q),
                    )
                    : freenoveProjects;
                const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
                const page = Math.min(projectPage, Math.max(totalPages - 1, 0));
                const paged = filteredProjects.slice(page * PROJECTS_PER_PAGE, (page + 1) * PROJECTS_PER_PAGE);

                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                <input
                                    type="text"
                                    value={projectSearch}
                                    onChange={(e) => { setProjectSearch(e.target.value); setProjectPage(0); }}
                                    placeholder="Search projects by name, ID, category…"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/40"
                                />
                            </div>
                            <span className="text-white/30 text-sm shrink-0">{filteredProjects.length} projects</span>
                        </div>

                        <GlassCard variant="strong" padding="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-white/8">
                                            <th className="p-4 text-left text-white/40 font-medium">ID</th>
                                            <th className="p-4 text-left text-white/40 font-medium">Name</th>
                                            <th className="p-4 text-left text-white/40 font-medium">Category</th>
                                            <th className="p-4 text-left text-white/40 font-medium">Difficulty</th>
                                            <th className="p-4 text-left text-white/40 font-medium">Kit</th>
                                            <th className="p-4 text-left text-white/40 font-medium">Language</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paged.map((project) => {
                                            const cat = tutorialCategories.find((c) => c.id === project.category);
                                            return (
                                                <tr
                                                    key={project.id}
                                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="p-4">
                                                        <span className="font-mono text-blue-400 font-bold">
                                                            {project.displayId}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-white/80">{project.name}</td>
                                                    <td className="p-4">
                                                        <GlassBadge size="sm" color={cat?.color}>
                                                            {cat?.name ?? project.category}
                                                        </GlassBadge>
                                                    </td>
                                                    <td className="p-4">
                                                        <GlassBadge
                                                            size="sm"
                                                            color={
                                                                ["", "#22c55e", "#3b82f6", "#eab308", "#f97316", "#ef4444"][project.difficulty]
                                                            }
                                                        >
                                                            Level {project.difficulty}
                                                        </GlassBadge>
                                                    </td>
                                                    <td className="p-4 text-white/40 capitalize">{project.kitTier}</td>
                                                    <td className="p-4">
                                                        <GlassBadge
                                                            size="sm"
                                                            color={project.language === "both" ? "#22c55e" : "#3b82f6"}
                                                        >
                                                            {project.language}
                                                        </GlassBadge>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 p-4 border-t border-white/8">
                                    <button
                                        onClick={() => setProjectPage(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                                    >
                                        ← Prev
                                    </button>
                                    <span className="text-white/30 text-xs">
                                        Page {page + 1} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setProjectPage(Math.min(totalPages - 1, page + 1))}
                                        disabled={page >= totalPages - 1}
                                        className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                );
            })()}

            {/* ── Kits Tab ─────────────────────────────────────────────── */}
            {activeTab === "kits" && (
                <div className="space-y-4">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                                type="text"
                                value={kitSearch}
                                onChange={(e) => setKitSearch(e.target.value)}
                                placeholder="Search kits by name, SKU, or board..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/40"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={kitFilter}
                                onChange={(e) => setKitFilter(e.target.value as KitFilter)}
                                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/40 cursor-pointer"
                            >
                                <option value="all" className="bg-gray-900">All Kits</option>
                                <option value="esp32-s3" className="bg-gray-900">ESP32-S3 Only</option>
                                <option value="esp32" className="bg-gray-900">ESP32 (non-S3)</option>
                                <option value="normalized" className="bg-gray-900">Normalized</option>
                                <option value="not-normalized" className="bg-gray-900">Not Normalized</option>
                            </select>
                            <button
                                onClick={handleScanKits}
                                disabled={scanning}
                                className="flex items-center gap-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-blue-500/20 cursor-pointer disabled:opacity-50"
                            >
                                {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                                Scan
                            </button>
                        </div>
                    </div>

                    {/* Selection actions */}
                    {(selectedKits.size > 0 || normalizing || normProgress) && (
                        <div className="flex flex-col gap-2 bg-purple-500/10 border border-purple-500/20 rounded-xl px-4 py-3">
                            <div className="flex items-center gap-3">
                                {normalizing ? (
                                    <Loader2 className="w-4 h-4 text-purple-300 animate-spin shrink-0" />
                                ) : (
                                    <span className="text-purple-300 text-sm">
                                        {selectedKits.size} kit{selectedKits.size > 1 ? "s" : ""} selected
                                    </span>
                                )}
                                {!normalizing && selectedKits.size > 0 && (
                                    <button
                                        onClick={handleNormalizeSelected}
                                        disabled={!supabaseReady}
                                        className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer disabled:opacity-40"
                                    >
                                        <CloudUpload className="w-3.5 h-3.5" />
                                        Normalize &amp; Seed to Supabase
                                    </button>
                                )}
                                {!normalizing && (
                                    <button
                                        onClick={async () => {
                                            setNormProgress("Cleaning orphan projects…");
                                            setNormError(null);
                                            const result = await cleanOrphanProjects((msg) => setNormProgress(msg));
                                            if (result.error) setNormError(result.error);
                                            else setNormProgress(result.removed > 0 ? `Removed ${result.removed} orphan project(s) ✓` : "No orphan rows found ✓");
                                        }}
                                        disabled={!supabaseReady || normalizing}
                                        className="flex items-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-200 px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer disabled:opacity-40"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Clean Orphans
                                    </button>
                                )}
                                {!normalizing && (
                                    <button
                                        onClick={() => { setSelectedKits(new Set()); setNormProgress(null); setNormError(null); }}
                                        className="text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer ml-auto"
                                    >
                                        {normProgress && !normError ? "Dismiss" : "Clear"}
                                    </button>
                                )}
                            </div>
                            {normProgress && (
                                <p className={`text-xs ${normError ? "text-red-300" : "text-purple-200/70"} font-mono`}>
                                    {normError ? `Error: ${normError}` : normProgress}
                                </p>
                            )}
                            {!normalizing && !normError && normProgress?.startsWith("Done") && (
                                <p className="text-xs text-green-400/80">
                                    Kit data, projects, components and learning paths have been saved to Supabase.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Results */}
                    {scanning ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                                <p className="text-white/40 text-sm">Scanning Freenove kits via GitHub...</p>
                            </div>
                        </div>
                    ) : scannedKits.length === 0 ? (
                        <GlassCard padding="p-12">
                            <div className="flex flex-col items-center gap-3 text-center">
                                <Package className="w-12 h-12 text-white/20" />
                                <h3 className="text-white/60 font-medium">No Kits Scanned</h3>
                                <p className="text-white/30 text-sm">Click "Scan" to discover available Freenove kits from GitHub.</p>
                            </div>
                        </GlassCard>
                    ) : filteredScannedKits.length === 0 ? (
                        <GlassCard padding="p-12">
                            <div className="flex flex-col items-center gap-3 text-center">
                                <Filter className="w-12 h-12 text-white/20" />
                                <h3 className="text-white/60 font-medium">No Matching Kits</h3>
                                <p className="text-white/30 text-sm">Try a different search term or filter.</p>
                            </div>
                        </GlassCard>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-white/30 text-xs px-1">
                                Showing {filteredScannedKits.length} of {scannedKits.length} kits
                            </p>
                            {filteredScannedKits.map((kit) => (
                                <GlassCard key={kit.sku} padding="p-4">
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedKits.has(kit.sku)}
                                            onChange={() => toggleKitSelection(kit.sku)}
                                            className="mt-1.5 w-4 h-4 rounded accent-purple-500 cursor-pointer shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-white font-medium text-sm">{kit.name}</h3>
                                                <span className="text-white/30 font-mono text-xs">{kit.sku}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                <GlassBadge size="sm" color={kit.isEsp32S3 ? "#8b5cf6" : "#3b82f6"}>
                                                    {kit.board ?? "Unknown"}
                                                </GlassBadge>
                                                {kit.normalized ? (
                                                    <GlassBadge size="sm" color="#22c55e" variant="glow">
                                                        Normalized
                                                    </GlassBadge>
                                                ) : (
                                                    <GlassBadge size="sm" color="#f59e0b">
                                                        Not normalized
                                                    </GlassBadge>
                                                )}
                                                {kit.hasOnlineTutorial && (
                                                    <span className="flex items-center gap-1 text-white/30 text-xs">
                                                        <Globe className="w-3 h-3" /> Tutorial
                                                    </span>
                                                )}
                                                {kit.stars > 0 && (
                                                    <span className="flex items-center gap-1 text-yellow-400/60 text-xs">
                                                        <Star className="w-3 h-3" /> {kit.stars}
                                                    </span>
                                                )}
                                                {kit.lastUpdated && (
                                                    <span className="flex items-center gap-1 text-white/25 text-xs">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(kit.lastUpdated).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {kit.normalizedAt && (
                                                    <span className="text-green-400/50 text-xs">
                                                        Synced {new Date(kit.normalizedAt).toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            {kit.repoUrl && (
                                                <a
                                                    href={kit.repoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-all"
                                                    title="GitHub repo"
                                                >
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {kit.tutorialUrl && (
                                                <a
                                                    href={kit.tutorialUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-all"
                                                    title="Tutorial page"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Paths Tab ────────────────────────────────────────────── */}
            {activeTab === "paths" && (
                <div className="space-y-4">
                    {learningPaths.map((path, i) => (
                        <GlassCard key={path.id} index={i}>
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center"
                                    style={{
                                        backgroundColor: `${path.color}15`,
                                        border: `1px solid ${path.color}30`,
                                    }}
                                >
                                    <Layers className="w-6 h-6" style={{ color: path.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold">{path.name}</h3>
                                    <p className="text-white/40 text-sm truncate">{path.description}</p>
                                </div>
                                <div className="hidden md:flex gap-4 text-center">
                                    <div>
                                        <p className="text-white font-bold">{path.projects.length}</p>
                                        <p className="text-xs text-white/30">Projects</p>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{path.estimatedHours}h</p>
                                        <p className="text-xs text-white/30">Duration</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-all cursor-pointer">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}

            {/* ── Data Sources Tab ─────────────────────────────────────── */}
            {activeTab === "data" && (
                <div className="space-y-4">
                    {/* Connection Status */}
                    <GlassCard>
                        <GlassCardHeader
                            title="Supabase Connection"
                            icon={<Database className="w-5 h-5" />}
                            subtitle={supabaseReady ? "Connected" : "Not configured"}
                        />
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${supabaseReady ? "bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`} />
                                    <div>
                                        <p className="text-white/80 text-sm font-medium">
                                            {supabaseReady ? "Supabase connected" : "Supabase not configured"}
                                        </p>
                                        <p className="text-white/30 text-xs">
                                            {supabaseReady
                                                ? `Data source: ${dataSource} (kits: ${tableSources.kits}, projects: ${tableSources.projects}, categories: ${tableSources.categories}, paths: ${tableSources.paths})`
                                                : "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"}
                                        </p>
                                    </div>
                                </div>
                                <GlassBadge size="sm" color={supabaseReady ? "#22c55e" : "#ef4444"} variant="glow">
                                    {supabaseReady ? "Online" : "Offline"}
                                </GlassBadge>
                            </div>

                            {!supabaseReady && (
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-200/80">
                                    <p className="font-medium mb-1 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Setup Required
                                    </p>
                                    <p className="text-amber-200/60 text-xs leading-relaxed">
                                        1. Create a free Supabase project at supabase.com<br />
                                        2. Run the schema from <code className="bg-white/10 px-1 rounded">supabase/schema.sql</code> in the SQL Editor<br />
                                        3. Create <code className="bg-white/10 px-1 rounded">.env</code> with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY<br />
                                        4. Create a Storage bucket named <code className="bg-white/10 px-1 rounded">code-files</code> (set to public)
                                    </p>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Sync Controls */}
                    <GlassCard>
                        <GlassCardHeader
                            title="Data Sync"
                            icon={<CloudUpload className="w-5 h-5" />}
                            subtitle="Push local tutorial data to Supabase"
                        />
                        <div className="space-y-4">
                            {/* Seed metadata */}
                            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                                <div>
                                    <p className="text-white/80 text-sm font-medium">Seed Tutorial Metadata</p>
                                    <p className="text-white/30 text-xs">
                                        Push {cloudTotal} projects, {tutorialCategories.length} categories,{" "}
                                        {learningPaths.length} paths, {freenoveKits.length} kits to Supabase
                                    </p>
                                </div>
                                <button
                                    onClick={handleSeedData}
                                    disabled={!supabaseReady || (syncProgress?.phase !== "done" && syncProgress?.phase !== "error" && syncProgress !== null)}
                                    className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-blue-300 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-blue-500/20 cursor-pointer"
                                >
                                    {syncProgress?.phase === "done" ? <Check className="w-4 h-4" /> :
                                        syncProgress && syncProgress.phase !== "error" && syncProgress.phase !== "idle" ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                            <CloudUpload className="w-4 h-4" />}
                                    Verify Connection
                                </button>
                            </div>

                            {/* Seed progress bar */}
                            {syncProgress && syncProgress.phase !== "idle" && (
                                <div className="space-y-2 px-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/50">{syncProgress.message}</span>
                                        <span className="text-white/30">
                                            {syncProgress.phase === "done" ? "Complete" :
                                                syncProgress.phase === "error" ? "Error" :
                                                    `${syncProgress.current}/${syncProgress.total}`}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${syncProgress.phase === "error" ? "bg-red-500" :
                                                syncProgress.phase === "done" ? "bg-green-500" :
                                                    "bg-blue-500"
                                                }`}
                                            style={{
                                                width: syncProgress.total > 0
                                                    ? `${(syncProgress.current / syncProgress.total) * 100}%`
                                                    : syncProgress.phase === "done" ? "100%" : "0%",
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Sync code files */}
                            <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                                <div>
                                    <p className="text-white/80 text-sm font-medium">Sync Code Files</p>
                                    <p className="text-white/30 text-xs">
                                        Download .ino/.py files from Freenove GitHub → Supabase Storage
                                    </p>
                                </div>
                                <button
                                    onClick={handleSyncFiles}
                                    disabled={!supabaseReady || (fileSyncProgress?.phase !== "done" && fileSyncProgress?.phase !== "error" && fileSyncProgress !== null)}
                                    className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed text-purple-300 px-4 py-2 rounded-xl text-sm font-medium transition-all border border-purple-500/20 cursor-pointer"
                                >
                                    {fileSyncProgress?.phase === "done" ? <Check className="w-4 h-4" /> :
                                        fileSyncProgress && fileSyncProgress.phase !== "error" && fileSyncProgress.phase !== "idle" ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                            <RefreshCw className="w-4 h-4" />}
                                    Sync Files
                                </button>
                            </div>

                            {/* File sync progress bar */}
                            {fileSyncProgress && fileSyncProgress.phase !== "idle" && (
                                <div className="space-y-2 px-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-white/50">{fileSyncProgress.message}</span>
                                        <span className="text-white/30">
                                            {fileSyncProgress.phase === "done" ? "Complete" :
                                                fileSyncProgress.phase === "error" ? "Error" :
                                                    `${fileSyncProgress.current}/${fileSyncProgress.total}`}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${fileSyncProgress.phase === "error" ? "bg-red-500" :
                                                fileSyncProgress.phase === "done" ? "bg-green-500" :
                                                    "bg-purple-500"
                                                }`}
                                            style={{
                                                width: fileSyncProgress.total > 0
                                                    ? `${(fileSyncProgress.current / fileSyncProgress.total) * 100}%`
                                                    : fileSyncProgress.phase === "done" ? "100%" : "0%",
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Kit Sources */}
                    <GlassCard>
                        <GlassCardHeader
                            title="Freenove Kit Sources"
                            icon={<FolderOpen className="w-5 h-5" />}
                            subtitle="ESP32-S3 tutorial data from Freenove kits"
                        />
                        <div className="space-y-3">
                            {freenoveKits.map((kit) => (
                                <div
                                    key={kit.sku}
                                    className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <Database className="w-5 h-5 text-blue-400" />
                                        <div>
                                            <p className="text-white/80 text-sm font-medium">{kit.name}</p>
                                            <p className="text-white/30 text-xs">{kit.sku} &middot; {kit.projectCount} projects</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <GlassBadge size="sm" color={supabaseReady ? "#22c55e" : "#f59e0b"} variant="glow">
                                            {supabaseReady ? "Cloud" : "Static"}
                                        </GlassBadge>
                                        <a
                                            href={kit.tutorialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/70 transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* ── Settings Tab ─────────────────────────────────────────── */}
            {activeTab === "settings" && (
                <GlassCard>
                    <GlassCardHeader
                        title="Application Settings"
                        icon={<Settings className="w-5 h-5" />}
                    />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                            <div>
                                <p className="text-white/80 text-sm font-medium">Auto-sync tutorial data</p>
                                <p className="text-white/30 text-xs">Automatically check for new Freenove projects on app startup</p>
                            </div>
                            <span className="text-white/20 text-xs italic">Coming soon</span>
                        </div>
                        <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                            <div>
                                <p className="text-white/80 text-sm font-medium">AI-assisted project creation</p>
                                <p className="text-white/30 text-xs">Use AI to generate custom project plans and wiring guides</p>
                            </div>
                            <span className="text-white/20 text-xs italic">Coming soon</span>
                        </div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
