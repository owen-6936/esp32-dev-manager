import { motion } from "framer-motion";
import Lottie from "lottie-react";

// Define the component's props interface for better type-checking.
interface EmptyStateProps {
  title: string;
  message: string;
  // This prop can now be an object for Lottie or a string for an image URL.
  media: object | string;
  // New prop to specify the type of media.
  mediaType: "lottie" | "image";
  children?: React.ReactNode;
  dimensions?: string;
  bgColor?: string;
  padding?: string;
  border?: string;
}

// The reusable EmptyState component.
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  media,
  mediaType,
  children,
  dimensions = "w-48 h-48",
  bgColor = "bg-white/5",
  border = "border border-white/10",
  padding = "p-12",
}) => {
  const renderMedia = () => {
    if (mediaType === "lottie" && typeof media === "object") {
      return (
        <Lottie animationData={media} loop={true} className={dimensions} />
      );
    } else if (mediaType === "image" && typeof media === "string") {
      return (
        <img
          src={media}
          alt="Empty State Illustration"
          className={`$ {dimensions} mx-auto mb-4`}
        />
      );
    }
    return null;
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center text-blue-200 ${padding} ${bgColor} rounded-xl ${border}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderMedia()}
      <h3 className="text-xl font-semibold m-2">{title}</h3>
      <p className="text-sm mb-4">{message}</p>
      {children}
    </motion.div>
  );
};

export default EmptyState;
