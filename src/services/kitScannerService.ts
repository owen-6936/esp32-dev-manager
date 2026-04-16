/* ═══════════════════════════════════════════════════════════════════════════════
   Kit Scanner Service — Discovers Freenove kits from GitHub + tutorial page
   ═══════════════════════════════════════════════════════════════════════════════ */

export interface ScannedKit {
    sku: string;
    name: string;
    hasOnlineTutorial: boolean;
    hasDownload: boolean;
    repoUrl: string | null;
    tutorialUrl: string | null;
    downloadUrl: string | null;
    board: string | null;
    isEsp32S3: boolean;
    lastUpdated: string | null;
    stars: number;
    normalized: boolean;
    normalizedAt: string | null;
}

// ─── Known Freenove tutorial page data ───────────────────────────────────────
// Fetched from https://freenove.com/tutorial — cached because the page
// doesn't allow CORS. This list is synced via the "Refresh" action.
const KNOWN_FREENOVE_KITS: Omit<
    ScannedKit,
    "repoUrl" | "lastUpdated" | "stars" | "normalized" | "normalizedAt"
>[] = [
    {
        sku: "FNK0046",
        name: "Freenove Super Starter Kit for ESP32",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32",
        isEsp32S3: false,
    },
    {
        sku: "FNK0047",
        name: "Freenove Ultimate Starter Kit for ESP32",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32",
        isEsp32S3: false,
    },
    {
        sku: "FNK0053",
        name: "Freenove 4WD Car Kit for ESP32",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32",
        isEsp32S3: false,
    },
    {
        sku: "FNK0060",
        name: "Freenove ESP32-WROVER Board",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32-wrover",
        isEsp32S3: false,
    },
    {
        sku: "FNK0061",
        name: "Freenove Basic Starter Kit for ESP32",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32",
        isEsp32S3: false,
    },
    {
        sku: "FNK0062",
        name: "Freenove Robot Dog Kit for ESP32",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32",
        isEsp32S3: false,
    },
    {
        sku: "FNK0082",
        name: "Freenove Ultimate Starter Kit for ESP32-S3",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: "https://freenove.com/tutorial",
        downloadUrl: "https://freenove.com/tutorial",
        board: "esp32-s3-wroom",
        isEsp32S3: true,
    },
    {
        sku: "FNK0083",
        name: "Freenove Super Starter Kit for ESP32-S3",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: "https://freenove.com/tutorial",
        downloadUrl: "https://freenove.com/tutorial",
        board: "esp32-s3-wroom",
        isEsp32S3: true,
    },
    {
        sku: "FNK0084",
        name: "Freenove Basic Starter Kit for ESP32-S3",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: "https://freenove.com/tutorial",
        downloadUrl: "https://freenove.com/tutorial",
        board: "esp32-s3-wroom",
        isEsp32S3: true,
    },
    {
        sku: "FNK0085",
        name: "Freenove ESP32-S3-WROOM Board",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32-s3-wroom",
        isEsp32S3: true,
    },
    {
        sku: "FNK0086",
        name: "Freenove Development Kit for ESP32-S3",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32-s3",
        isEsp32S3: true,
    },
    {
        sku: "FNK0090",
        name: "Freenove ESP32-WROOM Board",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32-wroom",
        isEsp32S3: false,
    },
    {
        sku: "FNK0091",
        name: "Freenove Breakout Board for ESP32",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32",
        isEsp32S3: false,
    },
    {
        sku: "FNK0099",
        name: "Freenove ESP32-S3-WROOM Board Lite",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32-s3-wroom-lite",
        isEsp32S3: true,
    },
    {
        sku: "FNK0102",
        name: "Freenove Media Kit for ESP32-S3",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32-s3",
        isEsp32S3: true,
    },
    {
        sku: "FNK0103",
        name: "Freenove ESP32 Display",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32",
        isEsp32S3: false,
    },
    {
        sku: "FNK0104",
        name: "Freenove ESP32-S3 Display",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32-s3",
        isEsp32S3: true,
    },
    {
        sku: "FNK0112",
        name: "Freenove ESP32 Mini TV",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32",
        isEsp32S3: false,
    },
    {
        sku: "FNK0114",
        name: "Freenove ESP32 Display",
        hasOnlineTutorial: true,
        hasDownload: true,
        tutorialUrl: null,
        downloadUrl: null,
        board: "esp32",
        isEsp32S3: false,
    },
];

