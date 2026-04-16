import {
    Cpu,
    Activity,
    Wrench,
    GraduationCap,
    User,
    Shield,
    LogIn,
    Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import useProgressStore, { getRank, getLevel } from "../store/progress";

type ActiveTabType = "dashboard" | "workshop" | "learn" | "account" | "admin" | "login" | "leaderboard";

export default function Navbar() {
    const [activeTab, setActiveTab] = useState<ActiveTabType>("dashboard");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const { user, isAdmin } = useAuth();
    const { totalXp } = useProgressStore();

    const DRAWER_ANIMATION_DURATION = 150;

    const toggleDrawer = () => {
        if (!drawerOpen) {
            setDrawerOpen(true);
            setShowOverlay(true);
        } else {
            setDrawerOpen(false);
            setTimeout(() => setShowOverlay(false), DRAWER_ANIMATION_DURATION);
        }
    };

    const location = useLocation();

    useEffect(() => {
        const segment = location.pathname.split("/")[1] || "dashboard";
        // Map old routes and sub-routes to the correct tab
        const tabMap: Record<string, ActiveTabType> = {
            dashboard: "dashboard",
            workshop: "workshop",
            project: "workshop",
            inventory: "workshop",
            journal: "workshop",
            learn: "learn",
            tutorials: "learn",
            roadmap: "learn",
            learning: "learn",
            analytics: "learn",
            leaderboard: "leaderboard",
            account: "account",
            admin: "admin",
            login: "login",
        };
        setActiveTab(tabMap[segment] ?? "dashboard");
        setDrawerOpen(false);
    }, [location]);

    useEffect(() => {
        if (!drawerOpen) setShowOverlay(false);
    }, [drawerOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setDrawerOpen(false);
                setShowOverlay(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menuItems = [
        { key: "dashboard" as const, label: "Dashboard", icon: Activity, path: "/" },
        { key: "workshop" as const, label: "Workshop", icon: Wrench, path: "/workshop" },
        { key: "learn" as const, label: "Learn", icon: GraduationCap, path: "/learn" },
        { key: "leaderboard" as const, label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
        ...(isAdmin
            ? [{ key: "admin" as const, label: "Admin", icon: Shield, path: "/admin" }]
            : []),
        ...(user
            ? [{ key: "account" as const, label: "Account", icon: User, path: "/account" }]
            : [{ key: "login" as const, label: "Login", icon: LogIn, path: "/login" }]),
    ];

    return (
        <nav className="bg-gradient flex gap-3 items-center p-4 shadow-lg h-20 sticky top-0 z-50">
            {/* Logo */}
            <Link to="/" className="bg-gradient-btn p-2 md:p-4 rounded-lg shadow-lg w-max shrink-0">
                <Cpu className="w-6 h-6 text-white" />
            </Link>

            {/* Heading */}
            <div className="flex-1 text-white min-w-0">
                <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap text-left truncate">
                    ESP32 S3 Journey
                </h2>
                <p className="text-blue-200 text-sm hidden md:block text-left">
                    Complete embedded systems development tracker
                </p>
            </div>

            {/* XP Chip (shown when user has XP) */}
            {totalXp > 0 && (
                <Link
                    to="/leaderboard"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all shrink-0"
                >
                    <span className="text-sm leading-none">{getRank(totalXp).icon}</span>
                    <span className="text-yellow-300/80 text-xs font-mono">Lv.{getLevel(totalXp)}</span>
                    <span className="text-yellow-400 text-xs font-bold">{totalXp} XP</span>
                </Link>
            )}

            {/* Desktop menu */}
            <div className="hidden sm:flex items-center gap-1">
                {menuItems.map(({ key, label, icon: Icon, path }) => (
                    <Link
                        key={key}
                        to={path}
                        className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all text-sm ${activeTab === key
                            ? "bg-blue-500 text-white shadow-lg"
                            : "text-blue-200 hover:bg-white/10"
                            }`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="hidden lg:inline">{label}</span>
                    </Link>
                ))}
            </div>

            {/* Mobile menu toggle */}
            <button
                onClick={toggleDrawer}
                className="sm:hidden p-2.5 bg-indigo-500 text-white rounded-md shadow-lg cursor-pointer hover:bg-indigo-500/80 active:translate-y-[1px] active:scale-[0.98] transition-transform duration-75 shrink-0"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-5 h-5 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile Drawer */}
            <div
                className={`fixed inset-0 z-50 sm:hidden transition-opacity duration-200 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleDrawer}
            >
                {/* Overlay */}
                <div
                    className={`fixed inset-0 bg-black/40 transition-opacity duration-75 ${drawerOpen ? "opacity-100" : "opacity-0"
                        } ${showOverlay ? "pointer-events-auto" : "pointer-events-none"}`}
                />

                {/* Drawer Panel */}
                <div
                    className={`fixed top-0 left-0 bg-gradient text-white w-[70%] h-full shadow-lg p-4 border-l border-white/20 transform transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-[-100%]"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={toggleDrawer}
                        className="scale-120 absolute top-6 right-6 text-white cursor-pointer active:translate-y-[1px] active:scale-[0.98] transition-transform duration-75"
                    >
                        ✕
                    </button>

                    <div className="bg-gradient-btn p-2 rounded-lg shadow-lg w-max m-2">
                        <Cpu className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex flex-col space-y-2 mt-8">
                        {menuItems.map(({ key, label, icon: Icon, path }) => (
                            <Link
                                key={key}
                                to={path}
                                className={`px-3 py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all duration-150 active:translate-y-[1px] active:scale-[0.98] ${activeTab === key
                                    ? "bg-blue-500 text-white shadow-lg"
                                    : "text-blue-200 hover:bg-white/10"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
