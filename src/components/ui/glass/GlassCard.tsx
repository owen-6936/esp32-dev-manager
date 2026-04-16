import { motion, type Variants } from "framer-motion";
import { cn } from "../../../utils/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "strong" | "subtle" | "interactive";
    padding?: string;
    glow?: boolean;
    index?: number;
    onClick?: () => void;
}

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

export default function GlassCard({
    children,
    className,
    variant = "default",
    padding = "p-6",
    glow = false,
    index = 0,
    onClick,
}: GlassCardProps) {
    const variantClasses = {
        default: "glass",
        strong: "glass-strong",
        subtle: "glass-subtle",
        interactive: "glass-interactive cursor-pointer",
    };

    return (
        <motion.div
            className={cn(
                variantClasses[variant],
                "rounded-2xl",
                padding,
                glow && "glow-sm",
                className,
            )}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{
                delay: 0.05 + index * 0.06,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
            }}
            onClick={onClick}
            whileHover={variant === "interactive" ? { scale: 1.01 } : undefined}
            whileTap={variant === "interactive" ? { scale: 0.99 } : undefined}
        >
            {children}
        </motion.div>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface GlassCardHeaderProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    action?: ReactNode;
    gradient?: boolean;
    className?: string;
}

export function GlassCardHeader({
    title,
    subtitle,
    icon,
    action,
    gradient = false,
    className,
}: GlassCardHeaderProps) {
    return (
        <div className={cn("flex items-start justify-between mb-4", className)}>
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                        {icon}
                    </div>
                )}
                <div>
                    <h3
                        className={cn(
                            "text-lg font-semibold",
                            gradient ? "text-gradient" : "text-white",
                        )}
                    >
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm text-blue-200/60 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
