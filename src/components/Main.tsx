import { Calculator, MapPin, Plus } from "lucide-react";
import "../styles/main.css";
import { useState } from "react";

export default function Main() {
  // State management for modals.
  // These states control the visibility of different components or modals.
  const [showAddProject, setShowAddProject] = useState(false);
  const [showPinMapper, setShowPinMapper] = useState(false);
  const [showPowerCalculator, setShowPowerCalculator] = useState(false);

  return (
    <main className="main">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Welcome to Your ESP32 S3 Adventure
          </h2>
          <p className="text-l sm:text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Complete project management, component tracking, learning analytics,
            and community features for your ESP32 S3 development journey.
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-2">
            <button
              onClick={() => setShowAddProject(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Start New Project</span>
            </button>
            <button
              onClick={() => setShowPinMapper(true)}
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/20 flex items-center space-x-2"
            >
              <MapPin className="w-5 h-5" />
              <span>Pin Mapper</span>
            </button>
            <button
              onClick={() => setShowPowerCalculator(true)}
              className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/20 flex items-center space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Power Calculator</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
