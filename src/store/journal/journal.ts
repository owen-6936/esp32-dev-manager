import { create } from "zustand";
import type { StoreApi, UseBoundStore } from "zustand";
import type { JournalEntry, JournalState } from "../../types/journal/journal";

export const useJournalStore: UseBoundStore<StoreApi<JournalState>> = create(
  (set) => ({
    journalEntries: [] as JournalEntry[],
    addEntry: (entry) =>
      set((state) => ({ journalEntries: [...state.journalEntries, entry] })),
    removeEntry: (id) =>
      set((state) => ({
        journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
      })),
  })
);
