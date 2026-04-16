/**
 * Admin Analytics Dashboard
 * Displays site-visit trends, top pages, event counts, and DB storage estimates
 * using Chart.js via react-chartjs-2.
 */
import { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler,
    type ChartOptions,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { TrendingUp, TrendingDown, Eye, Users, MousePointer, BarChart3, Activity } from "lucide-react";
import GlassCard, { GlassCardHeader } from "../glass/GlassCard";
import { getAnalyticsSummary, getAllEvents } from "../../../services/analyticsService";

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    ArcElement, Tooltip, Legend, Filler,
);

// ─── Shared chart defaults ────────────────────────────────────────────────────

const GRID_COLOR = "rgba(255,255,255,0.06)";
const TEXT_COLOR = "rgba(255,255,255,0.45)";

const baseOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "rgba(15,23,42,0.95)",
            borderColor: "rgba(255,255,255,0.1)",
            borderWidth: 1,
            titleColor: "#fff",
            bodyColor: "rgba(255,255,255,0.7)",
        },
    },
    scales: {
        x: {
            grid: { color: GRID_COLOR },
            ticks: { color: TEXT_COLOR, font: { size: 10 } },
        },
        y: {
            grid: { color: GRID_COLOR },
            ticks: { color: TEXT_COLOR, font: { size: 10 }, stepSize: 1 },
            beginAtZero: true,
        },
    },
};

