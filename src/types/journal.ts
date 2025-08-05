export interface JournalEntry {
  id: string;
  date: string;
  type: "progress" | "problem" | "idea";
  title: string;
  content: string;
}
