import { motion } from "framer-motion";
import { cn } from "../utils/utils";

// Define the component's props interface with a more generic name.
interface ProgressItemProps {
  label: string;
  completed: number;
  total: number;
  color: string;
}

// The reusable ProgressItem component.
const ProgressItem: React.FC<ProgressItemProps> = ({
  label,
  completed,
  total,
  color,
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-white font-medium">{label}</span>
        <span className="text-blue-200 text-sm">
          {completed}/{total}
        </span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-2">
        <motion.div
          className={cn(color, "h-2 rounded-full transition-all duration-300")}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
        ></motion.div>
      </div>
    </motion.div>
  );
};

export default ProgressItem;
