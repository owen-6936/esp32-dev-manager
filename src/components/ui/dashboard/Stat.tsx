import { stats } from "../../../constants/Stats";
import StatCard from "../../statCard";

interface StatProps {
  totalProjects: number;
  completedProjects: number;
  totalComponents: number;
  totalValue: number;
  timeSpent: number;
  budgetUsed: number;
}

export default function Stat({
  budgetUsed,
  totalProjects,
  completedProjects,
  totalComponents,
  totalValue,
  timeSpent,
}: StatProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats({
        budgetUsed,
        totalProjects,
        completedProjects,
        totalComponents,
        totalValue,
        timeSpent,
      }).map((stat, index) => (
        <StatCard key={index} index={index} {...stat} />
      ))}
    </section>
  );
}
