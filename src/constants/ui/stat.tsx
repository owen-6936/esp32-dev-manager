import {
  Clock,
  Code,
  DollarSign,
  Package,
  Timer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { StatCardProps } from "../../types/ui/stat";

export const statCards = ({
  totalProjects,
  completedProjects,
  totalComponents,
  totalValue,
  timeSpent,
  budgetUsed,
}: StatCardProps) => [
  {
    title: "Total Projects",
    value: totalProjects,
    subtitle: `${completedProjects} completed`,
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
    subtitle: `$${totalValue.toFixed(2)} value`,
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
    subtitle: `Avg: ${Math.round(timeSpent / (totalProjects || 1))}h/project`,
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
    subtitle: `Avg: $${Math.round(budgetUsed / (totalProjects || 1)).toFixed(
      2
    )}/project`,
    icon: <DollarSign className="w-6 h-6 text-purple-400" />,
    iconBg: "bg-purple-500/20",
    valueColor: "text-white",
    subtitleColor: "text-yellow-400",
    subtitleIcon: <TrendingDown className="w-3 h-3 mr-1" />,
    subtitlePrefix: "",
  },
];
