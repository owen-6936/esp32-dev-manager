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
        icon: Wifi,
        title: "WiFi 6 Support",
        desc: "2.4 GHz band connectivity",
        iconColor: "text-blue-400",
    },
    {
        icon: Bluetooth,
        title: "Bluetooth 5.0",
        desc: "LE & Mesh support",
        iconColor: "text-blue-400",
    },
    {
        icon: Camera,
        title: "Camera Interface",
        desc: "DVP & MIPI CSI support",
        iconColor: "text-purple-400",
    },
    {
        icon: Zap,
        title: "Low Power",
        desc: "Deep sleep modes",
        iconColor: "text-yellow-400",
    },
    {
        icon: Thermometer,
        title: "Built-in Sensors",
        desc: "Temperature sensor",
        iconColor: "text-red-400",
    },
    {
        icon: Cpu,
        title: "AI Acceleration",
        desc: "Neural network and DSP support",
        iconColor: "text-purple-400",
    },
    {
        icon: Usb,
        title: "USB OTG",
        desc: "Acts as host or device",
        iconColor: "text-indigo-400",
    },
    {
        icon: GripVertical,
        title: "More GPIOs",
        desc: "45 programmable I/O pins",
        iconColor: "text-green-400",
    },
    {
        icon: Lock,
        title: "Enhanced Security",
        desc: "Secure boot & flash encryption",
        iconColor: "text-yellow-400",
    },
    {
        icon: BatteryLow,
        title: "ULP Co-processor",
        desc: "Manages tasks in deep sleep",
        iconColor: "text-teal-400",
    },
    {
        icon: Target,
        title: "High Performance",
        desc: "Dual-core Xtensa LX7",
        iconColor: "text-green-400",
    },
];
export const microcontrollerFeatures = features.map((feature) => ({
    ...feature,
    icon: feature.icon,
    title: feature.title,
    desc: feature.desc,
    iconColor: feature.iconColor,
}));
