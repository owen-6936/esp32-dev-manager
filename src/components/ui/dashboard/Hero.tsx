import { motion } from "framer-motion";
import { Plus, MapPin, Calculator } from "lucide-react";
import { useState } from "react";
export default function Hero() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showPinMapper, setShowPinMapper] = useState(false);
  const [showPowerCalculator, setShowPowerCalculator] = useState(false);
  return (
    <div className="hero">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
        className="text-center py-12"
      >
        <h2 className="text-2xl sm:text-5xl font-bold text-white mb-4">
          Welcome to Your ESP32 S3 Adventure
        </h2>
        <p className="text-l sm:text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
          Complete project management, component tracking, learning analytics,
          and community features for your ESP32 S3 development journey.
        </p>
        <div className="flex justify-center space-x-4 flex-wrap gap-3 items-center">
          <button
            onClick={() => setShowAddProject(true)}
            className="bg-gradient-btn text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg flex items-center space-x-2 w-max sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Start New Project</span>
          </button>
          <button
            onClick={() => setShowPinMapper(true)}
            className="bg-white/10 text-white px-12 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/20 flex items-center space-x-2"
          >
            <MapPin className="w-5 h-5" />
            <span>Pin Mapper</span>
          </button>
          <button
            onClick={() => setShowPowerCalculator(true)}
            className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/20 flex items-center space-x-2"
          >
            <Calculator className="w-5 h-5" />
            <span>Power Calculator</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
