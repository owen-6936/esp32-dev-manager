import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot, X, Send, Sparkles, Trash2, StopCircle, Maximize2, Minimize2, Copy, Check,
    Settings, Wrench,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { streamChat, isAIConfigured, AI_QUICK_PROMPTS, AI_MODELS, parseToolCalls, stripToolBlocks, type AIMessage } from "../../services/aiService";
import { useNavigate } from "react-router-dom";
import useJournalStore from "../../store/journal";
import useProjectStore from "../../store/project";
import useProgressStore, { getRank, getLevel } from "../../store/progress";
import { generateId } from "../../utils/utils";

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    streaming?: boolean;
    thinking?: boolean;
}

// ─── Code block with copy button ─────────────────────────────────────────────

function CodeBlock({ language, children }: { language: string; children: string }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-2 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between bg-white/8 px-3 py-1 text-[10px] text-white/40">
                <span>{language || "code"}</span>
                <button onClick={copy} className="flex items-center gap-1 hover:text-white/70 transition-colors cursor-pointer">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <SyntaxHighlighter
                language={language || "text"}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    padding: "0.75rem",
                    fontSize: "0.75rem",
                    lineHeight: 1.5,
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: 0,
                }}
                wrapLongLines
            >
                {children}
            </SyntaxHighlighter>
        </div>
    );
}

// ─── Markdown renderer ───────────────────────────────────────────────────────

const MarkdownContent = memo(function MarkdownContent({ content }: { content: string }) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{

                code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className ?? "");
                    const text = String(children).replace(/\n$/, "");
                    if (match) {
                        return <CodeBlock language={match[1]} children={text} />;
                    }
                    return (
                        <code className="bg-white/10 px-1.5 py-0.5 rounded text-[0.8em] text-sky-300 break-all" {...props}>
                            {children}
                        </code>
                    );
                },
                p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>;
                },
                ul({ children }) {
                    return <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>;
                },
                ol({ children }) {
                    return <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>;
                },
                li({ children }) {
                    return <li className="text-inherit">{children}</li>;
                },
                h1({ children }) {
                    return <h1 className="text-base font-bold text-white mb-2 mt-3 first:mt-0">{children}</h1>;
                },
                h2({ children }) {
                    return <h2 className="text-sm font-bold text-white mb-1.5 mt-2.5 first:mt-0">{children}</h2>;
                },
                h3({ children }) {
                    return <h3 className="text-sm font-semibold text-white mb-1 mt-2 first:mt-0">{children}</h3>;
                },
                table({ children }) {
                    return (
                        <div className="overflow-x-auto my-2">
                            <table className="min-w-full text-xs border-collapse border border-white/10">{children}</table>
                        </div>
                    );
                },
                th({ children }) {
                    return <th className="border border-white/10 px-2 py-1 bg-white/5 text-white text-left font-medium">{children}</th>;
                },
                td({ children }) {
                    return <td className="border border-white/10 px-2 py-1 text-white/70">{children}</td>;
                },
                blockquote({ children }) {
                    return <blockquote className="border-l-2 border-purple-400/40 pl-3 my-2 text-white/60 italic">{children}</blockquote>;
                },
                a({ href, children }) {
                    const safeHref =
                        href && /^https?:\/\//i.test(href) ? href : undefined;
                    return safeHref ? (
                        <a href={safeHref} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                            {children}
                        </a>
                    ) : (
                        <span className="text-blue-400">{children}</span>
                    );
                },
                hr() {
                    return <hr className="border-white/10 my-3" />;
                },
                strong({ children }) {
                    return <strong className="font-semibold text-white">{children}</strong>;
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
});

// ─── Main chat component ─────────────────────────────────────────────────────

