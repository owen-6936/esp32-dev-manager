import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, Clock, Cpu, BookOpen, Code, ChevronRight, GitBranch,
    Layers, Pin, FileCode, Download, Zap, AlertTriangle, Check, Trophy,
} from "lucide-react";
import GlassCard, { GlassCardHeader } from "../ui/glass/GlassCard";
import GlassBadge, { DifficultyBadge } from "../ui/glass/GlassBadge";
import CodeViewer from "../ui/CodeViewer";
import { useState, useEffect, useMemo } from "react";
import { useProject, useProjects, useCategories } from "../../hooks/useTutorialData";
import type { TutorialProject } from "../../types/tutorial";
import useProgressStore, { XP_PER_DIFFICULTY } from "../../store/progress";
import { useAuth } from "../../contexts/AuthContext";
import { syncProgressToSupabase, syncXpToSupabase } from "../../services/progressService";

import { fetchCodeFile, getCodeFileUrl } from "../../services/tutorialService";

type WiringStep = { step: number; text: string; type: "setup" | "power" | "signal" | "note" };

function buildWiringSteps(p: TutorialProject): WiringStep[] {
    const steps: WiringStep[] = [];
    let n = 1;

    const needsBreadboard = p.components.some(
        (c) => !c.name.toLowerCase().includes("built-in"),
    );

    if (needsBreadboard) {
        steps.push({
            step: n++, type: "setup",
            text: "Place your ESP32-S3 development board on the breadboard, leaving rows on both sides for connections.",
        });
    }

    const hasExternalComponents = p.components.some(
        (c) => !c.name.toLowerCase().includes("built-in") && c.category !== "resistor" && c.category !== "capacitor",
    );
    if (hasExternalComponents) {
        steps.push({
            step: n++, type: "power",
            text: "Connect ESP32-S3 3.3V pin → breadboard positive rail (+). Connect ESP32-S3 GND → breadboard negative rail (−).",
        });
    }

    const resistors = p.components.filter((c) => c.category === "resistor");
    for (const r of resistors) {
        steps.push({
            step: n++, type: "note",
            text: `Place ${r.quantity}× ${r.name} on the breadboard — used as current-limiting or pull-up resistors (see connection below).`,
        });
    }

    for (const pin of p.pinsUsed) {
        const modeLabel =
            pin.mode === "GPIO" ? "digital signal"
                : pin.mode === "ADC" ? "analog read"
                    : pin.mode === "PWM" ? "PWM (analog-like output)"
                        : pin.mode === "I2C_SDA" ? "I²C data (SDA)"
                            : pin.mode === "I2C_SCL" ? "I²C clock (SCL)"
                                : pin.mode === "SPI_MOSI" ? "SPI MOSI"
                                    : pin.mode === "SPI_MISO" ? "SPI MISO"
                                        : pin.mode === "SPI_SCK" ? "SPI clock"
                                            : pin.mode === "UART_TX" ? "UART transmit"
                                                : pin.mode === "UART_RX" ? "UART receive"
                                                    : pin.mode;

        steps.push({
            step: n++, type: "signal",
            text: `Connect ESP32-S3 GPIO ${pin.pin} → ${pin.label}  (${modeLabel}).`,
        });
    }

    if (p.libraries.length > 0) {
        steps.push({
            step: n++, type: "note",
            text: `Install required libraries: ${p.libraries.join(", ")} in the Arduino IDE Library Manager before uploading code.`,
        });
    }

    return steps;
}

