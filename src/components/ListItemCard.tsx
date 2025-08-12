import { motion } from "framer-motion";
import { cn } from "../utils/utils";
// Define the component's props interface for better type-checking.
interface ListItemCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  index: number;
  className?: string;
}

// The reusable ListItemCard component.
const ListItemCard: React.FC<ListItemCardProps> = ({
  icon,
  title,
  desc,
  index,
  className,
}) => {
  return (
    <motion.div
      key={index}
      className={cn("flex items-center space-x-3", className ?? "")}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {icon}
      <div>
        <p className="text-white font-semibold">{title}</p>
        <p className="text-gray-400 text-sm">{desc}</p>
      </div>
    </motion.div>
  );
};

export default ListItemCard;
