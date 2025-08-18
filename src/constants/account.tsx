import Profile from "../components/ui/account/Profile";
import Stats from "../components/ui/account/Stats";
import Achievements from "../components/ui/account/Achievements";
import Preferences from "../components/ui/account/Preferences";
import Security from "../components/ui/account/Security";
import DataAndPrivacy from "../components/ui/account/DataAndPrivacy";
import { Award, Clock, Code, Package, TrendingUp, Zap } from "lucide-react";

const profileProps = {
  name: "John Doe",
  jobTitle: "Software Engineer",
  company: "Acme Corp",
  bio: "Lorem ipsum dolor sit amet.",
  email: "john.doe@example.com",
  phone: "(123) 456-7890",
  location: "New York, NY",
  website: "https://johndoe.com",
  github: "https://github.com/johndoe",
  joinDate: "January 1, 2020",
};

const statsProps = {
  totalProjects: 10,
  completedProjects: 8,
  totalComponents: 25,
  timeSpent: 120,
  streakDays: 5,
  achievements: 3,
};

export const accountTabs = [
  { key: "profile", title: "Profile", panel: <Profile {...profileProps} /> },
  { key: "stats", title: "Statistics", panel: <Stats {...statsProps} /> },
  { key: "achievements", title: "Achievements", panel: <Achievements /> },
  { key: "preferences", title: "Preferences", panel: <Preferences /> },
  { key: "security", title: "Security", panel: <Security /> },
  { key: "data", title: "Data & Privacy", panel: <DataAndPrivacy /> },
];

export const stats = ({
  totalProjects,
  completedProjects,
  totalComponents,
  timeSpent,
  streakDays,
  achievements,
}: {
  totalProjects: number;
  completedProjects: number;
  totalComponents: number;
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
    title: "Components",
    value: totalComponents,
    icon: Package,
    iconColor: "text-green-400",
    iconBg: "bg-green-500/20",
    subtitle: "Inventory managed",
    subtitleColor: "text-blue-400",
    subtitleIcon: Package,
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
