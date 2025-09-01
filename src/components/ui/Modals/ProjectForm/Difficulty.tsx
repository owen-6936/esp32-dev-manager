import type { Project } from "../../../../types/project";

export default function Difficulty({
    newProject,
    setNewProject,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
}) {
    return (
        <select
            value={newProject.difficulty || "beginner"}
            onChange={(e) =>
                setNewProject({
                    ...newProject,
                    difficulty: e.target.value as Project["difficulty"],
                })
            }
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
        </select>
    );
}
