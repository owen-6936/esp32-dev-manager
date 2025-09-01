import type { Project } from "../../../../types/project";
import { inputClass } from "../../../../utils/utils";

export default function ActualCost({
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
        <div>
            <input
                type="number"
                placeholder="Actual Cost ($)"
                value={newProject.actualCost || ""}
                onChange={(e) =>
                    setNewProject({
                        ...newProject,
                        actualCost: parseFloat(e.target.value) || 0,
                    })
                }
                onBlur={(e) =>
                    handleBlur("actualCost", parseFloat(e.target.value))
                }
                className={inputClass(errors, "actualCost")}
            />
            {errors.actualCost && (
                <p className="text-red-400 text-sm mt-1">{errors.actualCost}</p>
            )}
        </div>
    );
}
