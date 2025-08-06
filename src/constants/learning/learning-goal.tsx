import {
  BatteryCharging,
  Cable,
  Clock,
  MemoryStick,
  Server,
  Target,
  Wifi,
} from "lucide-react";
import type { LearningGoal } from "../../types/learning";

export const initialLearningGoals: LearningGoal[] = [
  {
    category: "Master GPIO Control",
    description: "Learn digital and analog I/O operations",
    icon: <Target className="w-5 h-5 text-blue-400" />,
    color: "text-blue-400",
    completed: 0,
    total: 5,
  },
  {
    category: "Wireless Communication",
    description: "Understand WiFi, Bluetooth, HTTP, MQTT protocols",
    icon: <Wifi className="w-5 h-5 text-green-400" />,
    color: "text-green-400",
    completed: 0,
    total: 10,
  },
  {
    category: "Interrupts & Timers",
    description: "Work with advanced timing and event-driven code",
    icon: <Clock className="w-5 h-5 text-yellow-400" />,
    color: "text-yellow-400",
    completed: 0,
    total: 8,
  },
  {
    category: "Power Management",
    description: "Optimize code for low-power consumption",
    icon: <BatteryCharging className="w-5 h-5 text-purple-400" />,
    color: "text-purple-400",
    completed: 0,
    total: 3,
  },
  {
    category: "RTOS Fundamentals",
    description: "Learn FreeRTOS and task scheduling",
    icon: <Server className="w-5 h-5 text-red-400" />,
    color: "text-red-400",
    completed: 0,
    total: 5,
  },
  {
    category: "Peripheral Interfacing",
    description: "Communicate with sensors via I2C, SPI, and UART",
    icon: <Cable className="w-5 h-5 text-indigo-400" />,
    color: "text-indigo-400",
    completed: 0,
    total: 7,
  },
  {
    category: "External Flash & PSRAM",
    description: "Utilize external memory for large-scale projects",
    icon: <MemoryStick className="w-5 h-5 text-cyan-400" />,
    color: "text-cyan-400",
    completed: 0,
    total: 4,
  },
];
