import React from "react";
import { cn } from "../utils/utils";

// Define the component's props interface for better type-checking with TypeScript.
interface ButtonProps {
  variant?: "default" | "outline" | "ghost" | "gradient";
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
    "inline-flex items-center justify-center rounded-lg gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer";

  // Styling based on the 'variant' prop.
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-100",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-100",
    gradient:
      "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700",
  };

  // Styling based on the 'size' prop.
  const sizeStyles = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
