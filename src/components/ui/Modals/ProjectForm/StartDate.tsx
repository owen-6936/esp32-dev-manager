import type { Project } from "../../../../types/project";

export default function StartDate({
    newProject,
    setNewProject,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
}) {
    return (
        <label className="text-white text-sm mb-2">
            Start Date (optional):
            <input
                type="date"
                placeholder="Start Date"
                value={newProject.startDate || ""}
                onChange={(e) =>
                    setNewProject({
                        ...newProject,
                        startDate: e.target.value,
                    })
                }
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
        </label>
    );
}
