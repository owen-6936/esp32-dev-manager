import type { Project } from "../../../../types/project";
import { inputClass } from "../../../../utils/utils";

export default function Title({
    newProject,
    setNewProject,
    handleBlur,
    errors,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
    handleBlur: (field: string, value: string) => void;
    errors: Record<string, string>;
}) {
    return (
        <div className="mb-4">
            <input
                type="text"
                placeholder="Project Title"
                value={newProject.title}
                onChange={(e) =>
                    setNewProject({
                        ...newProject,
                        title: e.target.value,
                    })
                }
                onBlur={(e) => handleBlur("title", e.target.value)}
                className={inputClass(errors, "title")}
            />
            {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
            )}
        </div>
    );
}
