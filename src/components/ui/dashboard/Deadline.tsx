import { motion } from "framer-motion";
import type { Project } from "../../../types/project/project";

export default function Deadline(
  props: { projects: Project[] },
  cardVariants: any
) {
  return (
    <motion.div
      className="bg-white/10 rounded-xl p-6 border border-white/20 sm:w-[82%] w-full hover:scale-105 transition-transform duration-300 mt-5"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">Upcoming Deadlines</h3>
      <div className="space-y-3">
        {props.projects
          .filter((p) => p.deadline && p.status !== "completed")
          .sort(
            (a, b) =>
              new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
          )
          .slice(0, 3)
          .map((project, i) => {
            const daysLeft = Math.ceil(
              (new Date(project.deadline!).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return (
              <motion.div
                key={project.id}
                className="bg-white/5 rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium truncate flex-1 mr-2">
                    {project.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                      daysLeft < 0
                        ? "bg-red-500/20 text-red-300"
                        : daysLeft <= 7
                        ? "bg-orange-500/20 text-orange-300"
                        : "bg-green-500/20 text-green-300"
                    }`}
                  >
                    {daysLeft < 0 ? "Overdue" : `${daysLeft} days`}
                  </span>
                </div>
                <p className="text-blue-200 text-xs">
                  {project.deadline
                    ? new Date(project.deadline).toLocaleDateString()
                    : ""}
                </p>
              </motion.div>
            );
          })}
        {props.projects.filter((p) => p.deadline && p.status !== "completed")
          .length === 0 && (
          <p className="text-blue-200 text-sm">No upcoming deadlines</p>
        )}
      </div>
    </motion.div>
  );
}
