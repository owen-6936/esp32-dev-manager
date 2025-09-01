import type { Project } from "../../../../types/project";
import { inputClass } from "../../../../utils/utils";

export default function TimeSpent({
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
                placeholder="Time Spent (hours)"
                value={newProject.timeSpent || ""}
                onChange={(e) =>
                    setNewProject({
                        ...newProject,
                        timeSpent: parseFloat(e.target.value) || 0,
                    })
                }
                onBlur={(e) =>
                    handleBlur("timeSpent", parseFloat(e.target.value))
                }
                className={inputClass(errors, "timeSpent")}
            />
            {errors.timeSpent && (
                <p className="text-red-400 text-sm mt-1">{errors.timeSpent}</p>
            )}
        </div>
    );
}
