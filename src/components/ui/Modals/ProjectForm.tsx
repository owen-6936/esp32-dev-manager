import { useState } from "react";
import useProjectStore from "../../../store/project";
import type { Project } from "../../../types/project";
import { useFormValidator } from "../../../hooks/useFormValidator";
import Title from "./ProjectForm/Title";
import Description from "./ProjectForm/Description";
import MetaData from "./ProjectForm/Metadata";

export default function ProjectForm({
    setShowAddProject,
    mode = "Add New Project",
    projectId,
}: {
    setShowAddProject: (show: boolean) => void;
    mode: "Add New Project" | "Update Project";
    projectId?: string;
}) {
    const project = useProjectStore((state) =>
        state.getProjectById(projectId || ""),
    );

    const initialProject: Partial<Project> = project || {
        id: "",
        title: "",
        description: "",
        status: "planning",
        difficulty: "beginner",
    };

    const [newProject, setNewProject] =
        useState<Partial<Project>>(initialProject);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addProject = useProjectStore((state) => state.addProject);

    const { errors, validate, validateSingleField } = useFormValidator({
        title: { required: true, minLength: 3 },
        description: { required: true, minLength: 10 },
        estimatedTime: { required: false },
        budget: { required: false },
    });

    const handleSubmit = () => {
        setIsSubmitting(true);
        const isValid = validate({
            title: newProject.title?.trim() || "",
            description: newProject.description?.trim() || "",
            estimatedTime: String(newProject.estimatedTime ?? ""),
            budget: String(newProject.budget ?? ""),
        });

        if (isValid) {
            const fullProject: Project = {
                ...newProject,
                id: Date.now().toString(),
            } as Project;

            addProject(fullProject);
            setShowAddProject(false);
            setNewProject(initialProject);
        }

        setIsSubmitting(false);
    };

    const handleCancel = () => {
        setShowAddProject(false);
        setNewProject(initialProject);
    };

    const handleBlur = (field: string, value: string | number) => {
        validateSingleField(field, String(value).trim());
    };
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 h-screen">
            <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/20 max-h-[90vh] overflow-y-auto scrollbar-none flex flex-col"
            >
                <h3 className="text-xl font-bold text-white mb-4">{mode}</h3>
                {/* Project Fields */}
                <Title
                    newProject={newProject}
                    setNewProject={setNewProject}
                    errors={errors}
                    handleBlur={handleBlur}
                />
                <Description
                    newProject={newProject}
                    setNewProject={setNewProject}
                    errors={errors}
                    handleBlur={handleBlur}
                />
                <MetaData
                    newProject={newProject}
                    setNewProject={setNewProject}
                />
                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`flex-1 text-white py-2 rounded-lg transition-all cursor-pointer ${
                            isSubmitting
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                    >
                        {isSubmitting ? "Adding..." : "Add Project"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-white/10 text-white py-2 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
