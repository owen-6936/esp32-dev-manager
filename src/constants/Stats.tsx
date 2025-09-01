import {
    Clock,
    Code,
    DollarSign,
    Package,
    Timer,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

export interface StatProps {
    totalProjects: number;
    completedProjects: number;
    totalComponents: number;
    totalValue: number;
    timeSpent: number;
    budgetUsed: number;
}

export const stats = ({
    totalProjects,
    completedProjects,
    totalComponents,
    totalValue,
    timeSpent,
    budgetUsed,
}: StatProps) => [
    {
        title: "Total Projects",
        value: totalProjects,
        subtitle:
            completedProjects > 0
                ? `${completedProjects} completed`
                : "No projects",
        icon: <Code className="w-6 h-6 text-blue-400" />,
        iconBg: "bg-blue-500/20",
        valueColor: "text-white",
        subtitleColor: "text-green-400",
        subtitleIcon: <TrendingUp className="w-3 h-3 mr-1" />,
        subtitlePrefix: "",
    },
    {
        title: "Components",
        value: totalComponents,
        subtitle:
            totalProjects > 0
                ? `$${totalValue.toFixed(2)} value`
                : "No projects",
        icon: <Package className="w-6 h-6 text-green-400" />,
        iconBg: "bg-green-500/20",
        valueColor: "text-white",
        subtitleColor: "text-blue-400",
        subtitleIcon: <DollarSign className="w-3 h-3 mr-1" />,
        subtitlePrefix: "",
    },
    {
        title: "Time Invested",
        value: `${timeSpent}h`,
        subtitle:
            totalProjects > 0
                ? `Avg: ${Math.round(timeSpent / totalProjects)}h/project`
                : "No projects",
        icon: <Timer className="w-6 h-6 text-orange-400" />,
        iconBg: "bg-orange-500/20",
        valueColor: "text-white",
        subtitleColor: "text-purple-400",
        subtitleIcon: <Clock className="w-3 h-3 mr-1" />,
        subtitlePrefix: "",
    },
    {
        title: "Budget Used",
        value: `$${budgetUsed.toFixed(2)}`,
        subtitle:
            totalProjects > 0
                ? `Avg: $${(budgetUsed / totalProjects).toFixed(2)}/project`
                : "No projects",
        icon: <DollarSign className="w-6 h-6 text-purple-400" />,
        iconBg: "bg-purple-500/20",
        valueColor: "text-white",
        subtitleColor: "text-yellow-400",
        subtitleIcon: <TrendingDown className="w-3 h-3 mr-1" />,
        subtitlePrefix: "",
    },
];
