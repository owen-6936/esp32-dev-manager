import type { Project } from "../../../../types/project";

export default function Note({
    newProject,
    setNewProject,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
}) {
    return (
        <input
            type="text"
            placeholder="Project Note"
            value={newProject.note || ""}
            onChange={(e) =>
                setNewProject({
                    ...newProject,
                    note: e.target.value,
                })
            }
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200"
        />
    );
}
