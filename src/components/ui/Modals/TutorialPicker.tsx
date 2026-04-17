import { useState, useMemo } from "react";
import { Search, X, BookOpen, Clock, Cpu } from "lucide-react";
import { useProjects, useCategories } from "../../../hooks/useTutorialData";
import type { TutorialProject } from "../../../types/tutorial";
import type { Project } from "../../../types/project";
import useProjectStore from "../../../store/project";
import { generateId } from "../../../utils/utils";
import GlassInput from "../glass/GlassInput";

interface TutorialPickerProps {
    onClose: () => void;
}

const DIFFICULTY_MAP: Record<number, Project["difficulty"]> = {
    1: "beginner",
    2: "beginner",
    3: "intermediate",
    4: "advanced",
    5: "advanced",
};

function tutorialToProject(tutorial: TutorialProject): Project {
    return {
        id: generateId(),
        title: tutorial.fullName,
        description: tutorial.description,
        category: [tutorial.category as unknown as Project["category"][number]],
        status: "planning",
        difficulty: DIFFICULTY_MAP[tutorial.difficulty] ?? "intermediate",
        startDate: new Date().toISOString(),
        estimatedTime: tutorial.timeEstimate,
        components: tutorial.components.map((c) => ({
            id: generateId(),
            name: c.name,
            category: "other" as const,
            quantity: c.quantity,
            supplier: "",
            partNumber: c.partNumber ?? "",
            datasheet: c.datasheetPath,
            inUse: 0,
            description: "",
        })),
        pinConfig: tutorial.pinsUsed.map((p) => ({
            pin: p.pin,
            function: p.label,
            component: p.label,
            project: tutorial.fullName,
            mode: p.mode as "GPIO" | "input" | "output" | "PWM" | "ADC" | "DAC" | "I2C" | "SPI" | "UART" | "other",
        })),
        tasks: tutorial.learningObjectives.map((obj, i) => ({
            id: generateId(),
            title: obj,
            description: "",
            status: "todo" as const,
            priority: i === 0 ? ("high" as const) : ("medium" as const),
        })),
        note: `Based on Freenove tutorial: ${tutorial.displayId}\nConcepts: ${tutorial.concepts.join(", ")}`,
        linkedTutorialId: tutorial.id,
    };
}

export default function TutorialPicker({ onClose }: TutorialPickerProps) {
    const { data: tutorials, loading } = useProjects();
    const { data: categories } = useCategories();
    const addProject = useProjectStore((s) => s.addProject);

    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const filtered = useMemo(() => {
        let results = tutorials;
        if (selectedCategory) {
            results = results.filter((t) => t.category === selectedCategory);
        }
        if (query) {
            const q = query.toLowerCase();
            results = results.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.fullName.toLowerCase().includes(q) ||
                    t.description.toLowerCase().includes(q) ||
                    t.concepts.some((c) => c.toLowerCase().includes(q)),
            );
        }
        return results;
    }, [tutorials, query, selectedCategory]);

    const handleSelect = (tutorial: TutorialProject) => {
        const project = tutorialToProject(tutorial);
        addProject(project);
        onClose();
    };

    const difficultyLabel = (d: number) =>
        ["", "Beginner", "Beginner+", "Intermediate", "Advanced", "Expert"][d] ?? "";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Start from Tutorial
                        </h2>
                        <p className="text-blue-200/60 text-sm mt-0.5">
                            Pick a Freenove tutorial to clone as your project
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 text-blue-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-white/10 space-y-3">
                    <GlassInput
                        variant="search"
                        placeholder="Search tutorials..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${!selectedCategory
                                ? "bg-blue-500 text-white"
                                : "bg-white/5 text-blue-200/70 hover:bg-white/10"
                                }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-white/5 text-blue-200/70 hover:bg-white/10"
                                    }`}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {loading ? (
                        <div className="text-center py-12 text-blue-200/50">
                            Loading tutorials...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-blue-200/50">
                            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            No tutorials found
                        </div>
                    ) : (
                        filtered.map((tutorial) => (
                            <button
                                key={tutorial.id}
                                onClick={() => handleSelect(tutorial)}
                                className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all group"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium group-hover:text-blue-300 transition-colors truncate">
                                            {tutorial.fullName}
                                        </h3>
                                        <p className="text-blue-200/50 text-sm mt-1 line-clamp-2">
                                            {tutorial.description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-blue-200/40">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" />
                                                {difficultyLabel(tutorial.difficulty)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {tutorial.timeEstimate}min
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Cpu className="w-3 h-3" />
                                                {tutorial.components.length} components
                                            </span>
                                        </div>
                                    </div>
                                    <span className="shrink-0 text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Clone
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
