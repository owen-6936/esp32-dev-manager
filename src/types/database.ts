/* ═══════════════════════════════════════════════════════════════════════════════
   Supabase Database Types — Generated from schema
   ═══════════════════════════════════════════════════════════════════════════════ */

export interface Database {
    public: {
        Tables: {
            kits: {
                Row: KitRow;
                Insert: KitInsert;
                Update: Partial<KitInsert>;
                Relationships: [];
            };
            projects: {
                Row: ProjectRow;
                Insert: ProjectInsert;
                Update: Partial<ProjectInsert>;
                Relationships: [];
            };
            categories: {
                Row: CategoryRow;
                Insert: CategoryInsert;
                Update: Partial<CategoryInsert>;
                Relationships: [];
            };
            learning_paths: {
                Row: LearningPathRow;
                Insert: LearningPathInsert;
                Update: Partial<LearningPathInsert>;
                Relationships: [];
            };
            sync_logs: {
                Row: SyncLogRow;
                Insert: SyncLogInsert;
                Update: Partial<SyncLogInsert>;
                Relationships: [
                    {
                        foreignKeyName: "sync_logs_kit_sku_fkey";
                        columns: ["kit_sku"];
                        isOneToOne: false;
                        referencedRelation: "kits";
                        referencedColumns: ["sku"];
                    },
                ];
            };
            profiles: {
                Row: ProfileRow;
                Insert: ProfileInsert;
                Update: Partial<ProfileInsert>;
                Relationships: [];
            };
            kit_normalizations: {
                Row: { sku: string; normalized_at: string; created_at: string };
                Insert: { sku: string; normalized_at: string };
                Update: Partial<{ sku: string; normalized_at: string }>;
                Relationships: [];
            };
            user_progress: {
                Row: UserProgressRow;
                Insert: UserProgressInsert;
                Update: Partial<UserProgressInsert>;
                Relationships: [];
            };
            user_xp: {
                Row: UserXpRow;
                Insert: UserXpInsert;
                Update: Partial<UserXpInsert>;
                Relationships: [];
            };
            page_views: {
                Row: PageViewRow;
                Insert: PageViewInsert;
                Update: Partial<PageViewInsert>;
                Relationships: [];
            };
            feedback: {
                Row: FeedbackRow;
                Insert: FeedbackInsert;
                Update: Partial<FeedbackInsert>;
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            kit_tier: "basic" | "super" | "ultimate";
            difficulty_level: 1 | 2 | 3 | 4 | 5;
            sync_status: "pending" | "running" | "success" | "error";
        };
        CompositeTypes: Record<string, never>;
    };
}

// ─── Kits ────────────────────────────────────────────────────────────────────

export interface KitRow {
    id: string;
    sku: string;
    name: string;
    tier: "basic" | "super" | "ultimate";
    board: string;
    description: string;
    tutorial_url: string;
    download_url: string;
    project_count: number;
    component_count: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export type KitInsert = Omit<KitRow, "id" | "created_at" | "updated_at">;

// ─── Projects ────────────────────────────────────────────────────────────────

export interface ProjectRow {
    id: string;
    sketch_id: string;
    name: string;
    full_name: string;
    category: string;
    difficulty: number;
    description: string;
    concepts: string[];
    components: ProjectComponentJson[];
    pins_used: ProjectPinJson[];
    libraries: string[];
    prerequisites: string[];
    arduino_path: string;
    python_path: string | null;
    time_estimate: number;
    learning_objectives: string[];
    kit_tier: "basic" | "super" | "ultimate";
    tags: string[];
    language: "arduino" | "python" | "both";
    /** Supabase Storage path for the Arduino source file */
    arduino_storage_path: string | null;
    /** Supabase Storage path for the Python source file */
    python_storage_path: string | null;
    created_at: string;
    updated_at: string;
}

export type ProjectInsert = Omit<
    ProjectRow,
    "id" | "created_at" | "updated_at"
>;

export interface ProjectComponentJson {
    name: string;
    quantity: number;
    part_number?: string;
    datasheet_path?: string;
    category: string;
}

export interface ProjectPinJson {
    pin: number;
    label: string;
    mode: string;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export interface CategoryRow {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    project_count: number;
    created_at: string;
    updated_at: string;
}

export type CategoryInsert = Omit<CategoryRow, "created_at" | "updated_at">;

// ─── Learning Paths ──────────────────────────────────────────────────────────

export interface LearningPathRow {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    categories: string[];
    projects: string[];
    estimated_hours: number;
    difficulty: number;
    skills: string[];
    prerequisites: string[];
    created_at: string;
    updated_at: string;
}

export type LearningPathInsert = Omit<
    LearningPathRow,
    "created_at" | "updated_at"
>;

// ─── Sync Logs ───────────────────────────────────────────────────────────────

export interface SyncLogRow {
    id: string;
    kit_sku: string;
    status: "pending" | "running" | "success" | "error";
    started_at: string;
    completed_at: string | null;
    files_processed: number;
    files_stored: number;
    error_message: string | null;
    metadata: Record<string, unknown> | null;
}

export type SyncLogInsert = Omit<SyncLogRow, "id">;

// ─── Profiles ────────────────────────────────────────────────────────────────

export interface ProfileRow {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    bio: string;
    job_title: string;
    company: string;
    location: string;
    website: string;
    github_username: string;
    phone: string;
    created_at: string;
    updated_at: string;
}

export type ProfileInsert = Omit<ProfileRow, "created_at" | "updated_at">;

// ─── User Progress ────────────────────────────────────────────────────────────

export interface UserProgressRow {
    id: string;
    user_id: string;
    project_id: string;
    status: "not_started" | "in_progress" | "completed";
    checkpoint: number;
    xp_awarded: boolean;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export type UserProgressInsert = Omit<UserProgressRow, "id" | "created_at">;

// ─── User XP / Leaderboard ────────────────────────────────────────────────────

export interface UserXpRow {
    user_id: string;
    total_xp: number;
    projects_completed: number;
    updated_at: string;
}

export type UserXpInsert = UserXpRow;

// ─── Page Views (Analytics) ──────────────────────────────────────────────────

export interface PageViewRow {
    id: string;
    path: string;
    session_id: string;
    referrer: string | null;
    created_at: string;
}

export type PageViewInsert = Omit<PageViewRow, never>;

// ─── Feedback ────────────────────────────────────────────────────────────────

export interface FeedbackRow {
    id: string;
    type: "bug" | "feature" | "general";
    subject: string;
    message: string;
    email: string | null;
    user_id: string | null;
    status: "open" | "triaged" | "resolved";
    created_at: string;
}

export type FeedbackInsert = Omit<FeedbackRow, "id" | "status" | "created_at">;
