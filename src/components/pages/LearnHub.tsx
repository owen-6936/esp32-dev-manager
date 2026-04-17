import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
    GraduationCap, BookOpen, Map, TrendingUp,
} from "lucide-react";
import TutorialBrowser from "./TutorialBrowser";
import LearningRoadmap from "./LearningRoadmap";
import Learning from "./Learning";

type LearnTab = "tutorials" | "roadmap" | "progress";

const tabs: { key: LearnTab; label: string; icon: typeof BookOpen }[] = [
    { key: "tutorials", label: "Tutorials", icon: BookOpen },
    { key: "roadmap", label: "Roadmap", icon: Map },
    { key: "progress", label: "Progress", icon: TrendingUp },
];

export default function LearnHub() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<LearnTab>(
        (searchParams.get("tab") as LearnTab | null) ?? "tutorials",
    );

    useEffect(() => {
        const tab = searchParams.get("tab") as LearnTab | null;
        if (tab && tabs.some((t) => t.key === tab)) setActiveTab(tab);
    }, [searchParams]);

    return (
        <div className="min-height-screen">
            {/* ── Header + Tabs ─────────────────────────────────────── */}
            <div className="px-4 md:px-8 pt-6 pb-0">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-4"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Learn</h1>
                        <p className="text-blue-200/50 text-xs">Tutorials, roadmaps & learning progress</p>
                    </div>
                </motion.div>

                <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex-1 justify-center ${activeTab === tab.key
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab Content ──────────────────────────────────────── */}
            {activeTab === "tutorials" && <TutorialBrowser />}
            {activeTab === "roadmap" && <LearningRoadmap />}
            {activeTab === "progress" && <Learning />}
        </div>
    );
}
