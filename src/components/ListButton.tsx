import React from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/utils";
// Define the component's props interface for better type-checking.
interface ListButtonProps {
  onClick: () => void;
  text: string;
  icon: React.ReactNode;
  className?: string;
  // New props for customizable colors
  bgColor?: string;
  hoverBgColor?: string;
  textColor?: string;
}

// The reusable ListButton component.
const ListButton: React.FC<ListButtonProps> = ({
  onClick,
  text,
  icon,
  className,
  bgColor = "bg-blue-400/20",
  hoverBgColor = "hover:bg-blue-400/30",
  textColor = "text-gray-200",
}) => {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg transition-all flex items-center space-x-2 cursor-pointer",
        bgColor,
        hoverBgColor,
        textColor,
        className ?? ""
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      <span>{text}</span>
    </motion.button>
  );
};

export default ListButton;
