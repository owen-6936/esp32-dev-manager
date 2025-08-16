import { projects } from "../../constants/projects";
import Deadline from "../ui/dashboard/Deadline";
import Hero from "../ui/dashboard/Hero";
import MicroControllerFeatures from "../ui/dashboard/MicroControllerFeatures";
import QuickActions from "../ui/dashboard/QuickActions";
import RecentActivity from "../ui/dashboard/RecentActivity";
import Stat from "../ui/dashboard/Stat";
import { Suspense, lazy } from "react";

const LazyESP32Visual = lazy(() => import("../ui/dashboard/ESP32Visual"));

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
    <main className="min-height-screen p-4 w-[90%] flex flex-col gap-8 sm:gap-12 mx-auto max-w-7xl">
      <Hero />
      <Suspense
        fallback={
          <div className="text-center text-white">
            Loading ESP32 3D Model...
          </div>
        }
      >
        <LazyESP32Visual />
      </Suspense>
      <Stat
        budgetUsed={stats.budgetUsed}
        totalProjects={stats.totalProjects}
        completedProjects={stats.completedProjects}
        totalComponents={stats.totalComponents}
        totalValue={stats.totalValue}
        timeSpent={stats.timeSpent}
      />
      <QuickActions />
      <RecentActivity />
      <Deadline projects={projects} />
      <MicroControllerFeatures />
    </main>
  );
}
