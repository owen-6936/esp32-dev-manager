import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
    Wrench, Code, Package, FileText, ChartColumn, Cpu,
} from "lucide-react";
import Project from "./Project";
import Inventory from "./Inventory";
import Journal from "./Journal";
import Analytics from "./Analytics";
import PinMapper from "./PinMapper";

type WorkshopTab = "projects" | "components" | "journal" | "analytics" | "pins";

const tabs: { key: WorkshopTab; label: string; icon: typeof Code }[] = [
    { key: "projects", label: "My Projects", icon: Code },
    { key: "components", label: "Components", icon: Package },
    { key: "pins", label: "Pin Mapper", icon: Cpu },
    { key: "journal", label: "Journal", icon: FileText },
    { key: "analytics", label: "Analytics", icon: ChartColumn },
];

export default function Workshop() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<WorkshopTab>(
        (searchParams.get("tab") as WorkshopTab | null) ?? "projects",
    );

    useEffect(() => {
        const tab = searchParams.get("tab") as WorkshopTab | null;
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
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <Wrench className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">Workshop</h1>
                        <p className="text-blue-200/50 text-xs">Projects, components & development journal</p>
                    </div>
                </motion.div>

                <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex-1 justify-center ${activeTab === tab.key
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
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
            {activeTab === "projects" && <Project />}
            {activeTab === "components" && <Inventory />}
            {activeTab === "pins" && <PinMapper />}
            {activeTab === "journal" && <Journal />}
            {activeTab === "analytics" && <Analytics />}
        </div>
    );
}
