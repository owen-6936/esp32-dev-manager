import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, Zap, Users } from "lucide-react";
import GlassCard, { GlassCardHeader } from "../ui/glass/GlassCard";
import GlassBadge from "../ui/glass/GlassBadge";
import { fetchLeaderboard, type LeaderboardEntry } from "../../services/progressService";
import { getRank, getLevel, RANK_THRESHOLDS, XP_PER_DIFFICULTY } from "../../store/progress";
import useProgressStore from "../../store/progress";
import { useAuth } from "../../contexts/AuthContext";

export default function Leaderboard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { totalXp, completedCount } = useProgressStore();

    useEffect(() => {
        setLoading(true);
        fetchLeaderboard()
            .then(setEntries)
            .finally(() => setLoading(false));
    }, []);

    const myRank = getRank(totalXp);
    const myLevel = getLevel(totalXp);

    return (
        <div className="px-4 md:px-8 py-8 min-height-screen space-y-8 max-w-4xl mx-auto">
            {/* ── Hero ───────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg glow-md">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">Leaderboard</h1>
                            <p className="text-blue-200/60 text-sm mt-0.5">
                                Top ESP32 builders ranked by XP
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── Your Stats Card ────────────────────────────────────── */}
            <GlassCard variant="strong" padding="p-5">
                <div className="flex items-center gap-4 flex-wrap">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold border"
                        style={{
                            backgroundColor: `${myRank.color}15`,
                            borderColor: `${myRank.color}30`,
                        }}
                    >
                        {myRank.icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-white/50 text-xs mb-0.5">Your Rank</p>
                        <p className="text-white font-bold text-lg" style={{ color: myRank.color }}>
                            {myRank.rank}
                        </p>
                        <p className="text-white/40 text-xs">Level {myLevel}</p>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        <div className="text-center">
                            <p className="text-yellow-400 font-bold text-xl">{totalXp}</p>
                            <p className="text-white/40 text-xs">Total XP</p>
                        </div>
                        <div className="text-center">
                            <p className="text-green-400 font-bold text-xl">{completedCount()}</p>
                            <p className="text-white/40 text-xs">Projects</p>
                        </div>
                    </div>
                    {!user && (
                        <span className="text-white/30 text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                            Sign in to appear on the global leaderboard
                        </span>
                    )}
                </div>
            </GlassCard>

            {/* ── Rank Legend ────────────────────────────────────────── */}
            <GlassCard padding="p-4">
                <GlassCardHeader title="Ranks" icon={<Medal className="w-4 h-4" />} />
                <div className="flex flex-wrap gap-2">
                    {[...RANK_THRESHOLDS].reverse().map((r) => (
                        <div
                            key={r.rank}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs"
                            style={{
                                borderColor: `${r.color}30`,
                                backgroundColor: `${r.color}10`,
                                color: r.color,
                            }}
                        >
                            <span>{r.icon}</span>
                            <span className="font-medium">{r.rank}</span>
                            <span className="opacity-50">{r.xp >= 1000 ? `${r.xp / 1000}k` : r.xp}+ XP</span>
                        </div>
                    ))}
                </div>
            </GlassCard>

            {/* ── Global Table ───────────────────────────────────────── */}
            <GlassCard variant="strong" padding="p-0 overflow-hidden">
                <div className="p-5 pb-0">
                    <GlassCardHeader
                        title="Global Rankings"
                        icon={<Users className="w-5 h-5" />}
                        subtitle={loading ? "Loading…" : `${entries.length} builders`}
                    />
                </div>

                {loading ? (
                    <div className="p-5 space-y-2">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                ) : entries.length === 0 ? (
                    <div className="p-8 text-center">
                        <Trophy className="w-10 h-10 mx-auto text-white/15 mb-3" />
                        <p className="text-white/40 text-sm">No one on the leaderboard yet.</p>
                        <p className="text-white/25 text-xs mt-1">
                            Complete projects to earn XP and be the first!
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {entries.map((entry, i) => {
                            const isMe = user?.id === entry.userId;
                            const rank = getRank(entry.totalXp);
                            return (
                                <motion.div
                                    key={entry.userId}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className={`flex items-center gap-4 px-5 py-3 transition-colors ${isMe ? "bg-blue-500/10" : "hover:bg-white/3"
                                        }`}
                                >
                                    {/* Rank number */}
                                    <div className="w-8 text-center shrink-0">
                                        {i === 0 ? (
                                            <span className="text-xl">🥇</span>
                                        ) : i === 1 ? (
                                            <span className="text-xl">🥈</span>
                                        ) : i === 2 ? (
                                            <span className="text-xl">🥉</span>
                                        ) : (
                                            <span className="text-white/30 font-mono text-sm">
                                                #{i + 1}
                                            </span>
                                        )}
                                    </div>

                                    {/* Avatar */}
                                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-sm font-bold shrink-0">
                                        {entry.avatarUrl ? (
                                            <img
                                                src={entry.avatarUrl}
                                                className="w-full h-full rounded-full object-cover"
                                                alt=""
                                                referrerPolicy="no-referrer"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <span className="text-white/50">
                                                {entry.displayName.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Name + rank badge */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className={`font-medium text-sm truncate ${isMe ? "text-blue-300" : "text-white"}`}
                                            >
                                                {entry.displayName}
                                                {isMe && (
                                                    <span className="text-blue-400/70 text-xs ml-1">(you)</span>
                                                )}
                                            </span>
                                            <span className="text-xs shrink-0" style={{ color: rank.color }}>
                                                {rank.icon} {entry.rankName}
                                            </span>
                                        </div>
                                        <p className="text-white/30 text-xs">
                                            Lv.{getLevel(entry.totalXp)} · {entry.projectsCompleted} projects
                                        </p>
                                    </div>

                                    {/* XP */}
                                    <div className="text-right shrink-0">
                                        <p className="text-yellow-400 font-bold text-sm flex items-center gap-1 justify-end">
                                            <Star className="w-3.5 h-3.5" />
                                            {entry.totalXp.toLocaleString()}
                                        </p>
                                        <p className="text-white/25 text-xs">XP</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </GlassCard>

            {/* XP Guide */}
            <GlassCard padding="p-5">
                <GlassCardHeader
                    title="How XP Works"
                    icon={<Zap className="w-4 h-4 text-yellow-400" />}
                />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {(
                        [
                            { diff: 1, label: "Beginner" },
                            { diff: 2, label: "Easy" },
                            { diff: 3, label: "Intermediate" },
                            { diff: 4, label: "Advanced" },
                            { diff: 5, label: "Expert" },
                        ] as const
                    ).map((d) => (
                        <div
                            key={d.diff}
                            className="text-center p-3 rounded-xl bg-white/5 border border-white/8"
                        >
                            <GlassBadge size="sm" color="#6b7280">
                                Difficulty {d.diff}
                            </GlassBadge>
                            <p className="text-yellow-400 font-bold mt-2">{XP_PER_DIFFICULTY[d.diff] ?? 0} XP</p>
                            <p className="text-white/30 text-xs mt-0.5">{d.label}</p>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
}
