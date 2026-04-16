import type { Project } from "../types/project";

const getStatusColor = (status: Project["status"]) => {
    switch (status) {
        case "completed":
            return "bg-green-100 text-green-800 border-green-200";
        case "in-progress":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "planning":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "on-hold":
            return "bg-gray-100 text-gray-800 border-gray-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};

const getDifficultyColor = (difficulty: Project["difficulty"]) => {
    switch (difficulty) {
        case "beginner":
            return "bg-green-500";
        case "intermediate":
            return "bg-yellow-500";
        case "advanced":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
};

type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
        case "common":
            return "text-gray-400 bg-gray-500/20";
        case "uncommon":
            return "text-green-400 bg-green-500/20";
        case "rare":
            return "text-blue-400 bg-blue-500/20";
        case "epic":
            return "text-purple-400 bg-purple-500/20";
        case "legendary":
            return "text-yellow-400 bg-yellow-500/20";
        default:
            return "text-gray-400 bg-gray-500/20";
    }
};

function cn(...classes: (string | boolean | undefined | null | 0)[]) {
    return classes.filter(Boolean).join(" ");
}

const inputClass = (errors: Record<string, string>, field: string) =>
    `w-full px-3 py-2 bg-white/10 border ${
        errors[field] ? "border-red-500" : "border-white/20"
    } rounded-lg text-white placeholder-blue-200`;

/**
 * UUID v4 generator that works in browser contexts with Web Crypto support.
 */
export function generateId(): string {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }
    // Fallback: RFC-4122 v4 via getRandomValues
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant
        const hex = Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
    // Never fall back to insecure randomness for identifiers.
    throw new Error(
        "Secure random number generator is unavailable in this environment.",
    );
}

export { getStatusColor, getDifficultyColor, getRarityColor, cn, inputClass };
