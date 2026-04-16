// ─── Board & Kit Types ───────────────────────────────────────────────────────

export type BoardVariant = "esp32-s3-wroom" | "esp32-s3-wroom-lite";

export type KitTier = "basic" | "super" | "ultimate";

export interface FreenoveKit {
    sku: string;
    name: string;
    tier: KitTier;
    board: BoardVariant;
    description: string;
    tutorialUrl: string;
    downloadUrl: string;
    projectCount: number;
    componentCount: number;
    imageUrl?: string;
    /** Display color for this kit's tier (from DB; gray fallback) */
    color?: string;
    /** Numeric ordering: 0 = lowest tier, higher = more features */
    tierOrder?: number;
}

// ─── Tutorial Project Types ──────────────────────────────────────────────────

export type TutorialCategory =
    | "led_basics"
    | "audio"
    | "serial_communication"
    | "analog_sensors"
    | "touch_sensing"
    | "displays"
    | "motors_actuators"
    | "environmental_sensors"
    | "motion_detection"
    | "inertial_measurement"
    | "input_devices"
    | "infrared"
    | "bluetooth"
    | "wifi_networking"
    | "camera"
    | "usb_hid"
    | "storage"
    | "light_sensing";

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type PinMode =
    | "GPIO"
    | "ADC"
    | "PWM"
    | "I2C_SDA"
    | "I2C_SCL"
    | "SPI_MOSI"
    | "SPI_MISO"
    | "SPI_SCK"
    | "SPI_CS"
    | "UART_TX"
    | "UART_RX"
    | "I2S"
    | "TOUCH"
    | "USB"
    | "DIGITAL";

export interface TutorialPin {
    pin: number;
    label: string;
    mode: PinMode;
}

export type HardwareCategory =
    | "led"
    | "resistor"
    | "capacitor"
    | "button"
    | "buzzer"
    | "sensor"
    | "motor"
    | "display"
    | "module"
    | "connector"
    | "ic"
    | "camera"
    | "relay"
    | "potentiometer"
    | "misc";

export interface TutorialComponent {
    name: string;
    quantity: number;
    partNumber?: string;
    datasheetPath?: string;
    category: HardwareCategory;
}

export interface TutorialProject {
    id: string;
    sketchId: string;
    /** Numeric chapter.sub id for display (e.g. "01.1") — strip kit prefix */
    displayId: string;
    name: string;
    fullName: string;
    category: TutorialCategory;
    difficulty: DifficultyLevel;
    description: string;
    concepts: string[];
    components: TutorialComponent[];
    pinsUsed: TutorialPin[];
    libraries: string[];
    prerequisites: string[];
    arduinoPath: string;
    pythonPath?: string;
    timeEstimate: number; // minutes
    learningObjectives: string[];
    kitTier: KitTier; // minimum kit tier required
    tags: string[];
    language: "arduino" | "python" | "both";
    arduinoStoragePath?: string;
    pythonStoragePath?: string;
}

// ─── Learning Path Types ─────────────────────────────────────────────────────

export interface LearningPath {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    categories: TutorialCategory[];
    projects: string[]; // project IDs in order
    estimatedHours: number;
    difficulty: DifficultyLevel;
    skills: string[];
    prerequisites: string[];
}

export interface LearningProgress {
    pathId: string;
    completedProjects: string[];
    currentProject?: string;
    startedAt: string;
    lastActivityAt: string;
    notes: Record<string, string>; // projectId -> notes
}

// ─── Category Metadata ───────────────────────────────────────────────────────

export interface CategoryMeta {
    id: TutorialCategory;
    name: string;
    description: string;
    icon: string;
    color: string;
    projectCount: number;
}

// ─── Admin Types ─────────────────────────────────────────────────────────────

export interface TutorialDataSource {
    sku: string;
    name: string;
    lastUpdated: string;
    projectCount: number;
    status: "synced" | "outdated" | "error";
    localPath: string;
}

export interface AdminStats {
    totalProjects: number;
    totalComponents: number;
    totalPaths: number;
    totalKits: number;
    lastSync: string;
}
