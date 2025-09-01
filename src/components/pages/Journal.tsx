import { Plus } from "lucide-react";
import emptyStateAnimation from "../../assets/lottie/empty-state.json";
import emptyJournalAnimation from "../../assets/lottie/empty-journal.json";
import useMediaQuery from "../../hooks/useMediaQuery";
import type { JournalEntry } from "../../types/journal";
import EmptyState from "../EmptyState";
import Card from "../Card";
import Button from "../Button";
import AddJournal from "../ui/Modals/AddJournal";
import { useState } from "react";
import useJournalStore from "../../store/journal";

export default function Journal() {
    const [showAddJournal, setShowAddJournal] = useState(false);
    const journalEntries: JournalEntry[] = useJournalStore(
        (state) => state.journalEntries,
    );
    const isMobile = useMediaQuery("(max-width: 640px)");

    return (
        <div className="space-y-6 min-height p-6">
            {showAddJournal && (
                <AddJournal setShowAddJournal={setShowAddJournal} />
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
                        <Card index={index} key={entry.id}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className={`w-3 h-3 rounded-full ${
                                            entry.type === "learning"
                                                ? "bg-blue-400"
                                                : entry.type === "problem"
                                                  ? "bg-red-400"
                                                  : entry.type === "progress"
                                                    ? "bg-green-400"
                                                    : "bg-yellow-400"
                                        }`}
                                    ></div>
                                    <h3 className="text-xl font-bold text-white">
                                        {entry.title}
                                    </h3>
                                    <span className="bg-white/10 text-blue-200 px-2 py-1 rounded text-xs capitalize">
                                        {entry.type}
                                    </span>
                                </div>
                                <span className="text-blue-200 text-sm">
                                    {entry.date.toDateString()}
                                </span>
                            </div>

                            <p className="text-blue-200 mb-4">
                                {entry.content}
                            </p>

                            {entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {entry.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded text-xs"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
