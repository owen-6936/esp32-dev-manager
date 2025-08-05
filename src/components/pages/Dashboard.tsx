import {
  Calculator,
  Clock,
  Code,
  DollarSign,
  MapPin,
  Package,
  Plus,
  Timer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import "../../styles/pages/dashboard.css";
import { useStatsStore } from "../../store/project/stats";
import { motion } from "framer-motion";

export default function Dashboard() {
  // State management for modals.
  // These states control the visibility of different components or modals.
  const [showAddProject, setShowAddProject] = useState(false);
  const [showPinMapper, setShowPinMapper] = useState(false);
  const [showPowerCalculator, setShowPowerCalculator] = useState(false);

  const totalProjects = useStatsStore((state) => state.totalProjects);
  const completedProjects = useStatsStore((state) => state.completedProjects);
  const totalComponents = useStatsStore((state) => state.totalComponents);
  const totalValue = useStatsStore((state) => state.totalValue);
  const timeSpent = useStatsStore((state) => state.timeSpent);
  const budgetUsed = useStatsStore((state) => state.budgetUsed);

  const statCards = [
    {
      title: "Total Projects",
      value: totalProjects,
      subtitle: `${completedProjects} completed`,
      icon: <Code className="w-6 h-6 text-blue-400" />,
      iconBg: "bg-blue-500/20",
      valueColor: "text-white",
      subtitleColor: "text-green-400",
      subtitleIcon: <TrendingUp className="w-3 h-3 mr-1" />,
      subtitlePrefix: "",
    },
    {
      title: "Components",
      value: totalComponents,
      subtitle: `$${totalValue.toFixed(2)} value`,
      icon: <Package className="w-6 h-6 text-green-400" />,
      iconBg: "bg-green-500/20",
      valueColor: "text-white",
      subtitleColor: "text-blue-400",
      subtitleIcon: <DollarSign className="w-3 h-3 mr-1" />,
      subtitlePrefix: "",
    },
    {
      title: "Time Invested",
      value: `${timeSpent}h`,
      subtitle: `Avg: ${Math.round(timeSpent / (totalProjects || 1))}h/project`,
      icon: <Timer className="w-6 h-6 text-orange-400" />,
      iconBg: "bg-orange-500/20",
      valueColor: "text-white",
      subtitleColor: "text-purple-400",
      subtitleIcon: <Clock className="w-3 h-3 mr-1" />,
      subtitlePrefix: "",
    },
    {
      title: "Budget Used",
      value: `$${budgetUsed}`,
      subtitle: `Avg: $${Math.round(
        budgetUsed / (totalProjects || 1)
      )}/project`,
      icon: <DollarSign className="w-6 h-6 text-purple-400" />,
      iconBg: "bg-purple-500/20",
      valueColor: "text-white",
      subtitleColor: "text-yellow-400",
      subtitleIcon: <TrendingDown className="w-3 h-3 mr-1" />,
      subtitlePrefix: "",
    },
  ];

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
    },
  };

  return (
    <main className="dashboard">
      <div className="hero">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center py-12"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Welcome to Your ESP32 S3 Adventure
          </h2>
          <p className="text-l sm:text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            Complete project management, component tracking, learning analytics,
            and community features for your ESP32 S3 development journey.
          </p>
          <div className="flex justify-center space-x-4 flex-wrap gap-2 items-center">
            <button
              onClick={() => setShowAddProject(true)}
              className="bg-gradient-btn text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Start New Project</span>
            </button>
            <button
              onClick={() => setShowPinMapper(true)}
              className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/20 flex items-center space-x-2"
            >
              <MapPin className="w-5 h-5" />
              <span>Pin Mapper</span>
            </button>
            <button
              onClick={() => setShowPowerCalculator(true)}
              className="bg-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all border border-white/20 flex items-center space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Power Calculator</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Stats Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:scale-105 transition-transform duration-300 cursor-pointer"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
            custom={index}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">{card.title}</p>
                <p className={`text-3xl font-bold ${card.valueColor}`}>
                  {card.value}
                </p>
                <p
                  className={`text-xs flex items-center mt-1 ${card.subtitleColor}`}
                >
                  {card.subtitleIcon}
                  {card.subtitle}
                </p>
              </div>
              <div className={`p-4 rounded-lg ${card.iconBg}`}>{card.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
