/* ═══════════════════════════════════════════════════════════════════════════════
   Seed Content — structural data that never changes.
   Used ONLY by syncService.seedStaticData() to populate empty Supabase tables.
   The app always reads from Supabase; this is the one-time bootstrap.
   ═══════════════════════════════════════════════════════════════════════════════ */

// ─── Kits ────────────────────────────────────────────────────────────────────

export const SEED_KITS = [
    {
        sku: "FNK0082",
        name: "Freenove Ultimate Starter Kit for ESP32-S3",
        tier: "ultimate",
        board: "esp32-s3-wroom",
        description:
            "The most complete ESP32-S3 kit with 61 projects covering everything from basic GPIO to WiFi, Bluetooth, Camera and USB HID.",
        tutorial_url:
            "https://github.com/Freenove/Freenove_Ultimate_Starter_Kit_for_ESP32_S3",
        download_url:
            "https://github.com/Freenove/Freenove_Ultimate_Starter_Kit_for_ESP32_S3/archive/main.zip",
        project_count: 61,
        component_count: 200,
        image_url: null,
        color: "#8b5cf6",
        tier_order: 2,
    },
    {
        sku: "FNK0083",
        name: "Freenove Super Starter Kit for ESP32-S3",
        tier: "super",
        board: "esp32-s3-wroom",
        description:
            "Mid-range ESP32-S3 kit with 45 projects covering GPIO, sensors, displays, motors and wireless communication.",
        tutorial_url:
            "https://github.com/Freenove/Freenove_Super_Starter_Kit_for_ESP32_S3",
        download_url:
            "https://github.com/Freenove/Freenove_Super_Starter_Kit_for_ESP32_S3/archive/main.zip",
        project_count: 45,
        component_count: 120,
        image_url: null,
        color: "#3b82f6",
        tier_order: 1,
    },
    {
        sku: "FNK0084",
        name: "Freenove Basic Starter Kit for ESP32-S3",
        tier: "basic",
        board: "esp32-s3-wroom",
        description:
            "Entry-level ESP32-S3 kit with 34 projects covering fundamental GPIO, digital/analog I/O, PWM and serial communication.",
        tutorial_url:
            "https://github.com/Freenove/Freenove_Basic_Starter_Kit_for_ESP32_S3",
        download_url:
            "https://github.com/Freenove/Freenove_Basic_Starter_Kit_for_ESP32_S3/archive/main.zip",
        project_count: 34,
        component_count: 60,
        image_url: null,
        color: "#22c55e",
        tier_order: 0,
    },
] as const;

// ─── Categories ───────────────────────────────────────────────────────────────

