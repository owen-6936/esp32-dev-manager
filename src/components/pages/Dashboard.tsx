import { projects } from "../../constants/projects";
import Deadline from "../ui/dashboard/Deadline";
import Hero from "../ui/dashboard/Hero";
import MicroControllerFeatures from "../ui/dashboard/MicroControllerFeatures";
import QuickActions from "../ui/dashboard/QuickActions";
import RecentActivity from "../ui/dashboard/RecentActivity";
import Stat from "../ui/dashboard/Stat";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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

  // Intersection observer for lazy mounting
  const [load3D, setLoad3D] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoad3D(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-height-screen p-4 w-[90%] flex flex-col gap-8 sm:gap-12 mx-auto max-w-7xl">
      <Hero />
      {/* ESP32 3D Viewer Lazy Section */}
      <div ref={ref} className="min-h-[400px] flex items-center justify-center">
        {load3D ? (
          <Suspense
            fallback={
              <div className="text-center text-blue-300 animate-pulse">
                Loading ESP32 3D Model...
              </div>
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full"
            >
              <LazyESP32Visual />
            </motion.div>
          </Suspense>
        ) : (
          <div className="text-center text-blue-300 animate-pulse">
            Preparing 3D Viewer...
          </div>
        )}
      </div>
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
