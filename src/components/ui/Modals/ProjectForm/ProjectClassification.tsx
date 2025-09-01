import type { Project } from "../../../../types/project";
import Category from "./Category";
import Components from "./Components";

export default function ProjectClassification({
    newProject,
    setNewProject,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Category newProject={newProject} setNewProject={setNewProject} />
            <Components newProject={newProject} setNewProject={setNewProject} />
        </div>
    );
}
