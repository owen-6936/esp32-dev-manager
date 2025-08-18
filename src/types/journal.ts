export interface JournalEntry {
  id: string;
  date: Date;
  type: "progress" | "problem" | "idea" | "milestone" | "note" | "learning";
  title: string;
  content: string;
  tags: string[];
  projectId: string; // Reference to the project this entry belongs to
  photos?: string[]; // Optional array of photo URLs
  createdAt: Date;
  updatedAt?: Date;
}

export interface JournalState {
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  removeJournalEntry: (id: string) => void;
}
