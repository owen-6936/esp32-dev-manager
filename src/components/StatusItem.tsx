import { motion } from "framer-motion";
import { cn } from "../utils/utils";
// Define the component's props interface.
interface StatusItemProps {
  status: string;
  count: number;
  percentage: number;
}

// Define the colors for each status.
const statusColors: { [key: string]: string } = {
  completed: "bg-green-500",
  "in-progress": "bg-blue-500",
  planning: "bg-yellow-500",
  "on-hold": "bg-gray-500",
};

// The reusable StatusItem component.
const StatusItem: React.FC<StatusItemProps> = ({
  status,
  count,
  percentage,
}) => {
  return (
    <motion.div
      className="flex items-center justify-between"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-blue-200 text-[16px] m-1.5 capitalize">
        {status.replace("-", " ")}
      </span>
      <div className="flex items-center space-x-2">
        <div className="w-32 bg-white/10 rounded-full h-2">
          <motion.div
            className={cn("h-2 rounded-full", statusColors[status])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </div>
        <span className="text-white text-sm w-8 text-right">{count}</span>
      </div>
    </motion.div>
  );
};

export default StatusItem;
