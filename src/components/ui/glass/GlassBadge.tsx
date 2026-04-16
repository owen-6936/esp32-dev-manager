import type { ReactNode } from "react";
import { cn } from "../../../utils/utils";

interface GlassBadgeProps {
    children: ReactNode;
    color?: string;
    size?: "sm" | "md" | "lg";
    variant?: "filled" | "outlined" | "glow";
    className?: string;
}

const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-sm",
};

export default function GlassBadge({
    children,
    color,
    size = "sm",
    variant = "filled",
    className,
}: GlassBadgeProps) {
    const baseClasses = "inline-flex items-center gap-1.5 rounded-full font-medium transition-all";

    const variantClasses = {
        filled: "bg-white/10 text-white/90 border border-white/10",
        outlined: "bg-transparent border text-white/80",
        glow: "bg-white/5 border text-white/90",
    };

    const style = color
        ? {
            borderColor: `${color}40`,
            color: color,
            ...(variant === "filled" && { backgroundColor: `${color}15` }),
            ...(variant === "glow" && {
                backgroundColor: `${color}10`,
                boxShadow: `0 0 12px ${color}20`,
            }),
        }
        : undefined;

    return (
        <span
            className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
            style={style}
        >
            {children}
        </span>
    );
}

// ─── Difficulty Badge ────────────────────────────────────────────────────────

const difficultyConfig = {
    1: { label: "Beginner", color: "#22c55e", icon: "●" },
    2: { label: "Elementary", color: "#3b82f6", icon: "●●" },
    3: { label: "Intermediate", color: "#eab308", icon: "●●●" },
    4: { label: "Advanced", color: "#f97316", icon: "●●●●" },
    5: { label: "Expert", color: "#ef4444", icon: "●●●●●" },
} as const;

interface DifficultyBadgeProps {
    level: 1 | 2 | 3 | 4 | 5;
    showLabel?: boolean;
    size?: "sm" | "md" | "lg";
}

export function DifficultyBadge({ level, showLabel = true, size = "sm" }: DifficultyBadgeProps) {
    const config = difficultyConfig[level];
    return (
        <GlassBadge color={config.color} size={size} variant="glow">
            <span className="text-[0.6em] tracking-wider">{config.icon}</span>
            {showLabel && <span>{config.label}</span>}
        </GlassBadge>
    );
}
