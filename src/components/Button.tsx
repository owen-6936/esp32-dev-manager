import React from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/utils";

// Define the component's props interface for better type-checking with TypeScript.
interface ButtonProps {
  variant?: "default" | "outline" | "ghost" | "gradient" | "classic";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// The main Button component.
const Button = ({
  variant = "default",
  size = "md",
  children,
  onClick,
  className = "",
}: ButtonProps) => {
  // Base styling for all buttons.
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer text-lg sm:text-xl";

  // Styling based on the 'variant' prop.
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-100",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-100",
    gradient:
      "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700",
    classic: "bg-white/10 text-white border border-white/20 hover:bg-white/20",
  };

  // Styling based on the 'size' prop.
  const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97, y: 1 }}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </motion.button>
  );
};

export default Button;