// ─── GitHub repo mapping ─────────────────────────────────────────────────────
const GITHUB_REPO_MAP: Record<string, string> = {
    FNK0082: "Freenove_Ultimate_Starter_Kit_for_ESP32_S3",
    FNK0083: "Freenove_Super_Starter_Kit_for_ESP32_S3",
    FNK0084: "Freenove_Basic_Starter_Kit_for_ESP32_S3",
    FNK0085: "Freenove_ESP32_S3_WROOM_Board",
    FNK0086: "Freenove_Development_Kit_for_ESP32_S3",
    FNK0047: "Freenove_Ultimate_Starter_Kit_for_ESP32",
    FNK0046: "Freenove_Super_Starter_Kit_for_ESP32",
    FNK0061: "Freenove_Basic_Starter_Kit_for_ESP32",
};

interface GitHubRepo {
    name: string;
    html_url: string;
    updated_at: string;
    stargazers_count: number;
}

// ─── Scan GitHub for repo metadata ───────────────────────────────────────────

async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
    const repos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    // Fetch up to 3 pages (300 repos max)
    while (page <= 3) {
        const url = `https://api.github.com/users/Freenove/repos?per_page=${perPage}&page=${page}&sort=updated`;
        const resp = await fetch(url);
        if (!resp.ok) break;
        const data: GitHubRepo[] = await resp.json();
        if (data.length === 0) break;
        repos.push(...data);
        if (data.length < perPage) break;
        page++;
    }

    return repos;
}

// ─── Main scan function ──────────────────────────────────────────────────────

export async function scanFreenoveKits(): Promise<ScannedKit[]> {
    let githubRepos: GitHubRepo[] = [];

    try {
        githubRepos = await fetchGitHubRepos();
    } catch {
        // Continue without GitHub data
    }

    const repoByName = new Map(githubRepos.map((r) => [r.name, r]));

    const scanned = KNOWN_FREENOVE_KITS.map((kit) => {
        const repoName = GITHUB_REPO_MAP[kit.sku];
        const repo = repoName ? repoByName.get(repoName) : undefined;

        return {
            ...kit,
            repoUrl: repo
                ? repo.html_url
                : repoName
                  ? `https://github.com/Freenove/${repoName}`
                  : null,
            lastUpdated: repo?.updated_at ?? null,
            stars: repo?.stargazers_count ?? 0,
            normalized: false,
            normalizedAt: null,
        };
    });

    // Merge persisted normalization state
    return mergeNormalizationState(scanned);
}

// ─── Normalization persistence (localStorage + Supabase) ─────────────────────

import { getSupabaseClient } from "../lib/supabase";

const NORM_STORAGE_KEY = "esp32dm_kit_normalization";

interface NormEntry {
    normalized: boolean;
    normalizedAt: string | null;
}

