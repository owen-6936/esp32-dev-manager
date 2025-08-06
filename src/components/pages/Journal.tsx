import { Plus } from "lucide-react";
import { useState } from "react";
import { useJournalStore } from "../../store/journal/journal";
import Lottie from "lottie-react";
import emptyStateAnimation from "../../assets/lottie/empty-state.json";
import emptyJournalAnimation from "../../assets/lottie/empty-journal.json";
import useMediaQuery from "../../hooks/useMediaQuery";

export default function Journal() {
  const [showAddJournal, setShowAddJournal] = useState(false);
  const journalEntries = useJournalStore((state) => state.journalEntries);
  return (
    <div className="space-y-6 min-h-screen p-6">
      <div className="flex gap-4 items-center justify-between">
        <h2 className="text-xl sm:text-3xl font-bold text-white">
          Development Journal
        </h2>
        <button
          onClick={() => setShowAddJournal(true)}
          className="bg-gradient-btn flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span className="text-sm whitespace-nowrap">Add Entry</span>
        </button>
      </div>

      {journalEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
          {useMediaQuery("(min-width: 640px)") ? (
            <Lottie
              animationData={emptyStateAnimation}
              className="w-60 aspect-square"
              loop
              autoplay
            />
          ) : (
            <Lottie
              animationData={emptyJournalAnimation}
              className="w-60 aspect-square"
              loop
              autoplay
            />
          )}
          <h3 className="text-white text-xl sm:text-2xl font-semibold mt-4">
            Nothing Logged Yet
          </h3>
          <p className="text-blue-200 text-sm sm:text-base mt-2">
            Your development journal is empty. Let’s add your first entry!
          </p>
          <button
            onClick={() => setShowAddJournal(true)}
            className="mt-6 bg-gradient-btn flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm whitespace-nowrap">Add Entry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {journalEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      entry.type === "learning"
                        ? "bg-blue-400"
                        : entry.type === "problem"
                        ? "bg-red-400"
                        : entry.type === "progress"
                        ? "bg-green-400"
                        : "bg-yellow-400"
                    }`}
                  ></div>
                  <h3 className="text-xl font-bold text-white">
                    {entry.title}
                  </h3>
                  <span className="bg-white/10 text-blue-200 px-2 py-1 rounded text-xs capitalize">
                    {entry.type}
                  </span>
                </div>
                <span className="text-blue-200 text-sm">{entry.date}</span>
              </div>

              <p className="text-blue-200 mb-4">{entry.content}</p>

              {entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
