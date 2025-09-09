import type { Project } from "../../../../types/project";
import ActualCost from "./ActualCost";
import Budget from "./Budget";

export default function Financials({
    newProject,
    setNewProject,
    errors,
    handleBlur,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
    errors: Record<string, string>;
    handleBlur: (field: string, value: string | number) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <Budget
                newProject={newProject}
                setNewProject={setNewProject}
                errors={errors}
                handleBlur={handleBlur}
            />
            <ActualCost
                newProject={newProject}
                setNewProject={setNewProject}
                errors={errors}
                handleBlur={handleBlur}
            />
        </div>
    );
}
