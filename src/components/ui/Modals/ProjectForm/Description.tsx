import type { Project } from "../../../../types/project";
import { inputClass } from "../../../../utils/utils";

export default function Description({
    newProject,
    setNewProject,
    handleBlur,
    errors,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
    handleBlur: (field: string, value: string | number) => void;
    errors: Record<string, string>;
}) {
    return (
        <div className="mb-4">
            <textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) =>
                    setNewProject({
                        ...newProject,
                        description: e.target.value,
                    })
                }
                onBlur={(e) => handleBlur("description", e.target.value)}
                className={`h-24 ${inputClass(errors, "description")}`}
            />
            {errors.description && (
                <p className="text-red-400 text-sm mt-1">
                    {errors.description}
                </p>
            )}
        </div>
    );
}
