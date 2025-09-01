import type { Project } from "../../../../types/project";
import { inputClass } from "../../../../utils/utils";

export default function Budget({
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
                placeholder="Budget ($)"
                value={newProject.budget || ""}
                onChange={(e) =>
                    setNewProject({
                        ...newProject,
                        budget: parseFloat(e.target.value) || 0,
                    })
                }
                onBlur={(e) => handleBlur("budget", parseFloat(e.target.value))}
                className={inputClass(errors, "budget")}
            />
            {errors.budget && (
                <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
            )}
        </div>
    );
}
