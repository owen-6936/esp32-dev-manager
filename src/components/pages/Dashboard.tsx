import Hero from "../ui/dashboard/Hero";
import QuickActions from "../ui/dashboard/QuickActions";
import Stat from "../ui/dashboard/Stat";

export default function Dashboard() {
  const stats = {
    budgetUsed: 1000,
    totalProjects: 5,
    completedProjects: 3,
    totalComponents: 20,
    totalValue: 5000,
    timeSpent: 120,
  };

  return (
    <main className="min-height-screen p-4 w-[90%] flex flex-col gap-12 mx-auto">
      <Hero />
      <Stat
        budgetUsed={stats.budgetUsed}
        totalProjects={stats.totalProjects}
        completedProjects={stats.completedProjects}
        totalComponents={stats.totalComponents}
        totalValue={stats.totalValue}
        timeSpent={stats.timeSpent}
      />
      <QuickActions />
    </main>
  );
}