function StatPill({
    icon: Icon,
    label,
    value,
    color,
    sub,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: string;
    sub?: string;
}) {
    return (
        <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: `${color}12`, border: `1px solid ${color}28` }}
        >
            <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}20` }}
            >
                <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="min-w-0">
                <p className="text-xl font-bold text-white leading-none">{value}</p>
                <p className="text-white/40 text-xs mt-0.5">{label}</p>
                {sub && <p className="text-white/25 text-xs">{sub}</p>}
            </div>
        </div>
    );
}

export default function AnalyticsDashboard() {
    const summary = useMemo(() => getAnalyticsSummary(), []);
    const events = useMemo(() => getAllEvents(), []);

    // ── Daily views bar chart ─────────────────────────────────────────────────
    const last14Days = summary.last30Days.slice(-14);
    const barData = {
        labels: last14Days.map((d) => {
            const dt = new Date(d.date + "T00:00:00");
            return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        }),
        datasets: [
            {
                label: "Page Views",
                data: last14Days.map((d) => d.views),
                backgroundColor: "rgba(59,130,246,0.55)",
                hoverBackgroundColor: "rgba(59,130,246,0.85)",
                borderRadius: 5,
            },
            {
                label: "Sessions",
                data: last14Days.map((d) => d.sessions),
                backgroundColor: "rgba(139,92,246,0.45)",
                hoverBackgroundColor: "rgba(139,92,246,0.75)",
                borderRadius: 5,
            },
        ],
    };
    const barOptions: ChartOptions<"bar"> = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            legend: {
                display: true,
                labels: { color: TEXT_COLOR, boxWidth: 10, font: { size: 11 } },
            },
        },
    };

    // ── 30 day trend line ─────────────────────────────────────────────────────
    const lineData = {
        labels: summary.last30Days.map((d) => d.date.slice(5)), // MM-DD
        datasets: [
            {
                label: "Views",
                data: summary.last30Days.map((d) => d.views),
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56,189,248,0.08)",
                pointBackgroundColor: "#38bdf8",
                pointRadius: 2,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
            },
        ],
    };
    const lineOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(15,23,42,0.95)",
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
                titleColor: "#fff",
                bodyColor: "rgba(255,255,255,0.7)",
            },
        },
        scales: {
            x: {
                grid: { color: GRID_COLOR },
                ticks: { color: TEXT_COLOR, font: { size: 9 }, maxTicksLimit: 10 },
            },
            y: {
                grid: { color: GRID_COLOR },
                ticks: { color: TEXT_COLOR, font: { size: 10 }, stepSize: 1 },
                beginAtZero: true,
            },
        },
    };

    // ── Event type doughnut ───────────────────────────────────────────────────
    const eventCounts: Record<string, number> = {};
    events.forEach((e) => {
        eventCounts[e.name] = (eventCounts[e.name] ?? 0) + 1;
    });
    const topEvents = Object.entries(eventCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);
    const DONUT_COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#38bdf8"];
    const doughnutData = {
        labels: topEvents.map(([name]) => name),
        datasets: [
            {
                data: topEvents.map(([, count]) => count),
                backgroundColor: DONUT_COLORS.map((c) => `${c}bb`),
                hoverBackgroundColor: DONUT_COLORS,
                borderColor: "rgba(0,0,0,0.2)",
                borderWidth: 2,
            },
        ],
    };
    const doughnutOptions: ChartOptions<"doughnut"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "right",
                labels: { color: TEXT_COLOR, boxWidth: 10, font: { size: 11 } },
            },
            tooltip: {
                backgroundColor: "rgba(15,23,42,0.95)",
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: 1,
                titleColor: "#fff",
                bodyColor: "rgba(255,255,255,0.7)",
            },
        },
    };

    // ── DB storage estimate ───────────────────────────────────────────────────
    // Supabase free tier: 500 MB DB, 1 GB file storage, 50 000 monthly active users
    const DB_FREE_MB = 500;
    const rawViews = JSON.stringify(JSON.parse(localStorage.getItem("esp32-analytics-views") ?? "[]")).length;
    const rawEvents = JSON.stringify(JSON.parse(localStorage.getItem("esp32-analytics-events") ?? "[]")).length;
    const localKB = Math.round((rawViews + rawEvents) / 1024);

    return (
        <div className="space-y-6">
            {/* KPI pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatPill icon={Eye} label="Total Page Views" value={summary.totalViews} color="#3b82f6" />
                <StatPill icon={Users} label="Unique Sessions" value={summary.totalSessions} color="#8b5cf6" />
                <StatPill
                    icon={Activity}
                    label="Avg Views/Day (30d)"
                    value={summary.avgDailyViews}
                    color="#22c55e"
                />
                <StatPill
                    icon={summary.growthPct !== null && summary.growthPct >= 0 ? TrendingUp : TrendingDown}
                    label="Growth vs prev 30d"
                    value={summary.growthPct !== null ? `${summary.growthPct > 0 ? "+" : ""}${summary.growthPct}%` : "N/A"}
                    color={summary.growthPct !== null && summary.growthPct >= 0 ? "#22c55e" : "#ef4444"}
                    sub="Views this vs last 30 days"
                />
            </div>

            {/* Daily visits bar chart (14 days) */}
            <GlassCard index={0}>
                <GlassCardHeader
                    title="Daily Visits — Last 14 Days"
                    icon={<BarChart3 className="w-5 h-5" />}
                    subtitle="Page views and unique sessions"
                />
                <div className="h-52">
                    {summary.totalViews === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-2 text-white/30">
                            <BarChart3 className="w-8 h-8" />
                            <p className="text-sm">No visit data yet — browse around to start tracking!</p>
                        </div>
                    ) : (
                        <Bar data={barData} options={barOptions} />
                    )}
                </div>
            </GlassCard>

            {/* 30-day trend line */}
            <GlassCard index={1}>
                <GlassCardHeader
                    title="30-Day View Trend"
                    icon={<TrendingUp className="w-5 h-5" />}
                />
                <div className="h-40">
                    {summary.totalViews === 0 ? (
                        <div className="h-full flex items-center justify-center text-white/30 text-sm">
                            Start navigating to generate trend data
                        </div>
                    ) : (
                        <Line data={lineData} options={lineOptions} />
                    )}
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top pages */}
                <GlassCard index={2}>
                    <GlassCardHeader
                        title="Top Pages"
                        icon={<MousePointer className="w-5 h-5" />}
                        subtitle="Most visited routes"
                    />
                    {summary.topPages.length === 0 ? (
                        <p className="text-white/30 text-sm text-center py-6">No data yet</p>
                    ) : (
                        <div className="space-y-2.5 mt-2">
                            {summary.topPages.map((page, i) => {
                                const maxViews = summary.topPages[0]?.views ?? 1;
                                const pct = Math.round((page.views / maxViews) * 100);
                                return (
                                    <div key={page.path} className="flex items-center gap-2">
                                        <span className="text-white/25 text-xs font-mono w-4 text-right shrink-0">
                                            {i + 1}
                                        </span>
                                        <span className="text-white/70 text-xs font-mono truncate flex-1 min-w-0">
                                            {page.path || "/"}
                                        </span>
                                        <span className="text-white/40 text-xs shrink-0">{page.views}</span>
                                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden shrink-0">
                                            <div
                                                className="h-full rounded-full bg-blue-500/70"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </GlassCard>

                {/* Event breakdown doughnut */}
                <GlassCard index={3}>
                    <GlassCardHeader
                        title="Event Breakdown"
                        icon={<Activity className="w-5 h-5" />}
                        subtitle="Named analytics events"
                    />
                    <div className="h-44">
                        {topEvents.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-white/30 text-sm">
                                No events tracked yet
                            </div>
                        ) : (
                            <Doughnut data={doughnutData} options={doughnutOptions} />
                        )}
                    </div>
                    <p className="text-white/25 text-xs mt-3 text-right">
                        {events.length} total events tracked
                    </p>
                </GlassCard>
            </div>

            {/* Supabase free tier limits info */}
            <GlassCard index={4}>
                <GlassCardHeader
                    title="Storage &amp; Quota"
                    icon={<BarChart3 className="w-5 h-5" />}
                    subtitle="Supabase free tier limits"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                    {[
                        { label: "Database", limit: `${DB_FREE_MB} MB`, detail: "Free tier limit", color: "#3b82f6" },
                        { label: "File Storage", limit: "1 GB", detail: "Free tier limit", color: "#8b5cf6" },
                        { label: "Monthly Active Users", limit: "50 000", detail: "Free tier limit", color: "#22c55e" },
                    ].map((row) => (
                        <div
                            key={row.label}
                            className="rounded-xl p-4 text-center"
                            style={{ background: `${row.color}10`, border: `1px solid ${row.color}25` }}
                        >
                            <p className="text-lg font-bold" style={{ color: row.color }}>{row.limit}</p>
                            <p className="text-white/60 text-sm mt-0.5">{row.label}</p>
                            <p className="text-white/30 text-xs">{row.detail}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                    <span className="text-white/50 text-xs">Local analytics storage used</span>
                    <span className="text-white/70 text-xs font-mono">{localKB} KB</span>
                </div>
                <p className="text-white/25 text-xs mt-3">
                    Analytics are stored locally in your browser and optionally synced to Supabase <code>page_views</code> table.
                    To enable cloud analytics, run the SQL migration in <code>supabase/migrations/</code>.
                </p>
            </GlassCard>
        </div>
    );
}
