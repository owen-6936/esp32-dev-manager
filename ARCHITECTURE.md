# Architecture Overview

> ESP32 Dev Manager — a glassmorphic dashboard for tracking ESP32-S3 embedded development with Freenove tutorial integration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript 5.8 |
| Build | Vite 7 + SWC |
| Styling | Tailwind CSS 4 (glassmorphic design system) |
| State | Zustand 5 (component, project, journal stores) |
| Animation | Framer Motion 12 |
| 3D | Three.js + React Three Fiber + Drei |
| Backend | Supabase (optional — DB + Storage + Auth) |
| PWA | vite-plugin-pwa |
| Testing | Vitest 4 + Testing Library |
| Package Manager | pnpm |

## Project Structure

```
src/
├── components/           # React components
│   ├── pages/            # Route-level page components
│   ├── ui/               # Reusable UI primitives
│   │   └── glass/        # Glassmorphic design system components
│   ├── ErrorBoundary.tsx  # Page-level error boundary
│   └── Navbar.tsx
├── constants/            # Static configuration & enumerations
├── data/
│   └── freenove/         # Static Freenove tutorial catalog
│       ├── projects.ts   # 61 projects with full metadata
│       ├── kits.ts       # 3 kit tiers (Basic/Super/Ultimate)
│       ├── categories.ts # 18 tutorial categories
│       └── learning-paths.ts  # 9 curated learning paths
├── hooks/                # Custom React hooks
├── layouts/              # Layout components (RootLayout)
├── lib/
│   └── supabase.ts       # Lazy Supabase client singleton
├── routes/               # React Router configuration
├── services/
│   ├── tutorialService.ts  # Data layer (Supabase-first, static fallback)
│   └── syncService.ts      # Admin sync: static data → Supabase
├── store/                # Zustand stores
├── test/                 # Vitest test suites
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Key Architecture Decisions

### 1. Supabase is Optional (Graceful Degradation)

The app works fully offline using bundled static data. Supabase is only used when environment variables are configured.

```
┌─────────────┐    configured?    ┌──────────────┐
│ React Hooks  │───────────────▶ │   Supabase   │
│ (useTutorial │       │         │  (DB + Storage)│
│  Data.ts)    │       │ no      └──────────────┘
└─────────────┘       ▼
                ┌──────────────┐
                │ Static Data  │
                │ (freenove/)  │
                └──────────────┘
```

**How it works:**

- `getSupabaseClient()` returns `null` if env vars are missing (never crashes)
- Every service function checks for a valid client first
- On failure or null client, returns static data from `src/data/freenove/`
- `getDataSource()` tells the UI which backend is active

### 2. Service Layer Pattern

Services sit between React hooks and the data sources:

```
React Component → Hook (useTutorialData) → Service (tutorialService) → Supabase | Static
```

- **Hooks** handle React lifecycle (loading, error, dependencies)
- **Services** handle data fetching, mapping, and fallback logic
- **No Supabase imports in components** — fully decoupled

### 3. Static Data as Source of Truth

The `src/data/freenove/` directory contains the complete Freenove ESP32-S3 tutorial catalog. This data is:

- Bundled into the app (always available)
- Used as fallback when Supabase is unavailable
- Seedable to Supabase via the Admin Panel sync feature

### 4. Error Boundaries

`ErrorBoundary` wraps page content in `RootLayout`, catching render errors without crashing the whole app. The glassmorphic error UI offers a "Try Again" button.

## Data Flow

### Tutorial Browsing

```
TutorialBrowser → useProjects() → fetchProjects() → db()?.from("projects") || freenoveProjects
```

### Admin Sync

```
AdminPanel → seedStaticData(onProgress) → getSupabaseClient()!.from("kits").upsert(...)
                                        → getSupabaseClient()!.from("categories").upsert(...)
                                        → getSupabaseClient()!.from("projects").upsert(...)
                                        → getSupabaseClient()!.from("learning_paths").upsert(...)
```

## Testing

Run tests:

```bash
pnpm test          # Single run
pnpm test:watch    # Watch mode
pnpm test:coverage # With coverage report
```

Test suites:

- **static-data.test.ts** — Data integrity: counts, uniqueness, referential integrity across projects/kits/categories/paths
- **supabase-client.test.ts** — Lazy client creation, null when unconfigured
- **tutorial-service.test.ts** — Static fallback when Supabase is unavailable
- **sync-service.test.ts** — Graceful error handling when unconfigured

## Environment Variables

```bash
# Optional — app works without these (uses static data)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

See [supabase/schema.sql](supabase/schema.sql) for the full migration including:

- `kits`, `projects`, `categories`, `learning_paths` tables
- Row-Level Security (RLS) policies
- Auto-updated `updated_at` timestamps
- Composite indexes for common queries
- `sync_logs` for tracking admin sync operations
