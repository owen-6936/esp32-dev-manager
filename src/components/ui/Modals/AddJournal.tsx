import { useState } from "react";
import useJournalStore from "../../../store/journal";
import useProjectStore from "../../../store/project";
import { useFormValidator } from "../../../hooks/useFormValidator";
import type { JournalEntry } from "../../../types/journal";
import { v4 as UUIDV4 } from "uuid";

export default function AddJournal({
  setShowAddJournal,
}: {
  setShowAddJournal: (show: boolean) => void;
}) {
  const addJournalEntry = useJournalStore((state) => state.addJournalEntry);
  const projects = useProjectStore((state) => state.projects);

  const initialEntry: Partial<JournalEntry> = {
    type: "progress",
    title: "",
    content: "",
    tags: [],
  };

  const [newJournalEntry, setNewJournalEntry] =
    useState<Partial<JournalEntry>>(initialEntry);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagsInput, setTagsInput] = useState<string>("");

  const { errors, validate, validateSingleField } = useFormValidator({
    title: { required: true, minLength: 3 },
    content: { required: true, minLength: 5 },
  });

  const handleBlur = (field: string, value: string | number) => {
    validateSingleField(field, String(value).trim());
  };

  function handleSubmit() {
    setIsSubmitting(true);

    const isValid = validate({
      title: newJournalEntry.title?.trim() || "",
      content: newJournalEntry.content?.trim() || "",
    });

    if (isValid) {
      addJournalEntry({
        id: UUIDV4(),
        title: (newJournalEntry.title || "").trim(),
        content: (newJournalEntry.content || "").trim(),
        projectId: selectedProject ?? "",
        date: new Date(),
        createdAt: new Date(),
        tags: Array.isArray(newJournalEntry.tags) ? newJournalEntry.tags : [],
        type: newJournalEntry.type || "progress",
      });
      setShowAddJournal(false);
      setNewJournalEntry(initialEntry);
      setSelectedProject(null);
      setTagsInput("");
    }

    setIsSubmitting(false);
  }

  function handleCancel() {
    setShowAddJournal(false);
    setNewJournalEntry(initialEntry);
    setSelectedProject(null);
    setTagsInput("");
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2 bg-white/10 border ${
      errors[field] ? "border-red-500" : "border-white/20"
    } rounded-lg text-white placeholder-blue-200`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Add Journal Entry</h3>
        <div className="space-y-4">
          {/* Type and Project */}
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

          {/* Title */}
          <div>
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
              onBlur={(e) => handleBlur("title", e.target.value)}
              className={inputClass("title")}
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <textarea
              placeholder="Entry Content"
              value={newJournalEntry.content || ""}
              onChange={(e) =>
                setNewJournalEntry({
                  ...newJournalEntry,
                  content: e.target.value,
                })
              }
              onBlur={(e) => handleBlur("content", e.target.value)}
              className={`h-32 ${inputClass("content")}`}
            />
            {errors.content && (
              <p className="text-red-400 text-sm mt-1">{errors.content}</p>
            )}
          </div>

          {/* Tags */}
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tagsInput}
            onChange={(e) => {
              const value = e.target.value;
              setTagsInput(value);
              setNewJournalEntry({
                ...newJournalEntry,
                tags: value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              });
            }}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
          >
            Add Entry
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
