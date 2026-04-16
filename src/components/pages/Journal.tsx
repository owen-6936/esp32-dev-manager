import { Plus, Pencil, Trash2 } from "lucide-react";
import emptyStateAnimation from "../../assets/lottie/empty-state.json";
import emptyJournalAnimation from "../../assets/lottie/empty-journal.json";
import useMediaQuery from "../../hooks/useMediaQuery";
import type { JournalEntry } from "../../types/journal";
import EmptyState from "../EmptyState";
import Card from "../Card";
import Button from "../Button";
import AddJournal from "../ui/Modals/AddJournal";
import JournalViewModal from "../ui/Modals/JournalViewModal";
import { useState } from "react";
import useJournalStore from "../../store/journal";

const TYPE_DOT: Record<JournalEntry["type"], string> = {
    progress: "bg-green-400",
    problem: "bg-red-400",
    idea: "bg-yellow-400",
    milestone: "bg-purple-400",
    note: "bg-blue-400",
    learning: "bg-cyan-400",
};

export default function Journal() {
    const [showAddJournal, setShowAddJournal] = useState(false);
    const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
    const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null);
    const journalEntries: JournalEntry[] = useJournalStore(
        (state) => state.journalEntries,
    );
    const removeJournalEntry = useJournalStore((s) => s.removeJournalEntry);
    const isMobile = useMediaQuery("(max-width: 640px)");

    return (
        <div className="space-y-6 min-height p-6">
            {showAddJournal && (
                <AddJournal setShowAddJournal={setShowAddJournal} />
            )}
            {editingEntry && (
                <AddJournal
                    setShowAddJournal={(show) => { if (!show) setEditingEntry(null); }}
                    entry={editingEntry}
                />
            )}
            {viewingEntry && (
                <JournalViewModal
                    entry={viewingEntry}
                    onClose={() => setViewingEntry(null)}
                    onEdit={(entry) => setEditingEntry(entry)}
                    onDelete={(entry) => removeJournalEntry(entry.id)}
                />
            )}
            <div className="flex gap-4 items-center justify-between">
                <h2 className="text-xl sm:text-3xl font-bold text-white">
                    Development Journal
                </h2>
                <Button
                    onClick={() => setShowAddJournal(true)}
                    variant="gradient"
                >
                    <Plus />
                    Add Entry
                </Button>
            </div>

            {journalEntries.length === 0 ? (
                <>
                    {isMobile ? (
                        <EmptyState
                            mediaType="lottie"
                            media={emptyJournalAnimation}
                            title="No Entries Yet"
                            message="Your journal is empty. Start by adding your first entry!"
                            dimensions="w-50 h-full"
                            padding="p-8"
                            bgColor="transparent"
                            border="none"
                        />
                    ) : (
                        <EmptyState
                            mediaType="lottie"
                            media={emptyStateAnimation}
                            title="No Journal Entries"
                            message="Your journal is empty. Start by adding your first entry!"
                            dimensions="w-60 h-50"
                        />
                    )}
                </>
            ) : (
                <div className="space-y-4">
                    {journalEntries.map((entry, index) => (
                        <div
                            key={entry.id}
                            onClick={() => setViewingEntry(entry)}
                            className="cursor-pointer"
                        >
                            <Card
                                index={index}
                                padding="px-5 py-4"
                                className="hover:bg-white/15 transition-colors h-44 overflow-hidden flex flex-col"
                            >
                                {/* Row 1 — title + type + actions */}
                                <div className="flex items-center justify-between mb-2 shrink-0">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div
                                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${TYPE_DOT[entry.type]}`}
                                        />
                                        <h3 className="text-base font-bold text-white truncate">
                                            {entry.title}
                                        </h3>
                                        <span className="bg-white/10 text-blue-200 px-2 py-0.5 rounded text-xs capitalize shrink-0">
                                            {entry.type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                        <span className="text-blue-200/50 text-xs hidden sm:block">
                                            {entry.date.toLocaleDateString()}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingEntry(entry);
                                            }}
                                            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                                            title="Edit entry"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`Delete "${entry.title}"?`)) {
                                                    removeJournalEntry(entry.id);
                                                }
                                            }}
                                            className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                            title="Delete entry"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Row 2 — content preview */}
                                <p className="text-blue-200 text-sm leading-relaxed line-clamp-3 flex-1">
                                    {entry.content}
                                </p>

                                {/* Row 3 — tags */}
                                {entry.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2 shrink-0">
                                        {entry.tags.slice(0, 4).map((tag, i) => (
                                            <span
                                                key={i}
                                                className="bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded text-xs"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                        {entry.tags.length > 4 && (
                                            <span className="text-purple-200/50 text-xs">
                                                +{entry.tags.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
