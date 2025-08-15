import { motion } from "framer-motion";
import { Calculator, MapPin, Plus } from "lucide-react";
import Button from "../../Button";

export default function Hero() {
  return (
    <div className="hero">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="text-center pt-2"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Welcome to Your ESP32 S3 Adventure
        </h2>
        <p className="text-l sm:text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
          Complete project management, component tracking, learning analytics,
          and community features for your ESP32 S3 development journey.
        </p>
        <div className="flex justify-center space-x-4 flex-wrap gap-3 items-center">
          <Button variant="gradient" className="py-5 px-8">
            <Plus className="w-5 h-5" />
            <span>Start New Project</span>
          </Button>
          <Button variant="classic" className="py-5 px-8">
            <MapPin className="w-5 h-5" />
            <span>Pin Mapper</span>
          </Button>
          <Button variant="classic" className="py-5 px-8">
            <Calculator className="w-5 h-5" />
            <span>Power Calculator</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
