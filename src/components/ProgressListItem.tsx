import { motion } from "framer-motion";
import { cn } from "../utils/utils";

// Define the component's props interface for better type-checking.
interface ProgressListItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  percentage: number;
  color: string;
}

// Define the component, ProgressListItem
const ProgressListItem: React.FC<ProgressListItemProps> = ({
  icon,
  title,
  description,
  percentage,
  color,
}) => {
  return (
    <motion.div
      className="bg-white/5 rounded-lg p-4 border border-white/10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-2 mb-3">
        {icon}
        <h4 className="text-white font-semibold">{title}</h4>
      </div>
      <p className="text-blue-200 text-sm mb-3">{description}</p>
      <div className="w-full bg-white/10 rounded-full h-1">
        <motion.div
          className={cn(color, "h-1 rounded-full")}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default ProgressListItem;
