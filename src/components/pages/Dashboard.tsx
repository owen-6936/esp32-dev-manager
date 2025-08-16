import type { Project } from "../../types/project";
import Deadline from "../ui/dashboard/Deadline";
import Hero from "../ui/dashboard/Hero";
import MicroControllerFeatures from "../ui/dashboard/MicroControllerFeatures";
import QuickActions from "../ui/dashboard/QuickActions";
import RecentActivity from "../ui/dashboard/RecentActivity";
import Stat from "../ui/dashboard/Stat";

const projects: Project[] = [
  {
    id: "1",
    title: "Smart Home Lighting",
    description: "Automate lighting using IoT sensors.",
    category: ["iot", "automation", "sensors"],
    status: "in-progress",
    difficulty: "intermediate",
    startDate: "2025-08-01",
    deadline: "2025-08-20",
    githubUrl: "https://github.com/user/smart-lighting",
    components: [],
    progress: 60,
    estimatedTime: 40,
    tasks: [
      {
        id: "t1",
        title: "Setup sensors",
        status: "done",
        description: "Install and configure sensors in the house.",
        priority: "high",
      },
      {
        id: "t2",
        title: "Integrate app control",
        status: "in-progress",
        description: "Connect the lighting system to the mobile app.",
        priority: "medium",
      },
    ],
  },
  {
    id: "2",
    title: "Autonomous Delivery Robot",
    description: "Robot that navigates indoors to deliver packages.",
    category: ["robotics", "embedded_systems", "actuators"],
    status: "planning",
    difficulty: "advanced",
    startDate: "2025-08-10",
    deadline: "2025-09-15",
    components: [],
    tasks: [],
  },
  {
    id: "3",
    title: "Weather Station",
    description: "Collects temperature, humidity, and air quality data.",
    category: ["iot", "sensors", "data_processing"],
    status: "in-progress",
    difficulty: "beginner",
    startDate: "2025-07-20",
    deadline: "2025-08-12",
    progress: 90,
    components: [],
    tasks: [],
  },
  {
    id: "4",
    title: "Portfolio Website",
    description: "Personal website to showcase projects.",
    category: ["web_development"],
    status: "completed",
    difficulty: "beginner",
    startDate: "2025-06-01",
    completedDate: "2025-07-01",
    deadline: "2025-07-01",
    githubUrl: "https://github.com/user/portfolio",
    components: [],
    progress: 100,
    tasks: [],
  },
  {
    id: "5",
    title: "Wearable Health Monitor",
    description: "Tracks heart rate and activity in real-time.",
    category: ["embedded_systems", "iot", "sensors"],
    status: "in-progress",
    difficulty: "advanced",
    startDate: "2025-08-05",
    deadline: "2025-08-18",
    components: [],
    progress: 40,
    tasks: [],
  },
];

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
