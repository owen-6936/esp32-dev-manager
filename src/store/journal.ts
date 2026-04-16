import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JournalState } from "../types/journal";

// Revive ISO date strings back to Date objects after JSON.parse
function dateReviver(_key: string, value: unknown): unknown {
    if (
        typeof value === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
    ) {
        return new Date(value);
    }
    return value;
}

const useJournalStore = create<JournalState>()(
    persist(
        (set) => ({
            journalEntries: [],
            addJournalEntry: (entry) =>
                set((state) => ({
                    journalEntries: [...state.journalEntries, entry],
                })),
            updateJournalEntry: (id, updatedFields) =>
                set((state) => ({
                    journalEntries: state.journalEntries.map((entry) =>
                        entry.id === id
                            ? { ...entry, ...updatedFields }
                            : entry,
                    ),
                })),
            removeJournalEntry: (id) =>
                set((state) => ({
                    journalEntries: state.journalEntries.filter(
                        (entry) => entry.id !== id,
                    ),
                })),
        }),
        {
            name: "esp32-journal",
            storage: {
                getItem: (key) => {
                    const raw = localStorage.getItem(key);
                    return raw ? JSON.parse(raw, dateReviver) : null;
                },
                setItem: (key, value) =>
                    localStorage.setItem(key, JSON.stringify(value)),
                removeItem: (key) => localStorage.removeItem(key),
            },
        },
    ),
);

export default useJournalStore;