function loadLocalNormMap(): Record<string, NormEntry> {
    try {
        const raw = localStorage.getItem(NORM_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveLocalNormMap(map: Record<string, NormEntry>): void {
    localStorage.setItem(NORM_STORAGE_KEY, JSON.stringify(map));
}

async function loadSupabaseNormMap(): Promise<Record<string, NormEntry>> {
    const sb = getSupabaseClient();
    if (!sb) return {};
    try {
        const { data } = await sb
            .from("kit_normalizations")
            .select("sku, normalized_at");
        if (!data) return {};
        const map: Record<string, NormEntry> = {};
        for (const row of data) {
            map[row.sku] = {
                normalized: true,
                normalizedAt: row.normalized_at,
            };
        }
        return map;
    } catch {
        return {};
    }
}

function mergeNormalizationState(kits: ScannedKit[]): ScannedKit[] {
    const saved = loadLocalNormMap();
    return kits.map((kit) => {
        const entry = saved[kit.sku];
        return entry ? { ...kit, ...entry } : kit;
    });
}

/** Load normalization state from Supabase (if available) and merge into localStorage */
export async function loadNormalizationFromSupabase(): Promise<void> {
    const remote = await loadSupabaseNormMap();
    if (Object.keys(remote).length === 0) return;
    const local = loadLocalNormMap();
    const merged = { ...local, ...remote };
    saveLocalNormMap(merged);
}

export async function saveNormalization(skus: string[]): Promise<void> {
    const now = new Date().toISOString();
    // Save to localStorage
    const saved = loadLocalNormMap();
    for (const sku of skus) {
        saved[sku] = { normalized: true, normalizedAt: now };
    }
    saveLocalNormMap(saved);

    // Save to Supabase
    const sb = getSupabaseClient();
    if (!sb) return;
    try {
        const rows = skus.map((sku) => ({ sku, normalized_at: now }));
        await sb.from("kit_normalizations").upsert(rows, { onConflict: "sku" });
    } catch {
        console.warn(
            "Failed to save normalization to Supabase — table may not exist yet",
        );
    }
}

// ─── Filter helpers ──────────────────────────────────────────────────────────

export type KitFilter =
    | "all"
    | "esp32-s3"
    | "esp32"
    | "normalized"
    | "not-normalized";

export function filterKits(
    kits: ScannedKit[],
    filter: KitFilter,
    search: string,
): ScannedKit[] {
    let filtered = kits;

    switch (filter) {
        case "esp32-s3":
            filtered = filtered.filter((k) => k.isEsp32S3);
            break;
        case "esp32":
            filtered = filtered.filter((k) => !k.isEsp32S3);
            break;
        case "normalized":
            filtered = filtered.filter((k) => k.normalized);
            break;
        case "not-normalized":
            filtered = filtered.filter((k) => !k.normalized);
            break;
    }

    if (search.trim()) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
            (k) =>
                k.name.toLowerCase().includes(q) ||
                k.sku.toLowerCase().includes(q) ||
                (k.board?.toLowerCase().includes(q) ?? false),
        );
    }

    return filtered;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FULL NORMALIZATION — fetch each kit's GitHub repo, parse .ino files for
// real component / pin / library metadata, and populate all Supabase tables.
// ═══════════════════════════════════════════════════════════════════════════════

import {
    SEED_KITS,
    SEED_CATEGORIES,
    SEED_LEARNING_PATHS,
    CHAPTER_CATEGORY,
    chapterDifficulty,
} from "./seedContent";
import { invalidateCache } from "./tutorialService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectComponentJson {
    name: string;
    quantity: number;
    part_number?: string;
    category: string;
}

interface ProjectPinJson {
    pin: number;
    label: string;
    mode: string;
}

// ─── Component inference tables ───────────────────────────────────────────────

/** Maps known library header filenames to the hardware they require */
const LIBRARY_TO_COMPONENTS: Record<string, ProjectComponentJson[]> = {
    "Freenove_WS2812_Lib_for_ESP32.h": [
        {
            name: "WS2812 NeoPixel LED Strip (8 LEDs)",
            quantity: 1,
            category: "led",
        },
    ],
    "DHT.h": [
        {
            name: "DHT11 Temperature & Humidity Sensor",
            quantity: 1,
            category: "sensor",
        },
    ],
    "DHT11.h": [
        {
            name: "DHT11 Temperature & Humidity Sensor",
            quantity: 1,
            category: "sensor",
        },
    ],
    "LiquidCrystal_I2C.h": [
        { name: "I2C LCD 16×2 Display", quantity: 1, category: "display" },
        { name: "I2C LCD Adapter Module", quantity: 1, category: "misc" },
    ],
    "MPU6050.h": [
        {
            name: "MPU6050 Gyroscope & Accelerometer",
            quantity: 1,
            category: "sensor",
        },
    ],
    "MFRC522.h": [
        { name: "RFID RC522 Reader Module", quantity: 1, category: "misc" },
        { name: "RFID Card / Key Tag", quantity: 1, category: "misc" },
    ],
    "IRremote.h": [
        { name: "IR Remote Control", quantity: 1, category: "misc" },
        { name: "IR Receiver (TSOP1738)", quantity: 1, category: "sensor" },
    ],
    "AccelStepper.h": [
        { name: "28BYJ-48 Stepper Motor", quantity: 1, category: "motor" },
        { name: "ULN2003 Motor Driver Board", quantity: 1, category: "misc" },
    ],
    "ESP32Servo.h": [
        { name: "SG90 Servo Motor", quantity: 1, category: "motor" },
    ],
    "esp_camera.h": [
        { name: "OV2640 Camera Module", quantity: 1, category: "sensor" },
    ],
    "SD.h": [
        { name: "Micro SD Card Module", quantity: 1, category: "misc" },
        { name: "Micro SD Card", quantity: 1, category: "misc" },
    ],
};

/** Fallback components mapped by project category when no library hints are found */
const CATEGORY_DEFAULT_COMPONENTS: Record<string, ProjectComponentJson[]> = {
    led_basics: [
        { name: "LED", quantity: 1, category: "led" },
        { name: "220Ω Resistor", quantity: 1, category: "resistor" },
    ],
    audio: [{ name: "Passive Buzzer", quantity: 1, category: "misc" }],
    input_devices: [
        { name: "Push Button", quantity: 1, category: "misc" },
        { name: "10kΩ Pull-down Resistor", quantity: 1, category: "resistor" },
    ],
    environmental_sensors: [
        { name: "NTC Thermistor", quantity: 1, category: "sensor" },
        { name: "10kΩ Resistor", quantity: 1, category: "resistor" },
    ],
    touch_sensing: [],
    analog_sensors: [
        { name: "Potentiometer (10kΩ)", quantity: 1, category: "misc" },
    ],
    motion_detection: [
        { name: "HC-SR04 Ultrasonic Sensor", quantity: 1, category: "sensor" },
    ],
    displays: [
        {
            name: "7-Segment Display (Common Cathode)",
            quantity: 1,
            category: "display",
        },
    ],
    motors_actuators: [
        { name: "DC Motor", quantity: 1, category: "motor" },
        { name: "L298N Motor Driver Board", quantity: 1, category: "misc" },
    ],
    light_sensing: [
        { name: "Photoresistor (LDR)", quantity: 1, category: "sensor" },
        { name: "10kΩ Resistor", quantity: 1, category: "resistor" },
    ],
    infrared: [
        { name: "IR Remote Control", quantity: 1, category: "misc" },
        { name: "IR Receiver Module", quantity: 1, category: "sensor" },
    ],
    inertial_measurement: [
        { name: "MPU6050 6-DOF IMU Module", quantity: 1, category: "sensor" },
    ],
    bluetooth: [],
    wifi_networking: [],
    camera: [
        {
            name: "OV2640 Camera Module (ESP32-S3 built-in connector)",
            quantity: 1,
            category: "sensor",
        },
    ],
    usb_hid: [],
    storage: [
        { name: "Micro SD Card Module", quantity: 1, category: "misc" },
        { name: "Micro SD Card", quantity: 1, category: "misc" },
    ],
    serial_communication: [],
};

// ─── .ino file parsers ────────────────────────────────────────────────────────

function parseDescriptionFromIno(content: string): string {
    const m = content.match(/\*\s*Description\s*:\s*(.+)/i);
    return m ? m[1].replace(/\*.*$/, "").trim() : "";
}

function parseLibrariesFromIno(content: string): string[] {
    const skip = new Set([
        "Arduino.h",
        "esp32-hal.h",
        "esp32-hal-gpio.h",
        "pgmspace.h",
    ]);
    return [...content.matchAll(/#include\s+[<"]([^>"]+\.h)[>"]/g)]
        .map((m) => m[1])
        .filter((lib) => !skip.has(lib));
}

function parsePinsFromIno(content: string): ProjectPinJson[] {
    const pins = new Map<number, ProjectPinJson>();
    // Match: #define SOMETHING_PIN 2  or  #define PIN_SOMETHING 48
    for (const m of content.matchAll(
        /#define\s+(\w+(?:_PIN|PIN_\w+))\s+(\d+)/gi,
    )) {
        const rawLabel = m[1]
            .replace(/_PIN$/i, "")
            .replace(/^PIN_/i, "")
            .replace(/_/g, " ")
            .toLowerCase()
            .trim();
        const pinNum = parseInt(m[2], 10);
        if (!isNaN(pinNum) && !pins.has(pinNum)) {
            pins.set(pinNum, { pin: pinNum, label: rawLabel, mode: "OUTPUT" });
        }
    }
    return [...pins.values()];
}

function inferComponents(
    libraries: string[],
    category: string,
): ProjectComponentJson[] {
    const seen = new Set<string>();
    const result: ProjectComponentJson[] = [];

    for (const lib of libraries) {
        for (const comp of LIBRARY_TO_COMPONENTS[lib] ?? []) {
            if (!seen.has(comp.name)) {
                seen.add(comp.name);
                result.push(comp);
            }
        }
    }

    // No library-specific hints → fall back to category defaults
    if (result.length === 0) {
        for (const comp of CATEGORY_DEFAULT_COMPONENTS[category] ?? []) {
            if (!seen.has(comp.name)) {
                seen.add(comp.name);
                result.push(comp);
            }
        }
    }

    return result;
}

// ─── GitHub helpers ───────────────────────────────────────────────────────────

async function ghDirContents(
    owner: string,
    repo: string,
    path: string,
): Promise<{ name: string; type: string }[]> {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const resp = await fetch(url, {
        headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!resp.ok) throw new Error(`GitHub API ${resp.status} — ${url}`);
    return resp.json() as Promise<{ name: string; type: string }[]>;
}

async function ghRawFile(
    owner: string,
    repo: string,
    filePath: string,
): Promise<string> {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${filePath}`;
    try {
        const resp = await fetch(url);
        return resp.ok ? await resp.text() : "";
    } catch {
        return "";
    }
}

// ─── ESP32-S3 kit SKUs (bootstrap identifiers — exist in SEED_KITS/DB) ────────
// These are ONLY used to identify which kits form a tiered family during
// normalization. If the platform adds new product lines, add their SKUs here
// or make this configurable via a DB table in the future.
const ESP32S3_BASIC = "FNK0084";
const ESP32S3_SUPER = "FNK0083";
const ESP32S3_ULTIMATE = "FNK0082";
const ESP32S3_SKUS = [ESP32S3_BASIC, ESP32S3_SUPER, ESP32S3_ULTIMATE];
const SKU_TO_TIER: Record<string, "basic" | "super" | "ultimate"> = {
    [ESP32S3_BASIC]: "basic",
    [ESP32S3_SUPER]: "super",
    [ESP32S3_ULTIMATE]: "ultimate",
};

// ─── Project row builder ──────────────────────────────────────────────────────

function buildProjectRow(
    folderName: string,
    index: number,
    inoContent: string,
    tier: "basic" | "super" | "ultimate",
) {
    const m = folderName.match(/^Sketch_(\d+)\.(\d+)_(.+)$/);
    if (!m) return null;

    const chapter = parseInt(m[1], 10);
    const sub = parseInt(m[2], 10);
    const numericId = `${String(chapter).padStart(2, "0")}.${sub}`;
    const sketchId = `${tier}-${numericId}`;
    const namePart = m[3].replace(/_/g, " ");

    const category = CHAPTER_CATEGORY[chapter] ?? "analog_sensors";
    const difficulty = chapterDifficulty(chapter);

    const libraries = parseLibrariesFromIno(inoContent);
    const pinsUsed = parsePinsFromIno(inoContent);
    const components = inferComponents(libraries, category);
    const description =
        parseDescriptionFromIno(inoContent) ||
        `${namePart} — learn ${category.replace(/_/g, " ")} with the ESP32-S3.`;

    return {
        sketch_id: sketchId,
        name: namePart,
        full_name: `Sketch ${numericId}: ${namePart}`,
        category,
        difficulty,
        description,
        concepts: [] as string[],
        components,
        pins_used: pinsUsed,
        libraries,
        prerequisites: [] as string[],
        arduino_path: `C/Sketches/${folderName}`,
        python_path: `Python/Python_Codes/Python_${String(chapter).padStart(2, "0")}.${sub}_${m[3]}`,
        time_estimate: 15 + difficulty * 10 + (sub > 1 ? 10 : 0),
        learning_objectives: [
            `Complete ${namePart} using Arduino C++`,
            `Understand ${category.replace(/_/g, " ")} on ESP32-S3`,
        ],
        kit_tier: tier,
        tags: [category, `chapter-${chapter}`, "freenove", "esp32-s3"],
        language: "both" as const,
    };
}

// ─── Kit row builder ──────────────────────────────────────────────────────────

function buildKitRow(sku: string) {
    // Prefer the authoritative SEED_KITS entry
    const seed = [...SEED_KITS].find((k) => k.sku === sku);
    if (seed) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
            color: _color,
            tier_order: _tier_order,
            ...rest
        } = seed as typeof seed & {
            color?: string;
            tier_order?: number;
        };
        return { ...rest };
    }

    // Fall back to KNOWN_FREENOVE_KITS
    const known = KNOWN_FREENOVE_KITS.find((k) => k.sku === sku);
    if (!known) return null;

    const name = known.name.toLowerCase();
    const tier: "basic" | "super" | "ultimate" = name.includes("ultimate")
        ? "ultimate"
        : name.includes("super")
          ? "super"
          : "basic";

    return {
        sku,
        name: known.name,
        tier,
        board: known.board ?? "esp32-s3-wroom",
        description: `${known.name} — ESP32 development kit by Freenove.`,
        tutorial_url: known.tutorialUrl ?? "",
        download_url: known.downloadUrl ?? "",
        project_count: 0,
        component_count: 0,
        image_url: null as string | null,
    };
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Fully normalizes the given kit SKUs into Supabase:
 *   1. Upserts the kit row
 *   2. Each kit creates projects from its OWN GitHub repo
 *      (sketch_id = "tier-chapter.sub", e.g. "basic-01.1")
 *   3. Cleans up orphaned rows per-kit and old-style (non-prefixed) rows
 *   4. Updates kit.project_count for each kit (own projects only)
 *   5. Rebuilds category counts and learning paths
 *   6. Records the normalization timestamp
 */
export async function normalizeKitsToSupabase(
    skus: string[],
    onProgress: (msg: string) => void,
): Promise<{ success: boolean; error?: string }> {
    const client = getSupabaseClient();
    if (!client) return { success: false, error: "Supabase is not configured" };

    const OWNER = "Freenove";
    const now = new Date().toISOString();
    const esp32s3Skus = skus.filter((s) => ESP32S3_SKUS.includes(s));

    try {
        // ── Ensure all 18 categories exist first ───────────────────────────────
        onProgress("Ensuring categories exist…");
        await client
            .from("categories")
            .upsert([...SEED_CATEGORIES], { onConflict: "id" });

        // ── Process each requested kit ─────────────────────────────────────────
        const allKitProjectIds: string[] = [];

        for (const sku of skus) {
            const repoName = GITHUB_REPO_MAP[sku];

            if (!repoName) {
                onProgress(
                    `${sku}: no GitHub repo mapped — marking as normalized`,
                );
                await client
                    .from("kit_normalizations")
                    .upsert([{ sku, normalized_at: now }], {
                        onConflict: "sku",
                    });
                continue;
            }

            // ── 1. Upsert kit row ──────────────────────────────────────────────
            const kitRow = buildKitRow(sku);
            if (!kitRow) {
                onProgress(`${sku}: unknown kit — skipping`);
                continue;
            }
            onProgress(`${sku}: upserting kit — "${kitRow.name}"`);
            const { error: kitErr } = await client
                .from("kits")
                .upsert([kitRow], { onConflict: "sku" });
            if (kitErr)
                throw new Error(`Kit upsert (${sku}): ${kitErr.message}`);

            // Resolve tier for this kit
            const tier = SKU_TO_TIER[sku];
            if (!tier) {
                // Non-ESP32-S3 kits don't create projects
                onProgress(`${sku}: kit registered — no project source`);
                await client
                    .from("kit_normalizations")
                    .upsert([{ sku, normalized_at: now }], {
                        onConflict: "sku",
                    });
                continue;
            }

            // ── 2. Fetch sketch directory listing ──────────────────────────────
            onProgress(`${sku}: fetching sketch list from GitHub…`);
            const entries = await ghDirContents(OWNER, repoName, "C/Sketches");
            const sketchDirs = entries
                .filter((e) => e.type === "dir" && e.name.startsWith("Sketch_"))
                .map((e) => e.name)
                .sort();
            onProgress(
                `${sku}: ${sketchDirs.length} sketches found — downloading .ino files…`,
            );

            // ── 3. Fetch .ino files in parallel batches, build project rows ────
            const projectRows: NonNullable<
                ReturnType<typeof buildProjectRow>
            >[] = [];
            const FETCH_BATCH = 6;

            for (let b = 0; b < sketchDirs.length; b += FETCH_BATCH) {
                const chunk = sketchDirs.slice(b, b + FETCH_BATCH);
                const contents = await Promise.all(
                    chunk.map((dir) =>
                        ghRawFile(
                            OWNER,
                            repoName,
                            `C/Sketches/${dir}/${dir}.ino`,
                        ),
                    ),
                );
                for (let i = 0; i < chunk.length; i++) {
                    const row = buildProjectRow(
                        chunk[i],
                        b + i,
                        contents[i],
                        tier,
                    );
                    if (row) projectRows.push(row);
                }
                onProgress(
                    `${sku}: parsed ${Math.min(b + FETCH_BATCH, sketchDirs.length)} / ${sketchDirs.length} sketches…`,
                );
            }

            // ── 4. Upsert projects to Supabase in batches of 20 ───────────────
            const UPSERT_BATCH = 20;
            for (let b = 0; b < projectRows.length; b += UPSERT_BATCH) {
                const batch = projectRows.slice(b, b + UPSERT_BATCH);
                const { error: projErr } = await client
                    .from("projects")
                    .upsert(batch as never[], { onConflict: "sketch_id" });
                if (projErr)
                    throw new Error(
                        `Projects upsert (${sku}, batch ${b}): ${projErr.message}`,
                    );
            }
            onProgress(`${sku}: ${projectRows.length} projects upserted ✓`);

            // Track all created IDs for orphan cleanup
            allKitProjectIds.push(...projectRows.map((r) => r.sketch_id));

            // Clean up orphaned rows for THIS kit's tier only
            const { data: existingRows } = await client
                .from("projects")
                .select("sketch_id")
                .eq("kit_tier", tier);
            if (existingRows) {
                const validSet = new Set(projectRows.map((r) => r.sketch_id));
                const orphanIds = existingRows
                    .filter((r) => !validSet.has(r.sketch_id))
                    .map((r) => r.sketch_id);
                if (orphanIds.length > 0) {
                    for (let b = 0; b < orphanIds.length; b += 50) {
                        await client
                            .from("projects")
                            .delete()
                            .in("sketch_id", orphanIds.slice(b, b + 50));
                    }
                    onProgress(
                        `  ${tier}: removed ${orphanIds.length} orphaned row(s)`,
                    );
                }
            }

            // ── 5. Record normalization in Supabase + localStorage ─────────────
            await client
                .from("kit_normalizations")
                .upsert([{ sku, normalized_at: now }], { onConflict: "sku" });
        }

        // ── Also clean old-style tier-less project rows (pre-migration) ────────
        {
            const { data: allRows } = await client
                .from("projects")
                .select("sketch_id");
            if (allRows) {
                const oldStyleIds = allRows
                    .filter(
                        (r) => !/^(basic|super|ultimate)-/.test(r.sketch_id),
                    )
                    .map((r) => r.sketch_id);
                if (oldStyleIds.length > 0) {
                    for (let b = 0; b < oldStyleIds.length; b += 50) {
                        await client
                            .from("projects")
                            .delete()
                            .in("sketch_id", oldStyleIds.slice(b, b + 50));
                    }
                    onProgress(
                        `Cleaned ${oldStyleIds.length} old-style project row(s)`,
                    );
                }
            }
        }

        // ── Final pass: update counts + kit project_counts + learning paths ────
        onProgress("Updating category and kit project counts…");
        const { data: allProjects } = await client
            .from("projects")
            .select("sketch_id, category, kit_tier")
            .order("sketch_id");

        if (allProjects && allProjects.length > 0) {
            // Update category project_counts
            for (const cat of SEED_CATEGORIES) {
                const count = allProjects.filter(
                    (p) => p.category === cat.id,
                ).length;
                if (count > 0) {
                    await client
                        .from("categories")
                        .update({ project_count: count })
                        .eq("id", cat.id);
                }
            }

            // Update kit project_counts — each kit owns its own projects
            for (const sku of esp32s3Skus) {
                const tier = SKU_TO_TIER[sku];
                if (!tier) continue;
                const count = allProjects.filter(
                    (p) => p.kit_tier === tier,
                ).length;
                await client
                    .from("kits")
                    .update({ project_count: count })
                    .eq("sku", sku);
                onProgress(`  ${tier} kit: ${count} projects`);
            }

            onProgress("Rebuilding learning paths…");
            const pathRows = SEED_LEARNING_PATHS.map((path) => {
                const isComplete = path.id === "complete-journey";
                const projects = isComplete
                    ? allProjects.map((p) => p.sketch_id)
                    : allProjects
                          .filter((p) =>
                              (path.categories as readonly string[]).includes(
                                  p.category,
                              ),
                          )
                          .map((p) => p.sketch_id);
                return {
                    id: path.id,
                    name: path.name,
                    description: path.description,
                    icon: path.icon,
                    color: path.color,
                    categories: [...path.categories],
                    projects,
                    estimated_hours: path.estimated_hours,
                    difficulty: path.difficulty,
                    skills: [...path.skills],
                    prerequisites: [...path.prerequisites],
                };
            });
            await client
                .from("learning_paths")
                .upsert(pathRows, { onConflict: "id" });
        }

        // ── Persist normalization state to localStorage ────────────────────────
        invalidateCache();
        const localMap = loadLocalNormMap();
        for (const sku of skus) {
            localMap[sku] = { normalized: true, normalizedAt: now };
        }
        saveLocalNormMap(localMap);

        onProgress(`Done ✓ — ${skus.length} kit(s) fully normalized`);
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { success: false, error: message };
    }
}

// ─── Standalone orphan cleanup ────────────────────────────────────────────────

/**
 * Fetch all 3 kit repos' sketch lists and delete any DB rows whose
 * sketch_id doesn't match a valid kit-prefixed ID. Also handles
 * old-style (non-prefixed) IDs from before the kit-scoped migration.
 */
export async function cleanOrphanProjects(
    onProgress: (msg: string) => void,
): Promise<{ removed: number; error?: string }> {
    const client = getSupabaseClient();
    if (!client) return { removed: 0, error: "Supabase is not configured" };

    try {
        const OWNER = "Freenove";
        const validIds = new Set<string>();

        for (const [tier, sku] of Object.entries(SKU_TO_TIER).map(
            ([s, t]) => [t, s] as const,
        )) {
            const repoName = GITHUB_REPO_MAP[sku];
            if (!repoName) continue;
            onProgress(`Fetching ${tier} sketch list from GitHub…`);
            try {
                const entries = await ghDirContents(
                    OWNER,
                    repoName,
                    "C/Sketches",
                );
                for (const e of entries) {
                    if (e.type !== "dir" || !e.name.startsWith("Sketch_"))
                        continue;
                    const m = e.name.match(/^Sketch_(\d+)\.(\d+)_/);
                    if (m) {
                        validIds.add(
                            `${tier}-${String(parseInt(m[1], 10)).padStart(2, "0")}.${m[2]}`,
                        );
                    }
                }
            } catch {
                onProgress(`  ⚠ Could not fetch ${tier} kit sketch list`);
            }
        }

        onProgress(`Found ${validIds.size} valid sketch IDs — checking DB…`);
        const { data: allRows } = await client
            .from("projects")
            .select("sketch_id");
        if (!allRows) return { removed: 0 };

        const orphanIds = allRows
            .filter((r) => !validIds.has(r.sketch_id))
            .map((r) => r.sketch_id);

        if (orphanIds.length === 0) {
            onProgress("No orphan rows found ✓");
            return { removed: 0 };
        }

        for (let b = 0; b < orphanIds.length; b += 50) {
            await client
                .from("projects")
                .delete()
                .in("sketch_id", orphanIds.slice(b, b + 50));
        }

        invalidateCache();
        onProgress(`Removed ${orphanIds.length} orphan row(s) ✓`);
        return { removed: orphanIds.length };
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { removed: 0, error: message };
    }
}
