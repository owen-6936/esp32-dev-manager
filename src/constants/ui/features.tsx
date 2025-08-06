import {
  BatteryLow,
  Bluetooth,
  Camera,
  Cpu,
  GripVertical,
  Target,
  Thermometer,
  Usb,
  Wifi,
  Zap,
  Lock,
} from "lucide-react";

export const features = [
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
];
