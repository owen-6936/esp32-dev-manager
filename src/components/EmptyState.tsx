import { motion } from "framer-motion";
import Lottie from "lottie-react";

// Define the component's props interface for better type-checking.
interface EmptyStateProps {
  title: string;
  message: string;
  Button: React.ReactNode;
  // This prop can now be an object for Lottie or a string for an image URL.
  media: object | string;
  // New prop to specify the type of media.
  mediaType: "lottie" | "image";
}

// The reusable EmptyState component.
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  Button,
  media,
  mediaType,
}) => {
  const renderMedia = () => {
    if (mediaType === "lottie" && typeof media === "object") {
      return <Lottie animationData={media} loop={true} className="w-48 h-48" />;
    } else if (mediaType === "image" && typeof media === "string") {
      return (
        <img
          src={media}
          alt="Empty State Illustration"
          className="w-48 h-48 mx-auto mb-4"
        />
      );
    }
    return null;
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center text-blue-200 p-12 bg-white/5 rounded-xl border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {renderMedia()}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm mb-4">{message}</p>
      {Button}
    </motion.div>
  );
};

export default EmptyState;