export const SEED_CATEGORIES = [
    {
        id: "led_basics",
        name: "LED Basics",
        description:
            "Digital and PWM control of LEDs, RGB LEDs, LED strips and NeoPixel rings",
        icon: "💡",
        color: "#f59e0b",
        project_count: 0,
    },
    {
        id: "audio",
        name: "Audio & Sound",
        description: "Passive buzzers, active buzzers, doorbells and alarms",
        icon: "🔊",
        color: "#8b5cf6",
        project_count: 0,
    },
    {
        id: "serial_communication",
        name: "Serial Communication",
        description:
            "UART serial, I2C, SPI communication protocols and debugging",
        icon: "🔌",
        color: "#6b7280",
        project_count: 0,
    },
    {
        id: "analog_sensors",
        name: "Analog Sensors",
        description: "ADC reading, potentiometers and analog signal processing",
        icon: "📊",
        color: "#ef4444",
        project_count: 0,
    },
    {
        id: "touch_sensing",
        name: "Touch Sensing",
        description: "Capacitive touch input on ESP32-S3 GPIO pins",
        icon: "👆",
        color: "#06b6d4",
        project_count: 0,
    },
    {
        id: "displays",
        name: "Displays",
        description: "7-segment displays, I2C LCD, LED matrix and OLED screens",
        icon: "🖥️",
        color: "#3b82f6",
        project_count: 0,
    },
    {
        id: "motors_actuators",
        name: "Motors & Actuators",
        description:
            "DC motors, stepper motors, servo motors and motor drivers",
        icon: "⚙️",
        color: "#22c55e",
        project_count: 0,
    },
    {
        id: "environmental_sensors",
        name: "Environmental Sensors",
        description:
            "Temperature, humidity, NTC thermistor and DHT11/DHT22 sensors",
        icon: "🌡️",
        color: "#f97316",
        project_count: 0,
    },
    {
        id: "motion_detection",
        name: "Motion Detection",
        description: "Ultrasonic distance sensors, PIR motion sensors",
        icon: "📡",
        color: "#ec4899",
        project_count: 0,
    },
    {
        id: "inertial_measurement",
        name: "Inertial Measurement",
        description: "Gyroscope and accelerometer using MPU6050 over I2C",
        icon: "🎯",
        color: "#a855f7",
        project_count: 0,
    },
    {
        id: "input_devices",
        name: "Input Devices",
        description:
            "Buttons, joysticks, rotary encoders, keypads and RFID readers",
        icon: "🕹️",
        color: "#14b8a6",
        project_count: 0,
    },
    {
        id: "infrared",
        name: "Infrared",
        description: "IR remote controls and NEC protocol decoding",
        icon: "🔴",
        color: "#dc2626",
        project_count: 0,
    },
    {
        id: "bluetooth",
        name: "Bluetooth",
        description:
            "BLE and classic Bluetooth communication with other devices",
        icon: "📶",
        color: "#2563eb",
        project_count: 0,
    },
    {
        id: "wifi_networking",
        name: "WiFi & Networking",
        description: "WiFi station mode, access point, HTTP server and client",
        icon: "🌐",
        color: "#0ea5e9",
        project_count: 0,
    },
    {
        id: "camera",
        name: "Camera",
        description:
            "OV2640/OV3660 camera capture, streaming and image processing",
        icon: "📷",
        color: "#64748b",
        project_count: 0,
    },
    {
        id: "usb_hid",
        name: "USB & HID",
        description: "USB Human Interface Device: keyboard and mouse emulation",
        icon: "🖱️",
        color: "#84cc16",
        project_count: 0,
    },
    {
        id: "storage",
        name: "Storage",
        description: "SD card, SPIFFS and NVS flash storage",
        icon: "💾",
        color: "#78716c",
        project_count: 0,
    },
    {
        id: "light_sensing",
        name: "Light Sensing",
        description:
            "Photoresistors (LDR), ambient light sensors and automatic control",
        icon: "☀️",
        color: "#eab308",
        project_count: 0,
    },
] as const;

// ─── Chapter → Category mapping ──────────────────────────────────────────────

export const CHAPTER_CATEGORY: Record<number, string> = {
    1: "led_basics",
    2: "input_devices",
    3: "led_basics",
    4: "led_basics",
    5: "led_basics",
    6: "led_basics",
    7: "audio",
    8: "serial_communication",
    9: "analog_sensors",
    10: "touch_sensing",
    11: "led_basics",
    12: "light_sensing",
    13: "environmental_sensors",
    14: "input_devices",
    15: "led_basics",
    16: "displays",
    17: "motors_actuators",
    18: "motors_actuators",
    19: "motors_actuators",
    20: "environmental_sensors",
    21: "motion_detection",
    22: "inertial_measurement",
    23: "displays",
    24: "displays",
    25: "infrared",
    26: "infrared",
    27: "serial_communication",
    28: "input_devices",
    29: "bluetooth",
    30: "wifi_networking",
    31: "camera",
    32: "usb_hid",
    33: "storage",
    34: "wifi_networking",
    35: "wifi_networking",
};

export function chapterDifficulty(ch: number): number {
    if (ch <= 5) return 1;
    if (ch <= 12) return 2;
    if (ch <= 20) return 3;
    if (ch <= 27) return 4;
    return 5;
}

// ─── Learning Paths ───────────────────────────────────────────────────────────
// `projects` is left empty here — seedStaticData fills it from the DB after
// projects are inserted.

