import { useState } from "react";
import { useJournalStore } from "../../../store/journal/journal";
import type { JournalEntry } from "../../../types/journal/journal";
import { useProjectStore } from "../../../store/project/project";

export default function AddJournal({
  setShowAddJournal,
}: {
  setShowAddJournal: (show: boolean) => void;
}) {
  const addJournalEntry = useJournalStore((state) => state.addJournalEntry);
  const projects = useProjectStore((state) => state.projects);
  const [newJournalEntry, setNewJournalEntry] = useState<Partial<JournalEntry>>(
    {
      type: "progress",
      title: "",
      content: "",
      tags: [],
    }
  );
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Add Journal Entry</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newJournalEntry.type || "progress"}
              onChange={(e) =>
                setNewJournalEntry({
                  ...newJournalEntry,
                  type: e.target.value as JournalEntry["type"],
                })
              }
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="progress">Progress</option>
              <option value="problem">Problem</option>
              <option value="learning">Learning</option>
              <option value="idea">Idea</option>
            </select>
            <select
              value={selectedProject || ""}
              onChange={(e) => setSelectedProject(e.target.value || null)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="">No Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Entry Title"
            value={newJournalEntry.title || ""}
            onChange={(e) =>
              setNewJournalEntry({
                ...newJournalEntry,
                title: e.target.value,
              })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
          />
          <textarea
            placeholder="Entry Content"
            value={newJournalEntry.content || ""}
            onChange={(e) =>
              setNewJournalEntry({
                ...newJournalEntry,
                content: e.target.value,
              })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 h-32"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            onChange={(e) =>
              setNewJournalEntry({
                ...newJournalEntry,
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter((t) => t),
              })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
          />
        </div>
        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => {
              if (newJournalEntry.title && newJournalEntry.content) {
                addJournalEntry({
                  ...newJournalEntry,
                  projectId: selectedProject || undefined,
                } as JournalEntry);
                setShowAddJournal(false);
              }
            }}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Add Entry
          </button>
          <button
            onClick={() => setShowAddJournal(false)}
            className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
