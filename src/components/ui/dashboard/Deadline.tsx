import { motion } from "framer-motion";
import Card from "../../Card";
import type { Project } from "../../../types/project";
import { CalendarDays, AlertTriangle, Clock, CheckCircle } from "lucide-react";

export default function Deadline({ projects }: { projects: Project[] }) {
  return (
    <Card index={1}>
      <Card.Header title="Upcoming Deadlines" />
      <div className="space-y-3">
        {projects
          .filter((p) => p.deadline && p.status !== "completed")
          .sort(
            (a, b) =>
              new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime(),
          )
          .slice(0, 3)
          .map((project, i, arr) => {
            const daysLeft = Math.ceil(
              (new Date(project.deadline!).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24),
            );

            // Calculate progress if startDate exists, otherwise fallback
            let progress = 0;
            // Fallback progress estimation: each day left reduces progress by this percentage
            const PROGRESS_DECREMENT_PER_DAY = 5; // 5% per day as an arbitrary estimate

            if (project.startDate) {
              const totalDuration =
                new Date(project.deadline!).getTime() -
                new Date(project.startDate).getTime();
              const elapsed =
                Date.now() - new Date(project.startDate).getTime();
              progress = Math.min(
                100,
                Math.max(0, (elapsed / totalDuration) * 100),
              );
            } else {
              // If no startDate, estimate progress by subtracting a fixed percentage per day left
              progress = Math.max(
                0,
                Math.min(100, 100 - daysLeft * PROGRESS_DECREMENT_PER_DAY),
              );
            }

            // Status label + icon
            let statusLabel = "";
            let statusIcon = null;
            let statusColor = "";
            if (daysLeft < 0) {
              statusLabel = "Overdue";
              statusIcon = <AlertTriangle className="w-3 h-3" />;
              statusColor = "bg-red-500/20 text-red-300";
            } else if (daysLeft <= 7) {
              statusLabel = "Due Soon";
              statusIcon = <Clock className="w-3 h-3" />;
              statusColor = "bg-orange-500/20 text-orange-300";
            } else {
              statusLabel = "On Track";
              statusIcon = <CheckCircle className="w-3 h-3" />;
              statusColor = "bg-green-500/20 text-green-300";
            }

            return (
              <Card.Body key={project.id} className="p-3">
                <motion.div
                  className="bg-white/5 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  variants={{
                    hidden: { opacity: 0, y: 10, scale: 0.98 },
                    visible: { opacity: 1, y: 0, scale: 1 },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                >
                  {/* Left side: Title + Date */}
                  <div className="flex flex-col">
                    <span className="text-white text-sm sm:text-base font-semibold truncate">
                      {project.title || "Untitled Project"}
                    </span>
                    <span className="text-blue-200 text-xs sm:text-sm flex items-center gap-1 mt-1">
                      <CalendarDays className="w-3 h-3 text-blue-300" />
                      {new Date(project.deadline!).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Right side: Status + Progress */}
                  <div className="flex flex-col items-end sm:items-center space-y-1">
                    <span
                      className={`text-xs sm:text-sm px-2 py-1 rounded-full font-medium min-w-[80px] flex items-center justify-center gap-1 ${statusColor}`}
                    >
                      {statusIcon}
                      {statusLabel}
                    </span>

                    {/* Progress bar */}
                    <div className="w-24 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          daysLeft < 0
                            ? "bg-red-500"
                            : daysLeft <= 7
                              ? "bg-orange-400"
                              : "bg-green-400"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Divider between items */}
                {i < arr.length - 1 && (
                  <div className="border-t border-white/10 mt-3" />
                )}
              </Card.Body>
            );
          })}

        {projects.filter((p) => p.deadline && p.status !== "completed")
          .length === 0 && (
          <p className="text-blue-200 text-sm">No upcoming deadlines</p>
        )}
      </div>
    </Card>
  );
}