export const SEED_LEARNING_PATHS = [
    {
        id: "gpio-fundamentals",
        name: "GPIO Fundamentals",
        description:
            "Master the basics of digital I/O, blinking LEDs, button inputs and PWM output",
        icon: "Lightbulb",
        color: "#f59e0b",
        categories: ["led_basics", "input_devices", "analog_sensors"],
        projects: [] as string[],
        estimated_hours: 4,
        difficulty: 1,
        skills: [
            "Digital I/O",
            "PWM",
            "ADC",
            "Debouncing",
            "Pull-up resistors",
        ],
        prerequisites: [],
    },
    {
        id: "sensing-world",
        name: "Sensing the World",
        description:
            "Read real-world data with temperature, touch, light and distance sensors",
        icon: "Radar",
        color: "#22c55e",
        categories: [
            "environmental_sensors",
            "touch_sensing",
            "light_sensing",
            "motion_detection",
        ],
        projects: [] as string[],
        estimated_hours: 5,
        difficulty: 2,
        skills: [
            "NTC Thermistor",
            "DHT11",
            "Capacitive Touch",
            "Photoresistor",
            "Ultrasonic HC-SR04",
        ],
        prerequisites: ["gpio-fundamentals"],
    },
    {
        id: "display-mastery",
        name: "Display Mastery",
        description: "Drive 7-segment displays, LCD screens and LED matrices",
        icon: "Monitor",
        color: "#3b82f6",
        categories: ["displays"],
        projects: [] as string[],
        estimated_hours: 5,
        difficulty: 3,
        skills: [
            "I2C LCD",
            "7-Segment",
            "Shift Registers",
            "LED Matrix",
            "Multiplexing",
        ],
        prerequisites: ["gpio-fundamentals"],
    },
    {
        id: "motion-control",
        name: "Motion Control",
        description: "Control DC motors, stepper motors and servo motors",
        icon: "Cog",
        color: "#ec4899",
        categories: ["motors_actuators"],
        projects: [] as string[],
        estimated_hours: 6,
        difficulty: 3,
        skills: [
            "PWM Motor Control",
            "L298N Driver",
            "28BYJ-48 Stepper",
            "Servo Angle Control",
        ],
        prerequisites: ["gpio-fundamentals"],
    },
    {
        id: "advanced-sensing",
        name: "Advanced Sensing",
        description:
            "Work with gyroscopes, accelerometers, RFID and infrared remotes",
        icon: "Radar",
        color: "#8b5cf6",
        categories: ["inertial_measurement", "infrared", "input_devices"],
        projects: [] as string[],
        estimated_hours: 6,
        difficulty: 4,
        skills: [
            "MPU6050 I2C",
            "Quaternion Math",
            "IR NEC Protocol",
            "RFID RC522",
        ],
        prerequisites: ["sensing-world"],
    },
    {
        id: "wireless-communication",
        name: "Wireless Communication",
        description:
            "Connect to the internet via WiFi and other devices via Bluetooth",
        icon: "Wifi",
        color: "#0ea5e9",
        categories: ["bluetooth", "wifi_networking"],
        projects: [] as string[],
        estimated_hours: 8,
        difficulty: 4,
        skills: ["BLE", "TCP/IP", "HTTP Server", "WebSockets", "JSON Parsing"],
        prerequisites: ["gpio-fundamentals"],
    },
    {
        id: "vision-and-multimedia",
        name: "Vision & Multimedia",
        description:
            "Capture images with the camera module and emulate USB devices",
        icon: "Camera",
        color: "#64748b",
        categories: ["camera", "usb_hid", "storage"],
        projects: [] as string[],
        estimated_hours: 8,
        difficulty: 5,
        skills: [
            "OV2640 Camera",
            "JPEG Capture",
            "USB HID Keyboard",
            "SD Card",
            "SPIFFS",
        ],
        prerequisites: ["wireless-communication"],
    },
    {
        id: "complete-journey",
        name: "Complete Journey",
        description:
            "The full 64-project tour of the Ultimate Starter Kit from blink to camera",
        icon: "Rocket",
        color: "#ef4444",
        categories: [
            "led_basics",
            "input_devices",
            "analog_sensors",
            "touch_sensing",
            "light_sensing",
            "audio",
            "serial_communication",
            "environmental_sensors",
            "motion_detection",
            "displays",
            "motors_actuators",
            "inertial_measurement",
            "infrared",
            "input_devices",
            "bluetooth",
            "wifi_networking",
            "camera",
            "usb_hid",
            "storage",
        ],
        projects: [] as string[],
        estimated_hours: 40,
        difficulty: 3,
        skills: [
            "GPIO",
            "PWM",
            "ADC",
            "I2C",
            "SPI",
            "UART",
            "WiFi",
            "Bluetooth",
            "Camera",
            "USB HID",
            "SD Card",
        ],
        prerequisites: [],
    },
] as const;
