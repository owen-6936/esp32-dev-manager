import type { Project } from "../../../../types/project";
import { inputClass } from "../../../../utils/utils";

export default function EstimatedTime({
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
                placeholder="Estimated Time (hours)"
                value={newProject.estimatedTime || ""}
                onChange={(e) =>
                    setNewProject({
                        ...newProject,
                        estimatedTime: parseFloat(e.target.value) || 0,
                    })
                }
                onBlur={(e) =>
                    handleBlur("estimatedTime", parseFloat(e.target.value))
                }
                className={inputClass(errors, "estimatedTime")}
            />
            {errors.estimatedTime && (
                <p className="text-red-400 text-sm mt-1">
                    {errors.estimatedTime}
                </p>
            )}
        </div>
    );
}