export default function AIChat() {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [toolsEnabled, setToolsEnabled] = useState(true);
    const abortRef = useRef<AbortController | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    // Raw (unstripped) content buffer — stored outside state to avoid StrictMode double-call bugs
    const rawContentRef = useRef<Map<string, string>>(new Map());
    const configured = isAIConfigured();
    const navigate = useNavigate();
    const addJournalEntry = useJournalStore((s) => s.addJournalEntry);
    const updateJournalEntry = useJournalStore((s) => s.updateJournalEntry);
    const removeJournalEntry = useJournalStore((s) => s.removeJournalEntry);
    // const { totalXp, progress: progressProjects } = useProgressStore();
    // NOTE: use useJournalStore.getState() / useProjectStore.getState() inside callbacks — avoids stale closure

    // Process AI tool calls after streaming completes
    const handleToolCalls = useCallback((content: string) => {
        const calls = parseToolCalls(content);
        for (const call of calls) {
            switch (call.tool) {
                case "navigate": {
                    const raw = call.args.path as string | undefined;
                    if (raw && typeof raw === "string") {
                        // Normalise AI-generated paths: /dashboard → /
                        const path = raw === "/dashboard" ? "/" : raw;
                        const validPaths = ["/", "/learn", "/workshop", "/account", "/admin", "/leaderboard", "/login"];
                        if (validPaths.includes(path) || path.startsWith("/tutorials/")) {
                            navigate(path);
                            setActionFeedback(`Navigated to ${path}`);
                        } else {
                            // Unknown path — fall back to home rather than hitting the catch-all
                            navigate("/");
                            setActionFeedback(`Navigated to home`);
                        }
                    }
                    break;
                }
                case "open_project": {
                    const sketchId = call.args.sketchId as string | undefined;
                    if (sketchId) {
                        navigate(`/tutorials/${sketchId}`);
                        setActionFeedback(`Opened project ${sketchId}`);
                    }
                    break;
                }
                case "search_projects": {
                    const query = call.args.query as string | undefined;
                    if (query) {
                        navigate(`/learn?tab=tutorials&search=${encodeURIComponent(query)}`);
                        setActionFeedback(`Searching for "${query}"`);
                    }
                    break;
                }
                case "filter_tutorials": {
                    const query = call.args.query as string | undefined;
                    const params = new URLSearchParams({ tab: "tutorials" });
                    if (query) params.set("search", query);
                    navigate(`/learn?${params.toString()}`);
                    setActionFeedback("Opened tutorials" + (query ? ` — filtering for "${query}"` : ""));
                    break;
                }
                case "open_inventory": {
                    navigate("/workshop?tab=components");
                    setActionFeedback("Opened inventory");
                    break;
                }
                case "open_journal": {
                    navigate("/workshop?tab=journal");
                    setActionFeedback("Opened journal");
                    break;
                }
                case "add_journal": {
                    const title = call.args.title as string | undefined;
                    const journalContent = call.args.content as string | undefined;
                    const type = (call.args.type as string) || "note";
                    if (title && journalContent) {
                        const now = new Date();
                        addJournalEntry({
                            id: generateId(),
                            date: now,
                            type: type as "progress" | "problem" | "idea" | "milestone" | "note" | "learning",
                            title,
                            content: journalContent,
                            tags: [],
                            projectId: "",
                            createdAt: now,
                        });
                        setActionFeedback(`Journal entry "${title}" created`);
                    }
                    break;
                }
                case "edit_journal": {
                    const matchTitle = call.args.title as string | undefined;
                    const newTitle = call.args.newTitle as string | undefined;
                    const newContent = call.args.newContent as string | undefined;
                    const newType = call.args.newType as string | undefined;
                    if (matchTitle) {
                        // Read live state — avoids stale closure
                        const liveEntries = useJournalStore.getState().journalEntries;
                        const entry = liveEntries.find((e) =>
                            e.title.toLowerCase() === matchTitle.toLowerCase(),
                        );
                        if (entry) {
                            updateJournalEntry(entry.id, {
                                ...(newTitle && { title: newTitle }),
                                ...(newContent && { content: newContent }),
                                ...(newType && { type: newType as "progress" | "problem" | "idea" | "milestone" | "note" | "learning" }),
                                updatedAt: new Date(),
                            });
                            setActionFeedback(`Journal entry updated`);
                        } else {
                            setActionFeedback(`Entry "${matchTitle}" not found`);
                        }
                    }
                    break;
                }
                case "delete_journal": {
                    const matchTitle = call.args.title as string | undefined;
                    if (matchTitle) {
                        const liveEntries = useJournalStore.getState().journalEntries;
                        const entry = liveEntries.find((e) =>
                            e.title.toLowerCase() === matchTitle.toLowerCase(),
                        );
                        if (entry) {
                            removeJournalEntry(entry.id);
                            setActionFeedback(`Journal entry "${entry.title}" deleted`);
                        } else {
                            setActionFeedback(`Entry "${matchTitle}" not found`);
                        }
                    }
                    break;
                }
                case "search_journals": {
                    const query = (call.args.query as string | undefined)?.toLowerCase();
                    const typeFilter = call.args.type as string | undefined;
                    const liveEntries = useJournalStore.getState().journalEntries;
                    const matches = liveEntries.filter((e) => {
                        const matchesType = typeFilter ? e.type === typeFilter : true;
                        const matchesQuery = query
                            ? e.title.toLowerCase().includes(query) ||
                            e.content.toLowerCase().includes(query) ||
                            e.tags.some((t) => t.toLowerCase().includes(query))
                            : true;
                        return matchesType && matchesQuery;
                    });
                    const resultText =
                        matches.length === 0
                            ? `No journal entries found${query ? ` matching "${call.args.query}"` : ""}${typeFilter ? ` of type "${typeFilter}"` : ""}.`
                            : `Found **${matches.length}** journal entr${matches.length === 1 ? "y" : "ies"}${query ? ` matching "${call.args.query}"` : ""}:\n\n` +
                            matches
                                .map(
                                    (e, i) =>
                                        `${i + 1}. **${e.title}** *(${e.type})* — ${e.date.toLocaleDateString()}\n   ${e.content.slice(0, 120)}${e.content.length > 120 ? "…" : ""}`,
                                )
                                .join("\n\n");
                    setMessages((prev) => [
                        ...prev,
                        { role: "assistant", content: resultText },
                    ]);
                    break;
                }
                case "get_journal_entry": {
                    const searchTitle = call.args.title as string | undefined;
                    if (searchTitle) {
                        const liveEntries = useJournalStore.getState().journalEntries;
                        const entry = liveEntries.find((e) =>
                            e.title.toLowerCase() === searchTitle.toLowerCase(),
                        );
                        const resultText = entry
                            ? `## ${entry.title}\n**Type:** ${entry.type} · **Date:** ${entry.date.toLocaleDateString()}${entry.tags.length ? `\n**Tags:** ${entry.tags.map((t) => `#${t}`).join(", ")}` : ""}\n\n${entry.content}`
                            : `Journal entry "${searchTitle}" not found.`;
                        setMessages((prev) => [
                            ...prev,
                            { id: generateId(), role: "assistant", content: resultText },
                        ]);
                    }
                    break;
                }
                case "get_user_stats": {
                    const xp = useProgressStore.getState().totalXp;
                    const rank = getRank(xp);
                    const level = getLevel(xp);
                    const allProgress = useProgressStore.getState().progress;
                    const completed = Object.values(allProgress).filter((p) => p.status === "completed").length;
                    const inProgress = Object.values(allProgress).filter((p) => p.status === "in_progress").length;
                    const userProjects = useProjectStore.getState().projects;
                    const statsText =
                        `## Your Stats\n` +
                        `| Metric | Value |\n|---|---|\n` +
                        `| **XP** | ${xp} |\n` +
                        `| **Level** | ${level} |\n` +
                        `| **Rank** | ${rank.icon} ${rank.rank} |\n` +
                        `| **Tutorials Completed** | ${completed} |\n` +
                        `| **Tutorials In Progress** | ${inProgress} |\n` +
                        `| **Personal Projects** | ${userProjects.length} |`;
                    setMessages((prev) => [
                        ...prev,
                        { id: generateId(), role: "assistant", content: statsText },
                    ]);
                    break;
                }
                case "list_user_projects": {
                    const userProjects = useProjectStore.getState().projects;
                    const listText =
                        userProjects.length === 0
                            ? "You haven't added any personal projects yet. Head to the Workshop to add one!"
                            : `## Your Projects (${userProjects.length})\n\n` +
                            userProjects
                                .map(
                                    (p, i) =>
                                        `${i + 1}. **${p.name}** — *${p.status ?? "planning"}*${p.description ? `\n   ${p.description.slice(0, 100)}` : ""}`,
                                )
                                .join("\n\n");
                    setMessages((prev) => [
                        ...prev,
                        { id: generateId(), role: "assistant", content: listText },
                    ]);
                    break;
                }
                case "open_workshop_tab": {
                    const tab = call.args.tab as string | undefined;
                    const validTabs = ["projects", "components", "journal", "analytics", "pins"];
                    const safeTab = tab && validTabs.includes(tab) ? tab : "projects";
                    navigate(`/workshop?tab=${safeTab}`);
                    setActionFeedback(`Opened workshop › ${safeTab}`);
                    break;
                }
                case "open_feedback": {
                    // Dispatch a custom event for the root layout to pick up
                    window.dispatchEvent(new CustomEvent("open-feedback"));
                    setActionFeedback("Opened feedback form");
                    break;
                }
                case "get_progress_for": {
                    const sketchId = call.args.sketchId as string | undefined;
                    if (sketchId) {
                        const allProgress = useProgressStore.getState().progress;
                        const progress = allProgress[sketchId];
                        const statusText = progress
                            ? `**${sketchId}** — Status: ${progress.status.replace("_", " ")}, Checkpoint: ${progress.checkpoint}, XP awarded: ${progress.xpAwarded ? "yes" : "no"}`
                            : `No progress recorded yet for **${sketchId}**. Open it in the tutorials to start!`;
                        setMessages((prev) => [
                            ...prev,
                            { id: generateId(), role: "assistant", content: statusText },
                        ]);
                    }
                    break;
                }
                case "show_learning_path": {
                    navigate("/learn?tab=roadmap");
                    setActionFeedback("Opened learning roadmap");
                    break;
                }
                default:
                    break;
            }
        }
    }, [navigate, addJournalEntry, updateJournalEntry, removeJournalEntry, setMessages]);

    // Auto-dismiss action feedback
    useEffect(() => {
        if (!actionFeedback) return;
        const t = setTimeout(() => setActionFeedback(null), 3000);
        return () => clearTimeout(t);
    }, [actionFeedback]);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 200);
    }, [open]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || streaming) return;

        const userMsg: ChatMessage = { id: generateId(), role: "user", content: text.trim() };
        const assistantMsg: ChatMessage = { id: generateId(), role: "assistant", content: "", streaming: true };

        setMessages((prev) => [...prev, userMsg, assistantMsg]);
        setInput("");
        setStreaming(true);

        const history: AIMessage[] = [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
        }));

        const controller = new AbortController();
        abortRef.current = controller;

        await streamChat(history, {
            onToken: (token) => {
                // Track raw content outside state to avoid StrictMode double-call side effects
                rawContentRef.current.set(
                    assistantMsg.id,
                    (rawContentRef.current.get(assistantMsg.id) ?? "") + token,
                );
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMsg.id
                            ? { ...m, content: m.content + token, thinking: false }
                            : m,
                    ),
                );
            },
            onReasoning: () => {
                // Mark as thinking while reasoning tokens arrive (before content)
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMsg.id && m.content === ""
                            ? { ...m, thinking: true }
                            : m,
                    ),
                );
            },
            onDone: () => {
                // Capture raw content BEFORE calling setMessages, then clear the buffer
                const rawContent = rawContentRef.current.get(assistantMsg.id) ?? "";
                rawContentRef.current.delete(assistantMsg.id);
                const stripped = toolsEnabled ? stripToolBlocks(rawContent) : rawContent;
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMsg.id
                            ? {
                                ...m,
                                // If the whole response was action blocks, show a confirmation stub
                                content: stripped || (rawContent ? "✓" : ""),
                                streaming: false,
                                thinking: false,
                            }
                            : m,
                    ),
                );
                setStreaming(false);
                // Call tool handlers OUTSIDE the state setter — avoids StrictMode double-invoke
                if (toolsEnabled && rawContent) {
                    handleToolCalls(rawContent);
                }
            },
            onError: (error) => {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantMsg.id
                            ? { ...m, content: `Error: ${error}`, streaming: false, thinking: false }
                            : m,
                    ),
                );
                setStreaming(false);
            },
        }, controller.signal, { toolsEnabled });
    }, [messages, streaming, toolsEnabled, handleToolCalls]);

    const stopStreaming = () => {
        abortRef.current?.abort();
        // Execute any complete tool calls accumulated before the user hit Stop
        if (toolsEnabled) {
            for (const [, rawContent] of rawContentRef.current) {
                if (rawContent) handleToolCalls(rawContent);
            }
            rawContentRef.current.clear();
        }
        setStreaming(false);
        setMessages((prev) =>
            prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)),
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const panelClasses = expanded
        ? "fixed inset-4 z-50 sm:inset-6 md:inset-12 lg:inset-x-[15%] lg:inset-y-8"
        : "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)]";

    return (
        <>
            {/* Floating trigger button */}
            <motion.button
                onClick={() => setOpen((v) => !v)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-linear-to-br from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="AI Assistant"
            >
                {open ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </motion.button>

            {/* Backdrop when expanded */}
            <AnimatePresence>
                {open && expanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={() => setExpanded(false)}
                    />
                )}
            </AnimatePresence>

            {/* Chat panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        layout
                        className={`${panelClasses} bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden`}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 shrink-0">
                            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white text-sm font-semibold">ESP32 AI Assistant</h3>
                                <p className="text-white/30 text-xs">
                                    {configured ? "Powered by OpenRouter" : "API key needed"}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setShowSettings((v) => !v)}
                                    className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${showSettings ? "text-purple-400 bg-white/10" : "text-white/30 hover:text-white/60"}`}
                                    title="Settings"
                                >
                                    <Settings className="w-3.5 h-3.5" />
                                </button>
                                {messages.length > 0 && (
                                    <button
                                        onClick={() => setMessages([])}
                                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                                        title="Clear chat"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setExpanded((v) => !v)}
                                    className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                                    title={expanded ? "Minimize" : "Expand"}
                                >
                                    {expanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>

                        {/* Settings panel */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden border-b border-white/8"
                                >
                                    <div className="px-4 py-3 space-y-3 bg-white/3">
                                        {/* Tools toggle */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Wrench className="w-3.5 h-3.5 text-white/40" />
                                                <span className="text-xs text-white/60">Tool Actions</span>
                                            </div>
                                            <button
                                                onClick={() => setToolsEnabled((v) => !v)}
                                                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${toolsEnabled ? "bg-purple-500" : "bg-white/15"}`}
                                            >
                                                <span
                                                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${toolsEnabled ? "translate-x-4" : "translate-x-0"}`}
                                                />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-white/30 -mt-1 pl-6">
                                            {toolsEnabled
                                                ? "AI can navigate, open projects, and search"
                                                : "AI responds with text only"}
                                        </p>

                                        {/* Models info */}
                                        <div>
                                            <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Models (fallback order)</span>
                                            <div className="mt-1 space-y-0.5">
                                                {AI_MODELS.map((m) => (
                                                    <div key={m} className="text-[10px] text-white/30 font-mono truncate">
                                                        {m.replace(":free", "")}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                    <Bot className="w-12 h-12 text-white/15 mb-3" />
                                    <p className="text-white/40 text-sm mb-4">
                                        Ask me anything about ESP32-S3 development
                                    </p>
                                    {configured && (
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {AI_QUICK_PROMPTS.slice(0, 4).map((qp) => (
                                                <button
                                                    key={qp.label}
                                                    onClick={() => sendMessage(qp.prompt)}
                                                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/50 text-xs hover:bg-white/10 hover:text-white/70 transition-all cursor-pointer"
                                                >
                                                    {qp.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {!configured && (
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-amber-200/70 text-xs">
                                            Add <code className="bg-white/10 px-1 rounded">VITE_OPENROUTER_API_KEY</code> to your .env file to enable AI features.
                                        </div>
                                    )}
                                </div>
                            )}

                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed min-w-0 overflow-x-hidden ${expanded ? "max-w-[75%]" : "max-w-[85%]"
                                            } ${msg.role === "user"
                                                ? "bg-blue-500/20 text-white border border-blue-500/20"
                                                : "bg-white/5 text-white/80 border border-white/8"
                                            }`}
                                    >
                                        {msg.role === "assistant" ? (
                                            <div className="min-w-0 [word-break:break-word] wrap-anywhere">
                                                {msg.thinking && msg.content === "" ? (
                                                    <span className="text-white/30 italic text-xs flex items-center gap-1.5">
                                                        <span className="inline-flex gap-0.5">
                                                            {[0, 1, 2].map((i) => (
                                                                <span
                                                                    key={i}
                                                                    className="block w-1 h-1 rounded-full bg-white/30 animate-bounce"
                                                                    style={{ animationDelay: `${i * 0.15}s` }}
                                                                />
                                                            ))}
                                                        </span>
                                                        Thinking…
                                                    </span>
                                                ) : (
                                                    <>
                                                        <MarkdownContent content={msg.content} />
                                                        {msg.streaming && !msg.thinking && (
                                                            <span className="inline-block w-1.5 h-4 bg-purple-400 rounded-full animate-pulse ml-0.5 align-text-bottom" />
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="whitespace-pre-wrap [word-break:break-word] wrap-anywhere">{msg.content}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Action feedback */}
                        {actionFeedback && (
                            <div className="px-3 py-1.5 text-xs text-purple-300 bg-purple-500/10 border-t border-purple-500/20 flex items-center gap-1.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                {actionFeedback}
                            </div>
                        )}

                        {/* Input */}
                        <div className="px-3 py-3 border-t border-white/8 shrink-0">
                            <div className="flex items-end gap-2">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={configured ? "Ask about ESP32-S3..." : "Configure API key first"}
                                    disabled={!configured}
                                    rows={1}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/40 resize-none disabled:opacity-40 max-h-24"
                                    style={{ minHeight: "40px" }}
                                />
                                {streaming ? (
                                    <button
                                        onClick={stopStreaming}
                                        className="p-2.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors cursor-pointer shrink-0"
                                        title="Stop"
                                    >
                                        <StopCircle className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => sendMessage(input)}
                                        disabled={!input.trim() || !configured}
                                        className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                                        title="Send"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            {toolsEnabled && configured && (
                                <div className="flex items-center gap-1 mt-1.5 px-1">
                                    <Wrench className="w-2.5 h-2.5 text-purple-400/50" />
                                    <span className="text-[9px] text-white/25">Tools enabled</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
