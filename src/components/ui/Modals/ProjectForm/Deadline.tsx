import type { Project } from "../../../../types/project";

export default function Deadline({
    newProject,
    setNewProject,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
}) {
    return (
        <label className="text-white text-sm mb-2">
            Deadline (optional):
            <input
                type="date"
                placeholder="Deadline"
                value={newProject.deadline || ""}
                onChange={(e) =>
                    setNewProject({
                        ...newProject,
                        deadline: e.target.value,
                    })
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
        </label>
    );
}
