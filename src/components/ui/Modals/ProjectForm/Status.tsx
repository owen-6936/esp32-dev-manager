import type { Project } from "../../../../types/project";

export default function Status({
    newProject,
    setNewProject,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
}) {
    return (
        <select
            value={newProject.status || "planning"}
            onChange={(e) =>
                setNewProject({
                    ...newProject,
                    status: e.target.value as Project["status"],
                })
            }
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
        </select>
    );
}
