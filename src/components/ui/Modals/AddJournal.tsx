import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useJournalStore } from "../../../store/journal/journal";
import type { JournalEntry } from "../../../types/journal/journal";
import { useProjectStore } from "../../../store/project/project";
import { z } from "zod";

const JournalFormSchema = z.object({
  type: z.enum(["progress", "problem", "learning", "idea"]),
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .trim(),
  content: z
    .string()
    .min(1, "Content is required")
    .min(10, "Content must be at least 10 characters")
    .trim(),
  tags: z.array(z.string().min(1).max(100)).optional(),
  projectId: z.string().optional(),
});

type JournalFormData = z.infer<typeof JournalFormSchema>;

export default function AddJournal({
  setShowAddJournal,
}: {
  setShowAddJournal: (show: boolean) => void;
}) {
  const addJournalEntry = useJournalStore((state) => state.addJournalEntry);
  const projects = useProjectStore((state) => state.projects);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<JournalFormData>({
    resolver: zodResolver(JournalFormSchema),
    defaultValues: {
      type: "progress",
      title: "",
      content: "",
      tags: [],
      projectId: "",
    },
  });

  const onSubmit = (data: JournalFormData) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      type: data.type,
      title: data.title,
      content: data.content,
      tags: data.tags || [],
      projectId: data.projectId || "",
      date: new Date().toISOString(),
      createdAt: new Date(),
    };

    addJournalEntry(newEntry);
    reset();
    setShowAddJournal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen">
      <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/20">
        <h3 className="text-xl font-bold text-white mb-4">Add Journal Entry</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Type Select */}
            <div>
              <select
                {...register("type")}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="progress">Progress</option>
                <option value="problem">Problem</option>
                <option value="learning">Learning</option>
                <option value="idea">Idea</option>
              </select>
              {errors.type && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Project Select */}
            <div>
              <select
                {...register("projectId")}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="">No Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.projectId.message}
                </p>
              )}
            </div>
          </div>

          {/* Title Field */}
          <div>
            <input
              type="text"
              placeholder="Entry Title"
              {...register("title")}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
            />
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Content Field */}
          <div>
            <textarea
              placeholder="Entry Content"
              {...register("content")}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 h-32"
            />
            {errors.content && (
              <p className="text-red-400 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Tags Field */}
          <div>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              {...register("tags")}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
            />
            {errors.tags && (
              <p className="text-red-400 text-sm mt-1">{errors.tags.message}</p>
            )}
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              Add Entry
            </button>
            <button
              type="button"
              onClick={() => setShowAddJournal(false)}
              className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
