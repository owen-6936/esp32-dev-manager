import {
  BatteryLow,
  Bluetooth,
  Calculator,
  Camera,
  Clock,
  Code,
  Cpu,
  DollarSign,
  FileText,
  GripVertical,
  Lock,
  MapPin,
  Package,
  Plus,
  Target,
  Thermometer,
  Timer,
  TrendingDown,
  TrendingUp,
  Usb,
  Wifi,
  Zap,
} from "lucide-react";
import { useState } from "react";
import "../../styles/pages/dashboard.css";
import { useStatsStore } from "../../store/project/stats";
import { motion } from "framer-motion";
import { useProjectStore } from "../../store/project/project";
import { useJournalStore } from "../../store/journal/journal";
import { statCards } from "../../constants/ui/stat";
import Stat from "../ui/Stat";

export default function Dashboard() {
  // State management for modals.
  // These states control the visibility of different components or modals.
  const [showAddProject, setShowAddProject] = useState(false);
  const [showPinMapper, setShowPinMapper] = useState(false);
  const [showPowerCalculator, setShowPowerCalculator] = useState(false);
  const [showAddJournal, setShowAddJournal] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  const projects = useProjectStore((state) => state.projects);

  const totalProjects = useStatsStore((state) => state.totalProjects);
  const completedProjects = useStatsStore((state) => state.completedProjects);
  const totalComponents = useStatsStore((state) => state.totalComponents);
  const totalValue = useStatsStore((state) => state.totalValue);
  const timeSpent = useStatsStore((state) => state.timeSpent);
  const budgetUsed = useStatsStore((state) => state.budgetUsed);

  const journalEntries = useJournalStore((state) => state.journalEntries);

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

  const props = {
    totalProjects,
    completedProjects,
    totalComponents,
    totalValue,
    timeSpent,
    budgetUsed,
  };

  return (
    <main className="dashboard">
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

      {/* Enhanced Stats Grid */}

      <div className="flex flex-wrap items-center justify-center gap-6 sm:w-[80%] mt-5">
        {statCards(props).map((card, index) =>
          Stat(
            {
              index: index,
              title: card.title,
              value: card.value,
              subtitle: card.subtitle,
              icon: card.icon,
              iconBg: card.iconBg,
              valueColor: card.valueColor,
              subtitleColor: card.subtitleColor,
              subtitleIcon: card.subtitleIcon,
            },
            cardVariants
          )
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-6 mt-5 w-[90%]">
        {/* Quick Actions */}
        <motion.div
          className="bg-white/10 rounded-xl p-6 border border-white/20 sm:w-[82%] w-full hover:scale-105 transition-transform duration-300 mt-5"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => setShowAddJournal(true)}
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 p-3 rounded-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Add Journal Entry</span>
            </button>
            <button className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-200 p-3 rounded-lg transition-all flex items-center space-x-2 cursor-pointer">
              <Package className="w-4 h-4" />
              <span>Manage Inventory</span>
            </button>
            <button
              onClick={() => setShowCodeEditor(true)}
              className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 p-3 rounded-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Code className="w-4 h-4" />
              <span>Code Snippets</span>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-white/10 rounded-xl p-6 border border-white/20 sm:w-[82%] mt-5 w-full hover:scale-105 transition-transform duration-300"
          variants={cardVariants}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          initial="hidden"
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {journalEntries.slice(0, 3).map((entry, i) => (
              <motion.div
                key={entry.id}
                className="bg-white/5 rounded-lg p-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      entry.type === "learning"
                        ? "bg-blue-400"
                        : entry.type === "problem"
                        ? "bg-red-400"
                        : entry.type === "progress"
                        ? "bg-green-400"
                        : "bg-yellow-400"
                    }`}
                  />
                  <span className="text-white text-sm font-medium truncate">
                    {entry.title}
                  </span>
                </div>
                <p className="text-blue-200 text-xs">{entry.date}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          className="bg-white/10 rounded-xl p-6 border border-white/20 sm:w-[82%] w-full hover:scale-105 transition-transform duration-300 mt-5"
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {projects
              .filter((p) => p.deadline && p.status !== "completed")
              .sort(
                (a, b) =>
                  new Date(a.deadline!).getTime() -
                  new Date(b.deadline!).getTime()
              )
              .slice(0, 3)
              .map((project, i) => {
                const daysLeft = Math.ceil(
                  (new Date(project.deadline!).getTime() -
                    new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return (
                  <motion.div
                    key={project.id}
                    className="bg-white/5 rounded-lg p-3"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-medium truncate flex-1 mr-2">
                        {project.title}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                          daysLeft < 0
                            ? "bg-red-500/20 text-red-300"
                            : daysLeft <= 7
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {daysLeft < 0 ? "Overdue" : `${daysLeft} days`}
                      </span>
                    </div>
                    <p className="text-blue-200 text-xs">
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : ""}
                    </p>
                  </motion.div>
                );
              })}
            {projects.filter((p) => p.deadline && p.status !== "completed")
              .length === 0 && (
              <p className="text-blue-200 text-sm">No upcoming deadlines</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* ESP32 S3 Capabilities Section */}
      <motion.div
        className="bg-white/10 rounded-xl p-8 border border-white/20 sm:w-[73%] mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
          },
        }}
      >
        <h3 className="text-2xl font-bold text-white mb-6">
          ESP32 S3 Capabilities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Wifi className="w-6 h-6 text-blue-400" />,
              title: "WiFi 6 Support",
              desc: "2.4 GHz band connectivity",
            },
            {
              icon: <Bluetooth className="w-6 h-6 text-blue-400" />,
              title: "Bluetooth 5.0",
              desc: "LE & Mesh support",
            },
            {
              icon: <Camera className="w-6 h-6 text-purple-400" />,
              title: "Camera Interface",
              desc: "DVP & MIPI CSI support",
            },
            {
              icon: <Zap className="w-6 h-6 text-yellow-400" />,
              title: "Low Power",
              desc: "Deep sleep modes",
            },
            {
              icon: <Thermometer className="w-6 h-6 text-red-400" />,
              title: "Built-in Sensors",
              desc: "Temperature sensor",
            },
            {
              icon: <Cpu className="w-6 h-6 text-purple-400" />,
              title: "AI Acceleration",
              desc: "Neural network and DSP support",
            },
            {
              icon: <Usb className="w-6 h-6 text-indigo-400" />,
              title: "USB OTG",
              desc: "Acts as host or device",
            },
            {
              icon: <GripVertical className="w-6 h-6 text-green-400" />,
              title: "More GPIOs",
              desc: "45 programmable I/O pins",
            },
            {
              icon: <Lock className="w-6 h-6 text-yellow-400" />,
              title: "Enhanced Security",
              desc: "Secure boot & flash encryption",
            },
            {
              icon: <BatteryLow className="w-6 h-6 text-teal-400" />,
              title: "ULP Co-processor",
              desc: "Manages tasks in deep sleep",
            },
            {
              icon: <Target className="w-6 h-6 text-green-400" />,
              title: "High Performance",
              desc: "Dual-core Xtensa LX7",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {item.icon}
              <div>
                <p className="text-white font-semibold">{item.title}</p>
                <p className="text-blue-200 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
