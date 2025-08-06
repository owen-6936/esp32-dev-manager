import { motion } from "framer-motion";
import { type JournalEntry } from "../../../types/journal/journal";

export default function RecentActivity(
  journalEntries: JournalEntry[],
  cardVariants: any
) {
  return (
    <motion.div
      className="bg-white/10 rounded-xl p-6 border border-white/20 sm:w-[82%] mt-5 w-full hover:scale-105 transition-transform duration-300"
      variants={cardVariants}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      initial="hidden"
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {journalEntries.slice(0, 3).map((entry, i) => (
          <motion.div
            key={entry.id}
            className="bg-white/5 rounded-lg p-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
          >
            <div className="flex items-center space-x-2 mb-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  entry.type === "learning"
                    ? "bg-blue-400"
                    : entry.type === "problem"
                    ? "bg-red-400"
                    : entry.type === "progress"
                    ? "bg-green-400"
                    : "bg-yellow-400"
                }`}
              />
              <span className="text-white text-sm font-medium truncate">
                {entry.title}
              </span>
            </div>
            <p className="text-blue-200 text-xs">{entry.date}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
