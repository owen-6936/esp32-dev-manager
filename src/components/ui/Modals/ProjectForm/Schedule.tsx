import type { Project } from "../../../../types/project";
import Deadline from "./Deadline";
import EstimatedTime from "./EstimatedTime";
import StartDate from "./StartDate";
import TimeSpent from "./TimeSpent";

export default function Schedule({
    newProject,
    setNewProject,
    errors,
    handleBlur,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
    errors: Record<string, string>;
    handleBlur: (field: string) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <EstimatedTime
                newProject={newProject}
                setNewProject={setNewProject}
                errors={errors}
                handleBlur={handleBlur}
            />
            <TimeSpent
                newProject={newProject}
                setNewProject={setNewProject}
                errors={errors}
                handleBlur={handleBlur}
            />
            <TimeSpent
                newProject={newProject}
                setNewProject={setNewProject}
                errors={errors}
                handleBlur={handleBlur}
            />
            <StartDate newProject={newProject} setNewProject={setNewProject} />
            <Deadline newProject={newProject} setNewProject={setNewProject} />
        </div>
    );
}
