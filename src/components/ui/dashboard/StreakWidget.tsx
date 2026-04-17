import { useMemo } from "react";
import { Flame } from "lucide-react";
import useJournalStore from "../../../store/journal";
import useProjectStore from "../../../store/project";

function computeStreak(dates: Date[]): number {
    if (dates.length === 0) return 0;

    // Build a Set of unique YYYY-MM-DD strings
    const daySet = new Set(
        dates.map((d) => new Date(d).toISOString().slice(0, 10)),
    );

    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    // Allow today or yesterday as the "current" day for the streak start
    const today = cursor.toISOString().slice(0, 10);
    const t = new Date(cursor);
    t.setDate(t.getDate() - 1);
    const yesterday = t.toISOString().slice(0, 10);

    if (!daySet.has(today) && !daySet.has(yesterday)) return 0;

    // Walk backwards from today
    const walker = new Date(cursor);
    if (!daySet.has(today)) {
        // Start from yesterday
        walker.setDate(walker.getDate() - 1);
    }

    while (daySet.has(walker.toISOString().slice(0, 10))) {
        streak++;
        walker.setDate(walker.getDate() - 1);
    }

    return streak;
}

export default function StreakWidget() {
    const journalEntries = useJournalStore((s) => s.journalEntries);
    const projects = useProjectStore((s) => s.projects);

    const streak = useMemo(() => {
        const dates: Date[] = [
            ...journalEntries.map((e) => new Date(e.createdAt)),
            ...projects.map((p) => new Date(p.startDate)),
        ];
        return computeStreak(dates);
    }, [journalEntries, projects]);

    if (streak === 0) return null;

    return (
        <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-semibold">
                {streak} day{streak !== 1 ? "s" : ""} streak
            </span>
        </div>
    );
}
