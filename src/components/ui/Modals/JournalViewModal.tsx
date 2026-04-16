import { X, Pencil, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { JournalEntry } from "../../../types/journal";

const TYPE_COLORS: Record<JournalEntry["type"], string> = {
    progress: "bg-green-500/20 text-green-300 border-green-500/30",
    problem: "bg-red-500/20 text-red-300 border-red-500/30",
    idea: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    milestone: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    note: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    learning: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

const DOT_COLORS: Record<JournalEntry["type"], string> = {
    progress: "bg-green-400",
    problem: "bg-red-400",
    idea: "bg-yellow-400",
    milestone: "bg-purple-400",
    note: "bg-blue-400",
    learning: "bg-cyan-400",
};

interface JournalViewModalProps {
    entry: JournalEntry;
    onClose: () => void;
    onEdit: (entry: JournalEntry) => void;
    onDelete: (entry: JournalEntry) => void;
}

export default function JournalViewModal({
    entry,
    onClose,
    onEdit,
    onDelete,
}: JournalViewModalProps) {
    const handleDelete = () => {
        if (window.confirm(`Delete "${entry.title}"?`)) {
            onDelete(entry);
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 rounded-xl w-full max-w-2xl border border-white/20 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 p-6 border-b border-white/10 shrink-0">
                    <div className="flex items-start gap-3 min-w-0">
                        <div
                            className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${DOT_COLORS[entry.type]}`}
                        />
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold text-white leading-tight break-words">
                                {entry.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full border capitalize ${TYPE_COLORS[entry.type]}`}
                                >
                                    {entry.type}
                                </span>
                                <span className="text-blue-200/60 text-xs">
                                    {entry.date.toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                                {entry.updatedAt && (
                                    <span className="text-blue-200/40 text-xs">
                                        · edited{" "}
                                        {entry.updatedAt.toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                        title="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body — markdown content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="prose prose-invert prose-sm max-w-none text-blue-100 leading-relaxed">
                        <ReactMarkdown
                            components={{
                                p({ children }) {
                                    return (
                                        <p className="mb-3 last:mb-0 text-blue-100">
                                            {children}
                                        </p>
                                    );
                                },
                                h1({ children }) {
                                    return (
                                        <h1 className="text-xl font-bold text-white mb-3 mt-4 first:mt-0">
                                            {children}
                                        </h1>
                                    );
                                },
                                h2({ children }) {
                                    return (
                                        <h2 className="text-lg font-bold text-white mb-2 mt-3 first:mt-0">
                                            {children}
                                        </h2>
                                    );
                                },
                                h3({ children }) {
                                    return (
                                        <h3 className="text-base font-semibold text-white mb-2 mt-3 first:mt-0">
                                            {children}
                                        </h3>
                                    );
                                },
                                ul({ children }) {
                                    return (
                                        <ul className="list-disc list-inside mb-3 space-y-1 text-blue-100">
                                            {children}
                                        </ul>
                                    );
                                },
                                ol({ children }) {
                                    return (
                                        <ol className="list-decimal list-inside mb-3 space-y-1 text-blue-100">
                                            {children}
                                        </ol>
                                    );
                                },
                                li({ children }) {
                                    return (
                                        <li className="text-blue-100">
                                            {children}
                                        </li>
                                    );
                                },
                                code({ children, className }) {
                                    const isBlock = className?.includes("language-");
                                    return isBlock ? (
                                        <code className="block bg-black/30 rounded-lg p-3 text-xs font-mono text-green-300 overflow-x-auto whitespace-pre mb-3">
                                            {children}
                                        </code>
                                    ) : (
                                        <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs font-mono text-green-300">
                                            {children}
                                        </code>
                                    );
                                },
                                blockquote({ children }) {
                                    return (
                                        <blockquote className="border-l-2 border-purple-400/50 pl-4 my-3 text-blue-200/70 italic">
                                            {children}
                                        </blockquote>
                                    );
                                },
                                strong({ children }) {
                                    return (
                                        <strong className="font-semibold text-white">
                                            {children}
                                        </strong>
                                    );
                                },
                                hr() {
                                    return (
                                        <hr className="border-white/10 my-4" />
                                    );
                                },
                                a({ href, children }) {
                                    const safeHref =
                                        href && /^https?:\/\//i.test(href)
                                            ? href
                                            : undefined;
                                    return safeHref ? (
                                        <a
                                            href={safeHref}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                                        >
                                            {children}
                                        </a>
                                    ) : (
                                        <span className="text-blue-400">
                                            {children}
                                        </span>
                                    );
                                },
                            }}
                        >
                            {entry.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Footer — tags + actions */}
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/10 shrink-0">
                    <div className="flex flex-wrap gap-1.5 min-w-0">
                        {entry.tags.map((tag, i) => (
                            <span
                                key={i}
                                className="bg-purple-500/20 text-purple-200 border border-purple-500/20 px-2 py-0.5 rounded-full text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => {
                                onEdit(entry);
                                onClose();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-400/70 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