export default function TutorialDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [codeContent, setCodeContent] = useState<string | null>(null);
    const [codeLanguage, setCodeLanguage] = useState<"arduino" | "python">("arduino");
    const [xpToast, setXpToast] = useState<number | null>(null);

    const { user } = useAuth();
    const userId = user?.id ?? null;
    const { startProject, advanceCheckpoint, completeProject, getProgress, totalXp, completedCount } =
        useProgressStore();
    const progressData = getProgress(id ?? "");

    const { data: project } = useProject(id ?? "");
    const { data: allProjects } = useProjects();
    const { data: tutorialCategories } = useCategories();

    const prerequisites = useMemo(
        () => project ? allProjects.filter((p) => project.prerequisites.includes(p.id)) : [],
        [project, allProjects],
    );
    const nextProjects = useMemo(
        () => project ? allProjects.filter((p) => p.prerequisites.includes(project.id)) : [],
        [project, allProjects],
    );
    const category = project ? tutorialCategories.find((c) => c.id === project.category) : undefined;

    useEffect(() => {
        if (xpToast === null) return;
        const t = setTimeout(() => setXpToast(null), 3500);
        return () => clearTimeout(t);
    }, [xpToast]);

    useEffect(() => {
        if (!project) return;
        const storagePath = codeLanguage === "arduino"
            ? project.arduinoStoragePath
            : project.pythonStoragePath;
        const localPath = codeLanguage === "arduino" ? project.arduinoPath : project.pythonPath;
        if (!localPath) {
            setCodeContent(null);
            return;
        }

        let cancelled = false;

        (async () => {
            // 1. Try Supabase Storage if a storage path is set
            if (storagePath) {
                const text = await fetchCodeFile(storagePath);
                if (!cancelled && text) {
                    setCodeContent(text);
                    return;
                }
            }

            // 2. Fall back to GitHub raw URL
            const repo = "Freenove/Freenove_Ultimate_Starter_Kit_for_ESP32_S3";
            // Sanitize: strip leading slashes, double dots, and encode segments
            const safePath = localPath
                .replace(/^\/+/, "")
                .split("/")
                .filter((s) => s !== ".." && s !== ".")
                .map(encodeURIComponent)
                .join("/");
            const ghUrl = `https://raw.githubusercontent.com/${repo}/main/${safePath}`;
            // For Arduino, the .ino file is inside a folder with the same name
            const fileName = localPath.split("/").pop() ?? "";
            const ext = codeLanguage === "arduino" ? ".ino" : ".py";
            const ghFileUrl = `${ghUrl}/${encodeURIComponent(fileName)}${ext}`;
            try {
                const resp = await fetch(ghFileUrl);
                if (!cancelled && resp.ok) {
                    setCodeContent(await resp.text());
                    return;
                }
            } catch { /* ignore */ }

            // 3. Try the parent folder directly (some sketches use different structure)
            try {
                const resp = await fetch(ghUrl + ext);
                if (!cancelled && resp.ok) {
                    setCodeContent(await resp.text());
                    return;
                }
            } catch { /* ignore */ }

            if (!cancelled) setCodeContent(null);
        })();

        return () => { cancelled = true; };
    }, [project, codeLanguage]);

    if (!project) {
        return (
            <div className="min-height-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl text-white/50 mb-2">Project not found</h2>
                    <button
                        onClick={() => navigate("/learn")}
                        className="text-blue-400 hover:text-blue-300 text-sm cursor-pointer"
                    >
                        Back to tutorials
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="px-4 md:px-8 py-8 min-height-screen space-y-6 max-w-6xl mx-auto">
                {/* ── Back Button ──────────────────────────────────────────── */}
                <motion.button
                    onClick={() => navigate("/learn")}
                    className="flex items-center gap-2 text-blue-300/60 hover:text-blue-300 transition-colors text-sm cursor-pointer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Tutorial Library
                </motion.button>

                {/* ── Header ───────────────────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <GlassCard variant="strong" padding="p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Project ID Badge */}
                            <div
                                className="w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center text-2xl font-bold glow-sm"
                                style={{
                                    backgroundColor: `${category?.color ?? "#3b82f6"}15`,
                                    color: category?.color ?? "#3b82f6",
                                    border: `1px solid ${category?.color ?? "#3b82f6"}30`,
                                    boxShadow: `0 0 30px ${category?.color ?? "#3b82f6"}15`,
                                }}
                            >
                                {project.displayId}
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                                        {project.fullName}
                                    </h1>
                                    <DifficultyBadge level={project.difficulty} size="md" />
                                </div>
                                <p className="text-blue-200/60 text-base mb-4 max-w-2xl">
                                    {project.description}
                                </p>

                                {/* Meta Row */}
                                <div className="flex flex-wrap gap-3">
                                    <GlassBadge color={category?.color} size="md" variant="glow">
                                        {category?.name ?? project.category}
                                    </GlassBadge>
                                    <GlassBadge size="md">
                                        <Clock className="w-3.5 h-3.5" />
                                        {project.timeEstimate} minutes
                                    </GlassBadge>
                                    <GlassBadge size="md">
                                        <Cpu className="w-3.5 h-3.5" />
                                        {project.components.length} components
                                    </GlassBadge>
                                    {project.language === "both" && (
                                        <GlassBadge color="#22c55e" size="md" variant="glow">
                                            <Code className="w-3.5 h-3.5" />
                                            Arduino + Python
                                        </GlassBadge>
                                    )}
                                    <GlassBadge size="md">
                                        Kit: {project.kitTier}
                                    </GlassBadge>
                                </div>

                                {/* ── Progress Strip ─────────────────────────────── */}
                                <div className="mt-5 pt-4 border-t border-white/8 flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${progressData.status === "completed"
                                                ? "bg-green-500/15 border-green-500/30 text-green-400"
                                                : progressData.status === "in_progress"
                                                    ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
                                                    : "bg-white/5 border-white/10 text-white/40"
                                                }`}
                                        >
                                            {progressData.status === "completed" && <Check className="w-3.5 h-3.5" />}
                                            {progressData.status === "in_progress" && (
                                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                            )}
                                            {progressData.status === "not_started" && (
                                                <span className="w-2 h-2 rounded-full bg-white/20" />
                                            )}
                                            {progressData.status === "completed"
                                                ? "Completed"
                                                : progressData.status === "in_progress"
                                                    ? "In Progress"
                                                    : "Not Started"}
                                        </div>
                                        {progressData.status === "completed" && (
                                            <span className="text-yellow-400 text-xs font-medium">
                                                ⭐ {XP_PER_DIFFICULTY[project.difficulty] ?? 100} XP earned
                                            </span>
                                        )}
                                        {progressData.status !== "completed" && (
                                            <span className="text-white/30 text-xs">
                                                +{XP_PER_DIFFICULTY[project.difficulty] ?? 100} XP on completion
                                            </span>
                                        )}
                                    </div>
                                    {progressData.status === "not_started" && (
                                        <button
                                            onClick={() => {
                                                startProject(project.id);
                                                if (userId)
                                                    void syncProgressToSupabase(
                                                        userId, project.id, "in_progress", 0, false,
                                                    );
                                            }}
                                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-xl text-blue-300 text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
                                        >
                                            <Zap className="w-4 h-4" />
                                            Start Project
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* ── Content Grid ─────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Learning Objectives */}
                        <GlassCard index={1}>
                            <GlassCardHeader
                                title="Learning Objectives"
                                icon={<BookOpen className="w-5 h-5" />}
                            />
                            <ul className="space-y-2">
                                {project.learningObjectives.map((obj, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="w-6 h-6 shrink-0 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">
                                            {i + 1}
                                        </span>
                                        <span className="text-blue-100/70 text-sm">{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </GlassCard>

                        {/* Wiring Guide */}
                        {project.pinsUsed.length > 0 && (() => {
                            const wiringSteps = buildWiringSteps(project);
                            const typeStyles: Record<WiringStep["type"], { dot: string; text: string }> = {
                                setup: { dot: "bg-white/30", text: "text-white/60" },
                                power: { dot: "bg-yellow-400", text: "text-yellow-200/80" },
                                signal: { dot: "bg-blue-400", text: "text-blue-100/80" },
                                note: { dot: "bg-purple-400/70", text: "text-purple-200/70" },
                            };
                            return (
                                <GlassCard index={2}>
                                    <GlassCardHeader
                                        title="Step-by-Step Wiring Guide"
                                        icon={<Zap className="w-5 h-5 text-yellow-400" />}
                                        action={
                                            <span className="text-xs text-white/30 flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3 text-yellow-500/60" />
                                                Power off before wiring
                                            </span>
                                        }
                                    />
                                    <ol className="space-y-2">
                                        {wiringSteps.map((s) => {
                                            const style = typeStyles[s.type];
                                            const isDone = s.step <= progressData.checkpoint;
                                            return (
                                                <li
                                                    key={s.step}
                                                    className="flex items-start gap-3 cursor-pointer group"
                                                    onClick={() => {
                                                        if (progressData.status === "not_started")
                                                            startProject(project.id);
                                                        const next = isDone ? s.step - 1 : s.step;
                                                        advanceCheckpoint(project.id, next);
                                                        if (userId)
                                                            void syncProgressToSupabase(
                                                                userId, project.id, "in_progress", next, false,
                                                            );
                                                    }}
                                                >
                                                    <div
                                                        className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center mt-0.5 border transition-all ${isDone
                                                            ? "bg-green-500/70 border-green-500/40 text-white"
                                                            : "bg-white/8 border-white/10 text-white/50 group-hover:border-white/30"
                                                            }`}
                                                    >
                                                        {isDone ? (
                                                            <Check className="w-3 h-3" />
                                                        ) : (
                                                            <span className="text-xs font-bold">{s.step}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-start gap-2 flex-1">
                                                        <span
                                                            className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${style.dot} ${isDone ? "opacity-40" : ""}`}
                                                        />
                                                        <span
                                                            className={`text-sm leading-relaxed transition-all ${isDone ? "text-white/30 line-through" : style.text
                                                                }`}
                                                        >
                                                            {s.text}
                                                        </span>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                    {/* Mark Complete */}
                                    <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-xs text-white/30">
                                            {progressData.checkpoint}/{wiringSteps.length} steps done
                                        </span>
                                        {progressData.status !== "completed" ? (
                                            <button
                                                onClick={() => {
                                                    const xp = completeProject(project.id, project.difficulty);
                                                    if (xp > 0) {
                                                        setXpToast(xp);
                                                        if (userId) {
                                                            void syncProgressToSupabase(
                                                                userId, project.id, "completed",
                                                                progressData.checkpoint, true,
                                                            );
                                                            void syncXpToSupabase(
                                                                userId, totalXp + xp, completedCount() + 1,
                                                            );
                                                        }
                                                    }
                                                }}
                                                className="px-4 py-2 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 rounded-xl text-green-300 text-sm font-medium transition-all cursor-pointer flex items-center gap-2"
                                            >
                                                <Trophy className="w-4 h-4" />
                                                Mark Complete (+{XP_PER_DIFFICULTY[project.difficulty] ?? 100} XP)
                                            </button>
                                        ) : (
                                            <span className="text-green-400 text-sm font-medium flex items-center gap-1.5">
                                                <Check className="w-4 h-4" />
                                                Completed
                                            </span>
                                        )}
                                    </div>
                                </GlassCard>
                            );
                        })()}

                        {/* Concepts */}
                        <GlassCard index={2}>
                            <GlassCardHeader
                                title="Key Concepts"
                                icon={<Layers className="w-5 h-5" />}
                            />
                            <div className="flex flex-wrap gap-2">
                                {project.concepts.map((concept) => (
                                    <GlassBadge key={concept} size="md" variant="outlined">
                                        {concept}
                                    </GlassBadge>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Code Viewer */}
                        <GlassCard index={3} padding="p-0 overflow-hidden">
                            <div className="p-6 pb-0">
                                <GlassCardHeader
                                    title="Source Code"
                                    icon={<FileCode className="w-5 h-5" />}
                                    action={
                                        project.language === "both" ? (
                                            <div className="flex gap-0.5 bg-white/5 rounded-xl p-1 border border-white/8">
                                                <button
                                                    onClick={() => setCodeLanguage("arduino")}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${codeLanguage === "arduino"
                                                        ? "bg-blue-500/30 text-blue-300"
                                                        : "text-white/40 hover:text-white/70"
                                                        }`}
                                                >
                                                    Arduino C++
                                                </button>
                                                <button
                                                    onClick={() => setCodeLanguage("python")}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${codeLanguage === "python"
                                                        ? "bg-green-500/30 text-green-300"
                                                        : "text-white/40 hover:text-white/70"
                                                        }`}
                                                >
                                                    Python
                                                </button>
                                            </div>
                                        ) : undefined
                                    }
                                />
                            </div>
                            {codeContent ? (
                                <CodeViewer
                                    code={codeContent}
                                    language={codeLanguage === "arduino" ? "cpp" : "python"}
                                    title={project.displayId}
                                    maxHeight="500px"
                                />
                            ) : (
                                <div className="p-6 pt-0">
                                    <div className="glass-subtle rounded-xl p-8 text-center">
                                        <FileCode className="w-8 h-8 mx-auto text-white/20 mb-2" />
                                        <p className="text-white/40 text-sm">
                                            Source code could not be loaded automatically
                                        </p>
                                        <p className="text-white/25 text-xs mt-1">
                                            {codeLanguage === "arduino" ? project.arduinoPath : project.pythonPath}
                                        </p>
                                        <a
                                            href={`https://github.com/Freenove/Freenove_Ultimate_Starter_Kit_for_ESP32_S3/tree/main/${(codeLanguage === "arduino" ? project.arduinoPath : project.pythonPath)
                                                ?.replace(/^\/+/, "")
                                                .split("/")
                                                .filter((s) => s !== ".." && s !== ".")
                                                .map(encodeURIComponent)
                                                .join("/") ?? ""
                                                }`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-xs underline"
                                        >
                                            View on GitHub →
                                        </a>
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </div>

                    {/* Right Column (1/3) */}
                    <div className="space-y-6">
                        {/* Pin Configuration */}
                        {project.pinsUsed.length > 0 && (
                            <GlassCard index={4}>
                                <GlassCardHeader
                                    title="Pin Configuration"
                                    icon={<Pin className="w-5 h-5" />}
                                />
                                <div className="space-y-2">
                                    {project.pinsUsed.map((pin) => (
                                        <div
                                            key={`${pin.pin}-${pin.label}`}
                                            className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-mono font-bold flex items-center justify-center">
                                                    {pin.pin}
                                                </span>
                                                <span className="text-white/70 text-sm">{pin.label}</span>
                                            </div>
                                            <GlassBadge size="sm" color="#8b5cf6">
                                                {pin.mode}
                                            </GlassBadge>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                        {/* Components Required */}
                        {project.components.length > 0 && (
                            <GlassCard index={5}>
                                <GlassCardHeader
                                    title="Components Required"
                                    icon={<Cpu className="w-5 h-5" />}
                                />
                                <div className="space-y-2">
                                    {project.components.map((comp, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                                        >
                                            <span className="text-white/70 text-sm">{comp.name}</span>
                                            <span className="text-blue-300/60 text-xs font-mono">
                                                ×{comp.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                        {/* Libraries */}
                        {project.libraries.length > 0 && (
                            <GlassCard index={6}>
                                <GlassCardHeader
                                    title="Required Libraries"
                                    icon={<Download className="w-5 h-5" />}
                                />
                                <div className="space-y-1.5">
                                    {project.libraries.map((lib) => (
                                        <div
                                            key={lib}
                                            className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2"
                                        >
                                            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                                            <span className="text-white/70 text-sm font-mono">{lib}</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                        {/* Prerequisites */}
                        {prerequisites.length > 0 && (
                            <GlassCard index={7}>
                                <GlassCardHeader
                                    title="Prerequisites"
                                    icon={<ArrowLeft className="w-5 h-5" />}
                                />
                                <div className="space-y-2">
                                    {prerequisites.map((prereq) => (
                                        <Link
                                            key={prereq.id}
                                            to={`/tutorials/${prereq.id}`}
                                            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors group"
                                        >
                                            <span className="text-blue-400 font-mono font-bold text-xs">
                                                {prereq.id}
                                            </span>
                                            <span className="text-white/60 text-sm group-hover:text-white/80 flex-1 truncate">
                                                {prereq.name}
                                            </span>
                                            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40" />
                                        </Link>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                        {/* Next Projects */}
                        {nextProjects.length > 0 && (
                            <GlassCard index={8}>
                                <GlassCardHeader
                                    title="What's Next"
                                    icon={<ChevronRight className="w-5 h-5" />}
                                />
                                <div className="space-y-2">
                                    {nextProjects.map((next) => (
                                        <Link
                                            key={next.id}
                                            to={`/tutorials/${next.id}`}
                                            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 transition-colors group"
                                        >
                                            <span className="text-green-400 font-mono font-bold text-xs">
                                                {next.id}
                                            </span>
                                            <span className="text-white/60 text-sm group-hover:text-white/80 flex-1 truncate">
                                                {next.name}
                                            </span>
                                            <DifficultyBadge level={next.difficulty} showLabel={false} />
                                        </Link>
                                    ))}
                                </div>
                            </GlassCard>
                        )}

                        {/* Tags */}
                        <GlassCard index={9}>
                            <GlassCardHeader title="Tags" />
                            <div className="flex flex-wrap gap-1.5">
                                {project.tags.map((tag) => (
                                    <GlassBadge key={tag} size="sm" variant="outlined">
                                        #{tag}
                                    </GlassBadge>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </div>

            {/* ── XP Toast ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {xpToast !== null && (
                    <motion.div
                        key="xp-toast"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-amber-500/20 border border-amber-500/40 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-2xl"
                    >
                        <span className="text-2xl">⭐</span>
                        <div>
                            <p className="text-yellow-300 font-bold">+{xpToast} XP earned!</p>
                            <p className="text-yellow-300/60 text-xs">Project completed 🎉</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
