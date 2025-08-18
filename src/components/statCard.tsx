import React from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "../utils/utils";
import { defaultVariants } from "../constants/variant";

// Define the component's props interface for better type-checking.
interface StatCardProps {
  title: string;
  value: string | number;
  valueColor?: string;
  subtitle: string;
  subtitleColor?: string;
  subtitleIcon: React.ReactNode;
  icon: React.ReactNode;
  iconBg?: string;
  index?: number;
  className?: string;
  cardVariants?: Variants;
}

// The reusable StatCard component.
const StatCard: React.FC<StatCardProps> = ({
  title = "",
  value = 0,
  valueColor = "text-gray-200",
  subtitle = "",
  subtitleColor = "text-gray-400",
  subtitleIcon,
  icon,
  iconBg = "bg-white/20",
  index = 0,
  className = "",
  cardVariants = defaultVariants[(index ?? 0) % defaultVariants.length],
}) => {
  return (
    <motion.div
      key={index}
      className={cn(
        "bg-white/10 rounded-xl p-5.5 border border-white/20 hover:scale-105 transition-transform duration-300 w-full",
        className
      )}
      variants={cardVariants}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2, margin: "0px" }}
      initial="hidden"
      transition={{ duration: 0.5, delay: 0.2 + (index || 0) * 0.1 }}
      custom={index}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm sm:text-base text-blue-200">{title}</p>
          <p className={cn("text-2xl font-bold", valueColor)}>{value}</p>
          <p
            className={cn(
              "text-xs sm:text-sm flex items-center mt-1 gap-1",
              subtitleColor
            )}
          >
            {subtitleIcon}
            {subtitle}
          </p>
        </div>
        <div className={cn("p-3.5 rounded-lg", iconBg)}>{icon}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;
