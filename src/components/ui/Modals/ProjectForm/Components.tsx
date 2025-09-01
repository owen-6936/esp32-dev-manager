import type { Project } from "../../../../types/project";

export default function Components({
    newProject,
    setNewProject,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
}) {
    return (
        <select
            value={
                newProject.components?.length
                    ? newProject.components.toString().split(",")
                    : ["no-components"]
            }
            multiple
            onChange={(e) =>
                setNewProject({
                    ...newProject,
                    components: e.target.value === "has-components" ? [] : [],
                })
            }
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
            <option value="no-components">No Components</option>
        </select>
    );
}
