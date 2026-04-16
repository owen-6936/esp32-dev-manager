import { useState } from "react";
import {
    Code,
    X,
    Plus,
    Trash2,
    Pencil,
    Check,
    ChevronDown,
    ChevronUp,
    Copy,
    CheckCheck,
} from "lucide-react";
import useProjectStore from "../../../store/project";
import type { CodeSnippet, Project } from "../../../types/project";

// ─── Language options ─────────────────────────────────────────────────────────

const LANGUAGES = [
    "cpp", "c", "python", "javascript", "typescript",
    "bash", "json", "yaml", "markdown", "plaintext",
];

// ─── Empty form ───────────────────────────────────────────────────────────────

function emptySnippet(): Omit<CodeSnippet, "id"> & { id?: string } {
    return { title: "", language: "cpp", code: "", tags: [] };
}

// ─── SnippetForm ─────────────────────────────────────────────────────────────

function SnippetForm({
    initial,
    onSave,
    onCancel,
}: {
    initial: CodeSnippet;
    onSave: (s: CodeSnippet) => void;
    onCancel: () => void;
}) {
    const [form, setForm] = useState<CodeSnippet>(initial);
    const [tagInput, setTagInput] = useState("");

    function addTag() {
        const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
        if (t && !form.tags.includes(t)) {
            setForm((f) => ({ ...f, tags: [...f.tags, t] }));
        }
        setTagInput("");
    }

    function removeTag(tag: string) {
        setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
    }

    const canSave = form.title.trim() && form.code.trim();

    return (
        <div className="space-y-3">
            {/* Title */}
            <input
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50"
                placeholder="Snippet title *"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />

            {/* Language */}
            <select
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50"
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
            >
                {LANGUAGES.map((l) => (
                    <option key={l} value={l} className="bg-slate-800">
                        {l}
                    </option>
                ))}
            </select>

            {/* Code */}
            <textarea
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-green-400 font-mono text-sm placeholder-white/20 focus:outline-none focus:border-blue-500/50 resize-y min-h-[120px]"
                placeholder="Paste your code here *"
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            />

            {/* Tags */}
            <div className="flex gap-2">
                <input
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50"
                    placeholder="Add tag + Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); addTag(); }
                    }}
                />
            </div>
            {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {form.tags.map((tag) => (
                        <span
                            key={tag}
                            className="flex items-center gap-1 bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full text-xs"
                        >
                            #{tag}
                            <button onClick={() => removeTag(tag)} className="hover:text-white">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-1">
                <button
                    onClick={onCancel}
                    className="px-4 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
                >
                    Cancel
                </button>
                <button
                    disabled={!canSave}
                    onClick={() => canSave && onSave(form)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-white text-sm font-medium transition-colors"
                >
                    <Check className="w-4 h-4" />
                    Save
                </button>
            </div>
        </div>
    );
}

// ─── SnippetCard ──────────────────────────────────────────────────────────────

function SnippetCard({
    snippet,
    onEdit,
    onDelete,
}: {
    snippet: CodeSnippet;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    function copy() {
        navigator.clipboard.writeText(snippet.code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }

    return (
        <div className="bg-white/5 rounded-xl border border-white/8 overflow-hidden">
            {/* Header row */}
            <div className="flex items-center gap-2 px-4 py-3">
                <button
                    onClick={() => setExpanded((x) => !x)}
                    className="flex-1 flex items-center gap-2 text-left"
                >
                    <span className="text-white font-medium text-sm truncate">
                        {snippet.title}
                    </span>
                    <span className="shrink-0 bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded text-xs font-mono">
                        {snippet.language}
                    </span>
                    {expanded ? (
                        <ChevronUp className="w-4 h-4 text-white/30 ml-auto shrink-0" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-white/30 ml-auto shrink-0" />
                    )}
                </button>
                <button
                    onClick={copy}
                    title="Copy code"
                    className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
                >
                    {copied ? (
                        <CheckCheck className="w-4 h-4 text-green-400" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
                <button
                    onClick={onEdit}
                    title="Edit"
                    className="p-1.5 rounded-lg text-white/30 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={onDelete}
                    title="Delete"
                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Expandable code */}
            {expanded && (
                <div className="border-t border-white/8 bg-black/30 p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                        {snippet.code}
                    </pre>
                    {snippet.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {snippet.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded text-xs"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── CodeEditor (main modal) ──────────────────────────────────────────────────

export default function CodeEditor({
    projectId,
    setShowCodeEditor,
}: {
    projectId?: string;
    setShowCodeEditor: (show: boolean) => void;
}) {
    const projects = useProjectStore((s) => s.projects);
    const updateProject = useProjectStore((s) => s.updateProject);

    // Active project tab — default to the passed-in projectId, or the first project
    const [activeProjectId, setActiveProjectId] = useState<string>(
        projectId ?? projects[0]?.id ?? "",
    );

    // Form state: null = closed, "new" = adding, snippet index = editing
    const [editingIndex, setEditingIndex] = useState<number | "new" | null>(null);

    const activeProject: Project | undefined = projects.find(
        (p) => p.id === activeProjectId,
    );
    const snippets: CodeSnippet[] = activeProject?.codeSnippets ?? [];

    function handleSave(snippet: CodeSnippet) {
        if (!activeProject) return;
        let updated: CodeSnippet[];
        if (editingIndex === "new") {
            updated = [...snippets, snippet];
        } else {
            updated = snippets.map((s, i) =>
                i === editingIndex ? snippet : s,
            );
        }
        updateProject(activeProject.id, { codeSnippets: updated });
        setEditingIndex(null);
    }

    function handleDelete(index: number) {
        if (!activeProject) return;
        updateProject(activeProject.id, {
            codeSnippets: snippets.filter((_, i) => i !== index),
        });
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl w-full max-w-3xl border border-white/10 max-h-[90vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 shrink-0">
                    <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-bold text-white">Code Snippets</h3>
                    </div>
                    <button
                        onClick={() => setShowCodeEditor(false)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
                        <Code className="w-12 h-12 text-white/15" />
                        <p className="text-white/30 text-sm">
                            Create a project first to start saving code snippets.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Project tabs */}
                        <div className="flex gap-1 px-4 pt-3 pb-0 flex-wrap shrink-0">
                            {projects.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setActiveProjectId(p.id);
                                        setEditingIndex(null);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${p.id === activeProjectId
                                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                            : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                                        }`}
                                >
                                    {p.title}
                                    <span className="ml-1.5 text-white/25">
                                        {(p.codeSnippets?.length ?? 0)}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                            {/* Add form */}
                            {editingIndex === "new" && (
                                <div className="bg-white/5 rounded-xl border border-blue-500/20 p-4">
                                    <p className="text-blue-300 text-xs font-semibold mb-3 uppercase tracking-wide">
                                        New Snippet
                                    </p>
                                    <SnippetForm
                                        initial={emptySnippet() as CodeSnippet}
                                        onSave={handleSave}
                                        onCancel={() => setEditingIndex(null)}
                                    />
                                </div>
                            )}

                            {/* Existing snippets */}
                            {snippets.length === 0 && editingIndex !== "new" ? (
                                <div className="flex flex-col items-center gap-2 py-10 text-center">
                                    <Code className="w-10 h-10 text-white/10" />
                                    <p className="text-white/30 text-sm">
                                        No snippets for this project yet.
                                    </p>
                                </div>
                            ) : (
                                snippets.map((snippet, i) =>
                                    editingIndex === i ? (
                                        <div
                                            key={i}
                                            className="bg-white/5 rounded-xl border border-blue-500/20 p-4"
                                        >
                                            <p className="text-blue-300 text-xs font-semibold mb-3 uppercase tracking-wide">
                                                Editing: {snippet.title}
                                            </p>
                                            <SnippetForm
                                                initial={snippet}
                                                onSave={handleSave}
                                                onCancel={() => setEditingIndex(null)}
                                            />
                                        </div>
                                    ) : (
                                        <SnippetCard
                                            key={i}
                                            snippet={snippet}
                                            onEdit={() => setEditingIndex(i)}
                                            onDelete={() => handleDelete(i)}
                                        />
                                    ),
                                )
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 border-t border-white/8 shrink-0">
                            <button
                                onClick={() => setEditingIndex("new")}
                                disabled={editingIndex !== null}
                                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 disabled:opacity-40 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add snippet to{" "}
                                <span className="font-medium">
                                    {activeProject?.title}
                                </span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

