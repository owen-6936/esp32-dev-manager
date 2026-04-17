import { useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    Code,
    BookOpen,
    AlertCircle,
    Lightbulb,
    Target,
    StickyNote,
    ArrowRight,
} from "lucide-react";
import Card from "../../Card";
import useJournalStore from "../../../store/journal";
import useProjectStore from "../../../store/project";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivityItem = {
    id: string;
    kind: "journal" | "project";
    subtype: string;
    title: string;
    date: Date;
    href: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const JOURNAL_META: Record<string, { icon: React.ReactNode; label: string }> = {
    progress: { icon: <Target className="w-4 h-4 text-blue-400" />, label: "Progress" },
    problem: { icon: <AlertCircle className="w-4 h-4 text-red-400" />, label: "Problem" },
    idea: { icon: <Lightbulb className="w-4 h-4 text-yellow-400" />, label: "Idea" },
    milestone: { icon: <Target className="w-4 h-4 text-purple-400" />, label: "Milestone" },
    note: { icon: <StickyNote className="w-4 h-4 text-gray-400" />, label: "Note" },
    learning: { icon: <BookOpen className="w-4 h-4 text-green-400" />, label: "Learning" },
};

const PROJECT_STATUS_COLOR: Record<string, string> = {
    planning: "text-yellow-300",
    "in-progress": "text-blue-300",
    completed: "text-green-300",
    "on-hold": "text-gray-400",
};

function timeAgo(date: Date): string {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return "yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RecentActivity() {
    const navigate = useNavigate();
    const journalEntries = useJournalStore((s) => s.journalEntries);
    const projects = useProjectStore((s) => s.projects);

    const activities = useMemo<ActivityItem[]>(() => {
        const journalItems: ActivityItem[] = journalEntries.map((e) => ({
            id: e.id,
            kind: "journal",
            subtype: e.type,
            title: e.title || "Untitled Entry",
            date: new Date(e.createdAt),
            href: "/workshop?tab=journal",
        }));

        const projectItems: ActivityItem[] = projects.map((p) => ({
            id: p.id,
            kind: "project",
            subtype: p.status,
            title: p.title,
            date: new Date(p.startDate),
            href: "/workshop?tab=projects",
        }));

        return [...journalItems, ...projectItems]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 8);
    }, [journalEntries, projects]);

    return (
        <Card>
            <Card.Header
                title="Recent Activity"
                subtitle={
                    activities.length > 0
                        ? `${activities.length} recent item${activities.length !== 1 ? "s" : ""}`
                        : undefined
                }
            />
            <Card.Body>
                {activities.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white/20" />
                        </div>
                        <p className="text-white/30 text-sm max-w-xs">
                            No activity yet — start a project or add a journal entry.
                        </p>
                        <button
                            onClick={() => navigate("/workshop")}
                            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                        >
                            Go to Workshop{" "}
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        {activities.map((item, i) => {
                            const journalMeta =
                                item.kind === "journal"
                                    ? (JOURNAL_META[item.subtype] ?? JOURNAL_META.note)
                                    : null;

                            return (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04, duration: 0.25 }}
                                    onClick={() => navigate(item.href)}
                                    className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/3 hover:bg-white/7 border border-transparent hover:border-white/8 transition-all text-left group"
                                >
                                    {/* Icon */}
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                        {item.kind === "journal"
                                            ? journalMeta?.icon
                                            : <Code className="w-4 h-4 text-cyan-400" />}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white/80 text-sm font-medium truncate group-hover:text-white transition-colors">
                                            {item.title}
                                        </p>
                                        <p className={`text-xs capitalize ${item.kind === "project" ? (PROJECT_STATUS_COLOR[item.subtype] ?? "text-white/30") : "text-white/30"}`}>
                                            {item.kind === "journal"
                                                ? journalMeta?.label
                                                : `Project · ${item.subtype.replace("-", " ")}`}
                                        </p>
                                    </div>

                                    {/* Time */}
                                    <span className="text-white/25 text-xs shrink-0">
                                        {timeAgo(item.date)}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

