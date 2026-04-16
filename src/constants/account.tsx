import Profile from "../components/ui/account/Profile";
import Stats from "../components/ui/account/Stats";
import Achievements from "../components/ui/account/Achievements";
import Preferences from "../components/ui/account/Preferences";
import Security from "../components/ui/account/Security";
import DataAndPrivacy from "../components/ui/account/DataAndPrivacy";
import MyKit from "../components/ui/account/MyKit";
import { Award, Clock, Code, TrendingUp, Zap } from "lucide-react";
import type { ProfileProps } from "../types/account/profile";
import type { StatProps } from "../types/account/stats";

export function getAccountTabs(profile: ProfileProps, statsData: StatProps) {
    return [
        { key: "profile", title: "Profile", panel: <Profile {...profile} /> },
        { key: "kit", title: "My Kit", panel: <MyKit /> },
        { key: "stats", title: "Statistics", panel: <Stats {...statsData} /> },
        { key: "achievements", title: "Achievements", panel: <Achievements /> },
        { key: "preferences", title: "Preferences", panel: <Preferences /> },
        { key: "security", title: "Security", panel: <Security /> },
        { key: "data", title: "Data & Privacy", panel: <DataAndPrivacy /> },
    ];
}

export const stats = ({
    totalProjects,
    completedProjects,
    timeSpent,
    streakDays,
    achievements,
}: {
    totalProjects: number;
    completedProjects: number;
    timeSpent: number;
    streakDays: number;
    achievements: number;
}) => [
        {
            title: "Total Projects",
            value: totalProjects,
            icon: Code,
            iconColor: "text-blue-400",
            iconBg: "bg-blue-500/20",
            subtitle: `${completedProjects} completed`,
            subtitleColor: "text-green-400",
            subtitleIcon: TrendingUp,
        },
        {
            title: "Time Invested",
            value: timeSpent,
            icon: Clock,
            iconColor: "text-orange-400",
            iconBg: "bg-orange-500/20",
            subtitle: "Development time",
            subtitleColor: "text-purple-400",
            subtitleIcon: Clock,
        },
        {
            title: "Current Streak",
            value: streakDays,
            icon: Zap,
            iconColor: "text-yellow-400",
            iconBg: "bg-yellow-500/20",
            subtitle: "Days active",
            subtitleColor: "text-green-400",
            subtitleIcon: Zap,
        },
        {
            title: "Achievements",
            value: achievements,
            icon: Award,
            iconColor: "text-purple-400",
            iconBg: "bg-purple-500/20",
            subtitle: "Unlocked badges",
            subtitleColor: "text-blue-400",
            subtitleIcon: Award,
        },
    ];
