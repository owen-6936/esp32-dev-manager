import { cn } from "../../../utils/utils";
import { Search } from "lucide-react";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    variant?: "default" | "search";
}

export default function GlassInput({
    icon,
    variant = "default",
    className,
    ...props
}: GlassInputProps) {
    return (
        <div className="relative">
            {(icon || variant === "search") && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50">
                    {icon ?? <Search className="w-4 h-4" />}
                </div>
            )}
            <input
                className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5",
                    "text-white placeholder-white/30 text-sm",
                    "focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25",
                    "backdrop-blur-sm transition-all duration-200",
                    "hover:bg-white/8 hover:border-white/15",
                    !!(icon || variant === "search") && "pl-10",
                    className,
                )}
                {...props}
            />
        </div>
    );
}

// ─── Glass Select ────────────────────────────────────────────────────────────

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
    icon?: React.ReactNode;
}

export function GlassSelect({ options, icon, className, ...props }: GlassSelectProps) {
    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300/50">
                    {icon}
                </div>
            )}
            <select
                className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5",
                    "text-white text-sm appearance-none cursor-pointer",
                    "focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/25",
                    "backdrop-blur-sm transition-all duration-200",
                    "hover:bg-white/8 hover:border-white/15",
                    !!icon && "pl-10",
                    className,
                )}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
