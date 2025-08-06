import {
  BatteryLow,
  Bluetooth,
  Camera,
  Code,
  Cpu,
  FileText,
  GripVertical,
  Lock,
  Package,
  Target,
  Thermometer,
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
import Stat from "../ui/dashboard/Stat";
import { useShallow } from "zustand/shallow";
import Hero from "../ui/dashboard/Hero";
import RecentActivity from "../ui/dashboard/RecentActivity";
import type { JournalEntry } from "../../types/journal/journal";
import QuickActions from "../ui/dashboard/QuickActions";
import Deadline from "../ui/dashboard/Deadline";

export default function Dashboard() {
  const projects = useProjectStore((state) => state.projects);

  const {
    totalProjects,
    completedProjects,
    totalComponents,
    totalValue,
    timeSpent,
    budgetUsed,
  } = useStatsStore(
    useShallow((state) => ({
      totalProjects: state.totalProjects,
      completedProjects: state.completedProjects,
      totalComponents: state.totalComponents,
      totalValue: state.totalValue,
      timeSpent: state.timeSpent,
      budgetUsed: state.budgetUsed,
    }))
  );

  const journalEntries: JournalEntry[] = useJournalStore(
    (state) => state.journalEntries
  );

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
      <Hero />
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
        {QuickActions(cardVariants)}
        {RecentActivity(journalEntries, cardVariants)}
        {Deadline({ projects }, cardVariants)}
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
