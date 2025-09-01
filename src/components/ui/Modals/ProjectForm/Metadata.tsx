import type { Project } from "../../../../types/project";
import Difficulty from "./Difficulty";
import Status from "./Status";

export default function MetaData({
    newProject,
    setNewProject,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Difficulty newProject={newProject} setNewProject={setNewProject} />
            <Status newProject={newProject} setNewProject={setNewProject} />
        </div>
    );
}
