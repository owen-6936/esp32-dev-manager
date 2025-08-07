import "../../styles/pages/dashboard.css";
import { useStatsStore } from "../../store/project/stats";
import { useProjectStore } from "../../store/project/project";
import { useJournalStore } from "../../store/journal/journal";
import { statCards } from "../../constants/ui/stat";
import Stat from "../ui/dashboard/Stat";
import { useShallow } from "zustand/shallow";
import Hero from "../ui/dashboard/Hero";
import RecentActivity from "../ui/dashboard/RecentActivity";
import type { JournalEntry } from "../../types/journal/journal";
import QuickActions from "../ui/dashboard/QuickActions";
import Deadline from "../ui/dashboard/Deadline";
import Features from "../ui/dashboard/Features";

export default function Dashboard() {
  const projects = useProjectStore((state) => state.projects);

  const {
    totalProjects,
    completedProjects,
    totalComponents,
    totalValue,
    timeSpent,
    budgetUsed,
  } = useStatsStore(
    useShallow((state) => ({
      totalProjects: state.totalProjects,
      completedProjects: state.completedProjects,
      totalComponents: state.totalComponents,
      totalValue: state.totalValue,
      timeSpent: state.timeSpent,
      budgetUsed: state.budgetUsed,
    }))
  );

  const journalEntries: JournalEntry[] = useJournalStore(
    (state) => state.journalEntries
  );

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  return (
    <main className="dashboard">
      <Hero />
      <div className="dashboard-stats">
        {statCards({
          totalProjects,
          completedProjects,
          totalComponents,
          totalValue,
          timeSpent,
          budgetUsed,
        }).map((card, index) => (
          <Stat
            key={index}
            index={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            iconBg={card.iconBg}
            valueColor={card.valueColor}
            subtitleColor={card.subtitleColor}
            subtitleIcon={card.subtitleIcon}
            cardVariants={cardVariants}
          />
        ))}
      </div>
      <div className="dashboard-cards">
        <QuickActions cardVariants={cardVariants} />
        <RecentActivity
          journalEntries={journalEntries}
          cardVariants={cardVariants}
        />
        <Deadline projects={projects} cardVariants={cardVariants} />
      </div>
      <Features />
    </main>
  );
}
