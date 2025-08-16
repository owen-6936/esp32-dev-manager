import { motion, type Variants } from "framer-motion";
import { cn } from "../utils/utils";

// Define the props for the main Card container
interface CardProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
  // Allows the user to provide custom animation variants
  cardVariants?: Variants;
}

// Define the props for the sub-components
interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
}

// Default variants for the framer-motion animation.
const defaultVariants: Variants[] = [
  {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
  }, // Slide up
  {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.15 } },
  }, // Pop in
  {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.15 } },
  }, // Slide left
  {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.15 } },
  }, // Slide right
];

// The main reusable Card component.
const Card: React.FC<CardProps> & {
  Header: React.FC<CardSectionProps>;
  Body: React.FC<CardSectionProps>;
  Footer: React.FC<CardSectionProps>;
} = ({
  children,
  index,
  className,
  cardVariants = defaultVariants[(index ?? 0) % defaultVariants.length],
}) => {
  return (
    <motion.div
      className={cn("bg-white/10 rounded-2xl px-8 py-7", className ?? "")}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: 0.2 + (index || 0) * 0.1, duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

// Sub-component for the card header
const CardHeader: React.FC<CardSectionProps> = ({ children, className }) => (
  <div className={cn("text-xl font-bold text-white mb-4", className ?? "")}>
    {children}
  </div>
);

// Sub-component for the card body
const CardBody: React.FC<CardSectionProps> = ({ children, className }) => (
  <div className={cn("text-blue-200 text-sm", className ?? "")}>{children}</div>
);

// Sub-component for the card footer
const CardFooter: React.FC<CardSectionProps> = ({ children, className }) => (
  <div
    className={cn(
      "mt-4 pt-2 border-t border-white/10 text-xs text-blue-300",
      className ?? ""
    )}
  >
    {children}
  </div>
);

// Assign the sub-components to the main Card component
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
