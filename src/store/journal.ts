import { create } from "zustand";
import type { StoreApi, UseBoundStore } from "zustand";
import type { JournalState } from "../types/journal";

const useJournalStore: UseBoundStore<StoreApi<JournalState>> = create(
  (set) => ({
    journalEntries: [],
    addJournalEntry: (entry) =>
      set((state) => ({ journalEntries: [...state.journalEntries, entry] })),
    removeJournalEntry: (id) =>
      set((state) => ({
        journalEntries: state.journalEntries.filter((entry) => entry.id !== id),
      })),
  }),
);

export default useJournalStore;
