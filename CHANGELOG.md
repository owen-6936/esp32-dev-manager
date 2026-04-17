# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html):
`MAJOR.MINOR.PATCH[-prerelease]` — e.g. `0.1.0-beta.1`.

---

## [Unreleased]

> Changes on `develop` not yet cut into a release.

---

## [0.1.0-beta.1] — 2026-04-16

First public beta. The application has been rebuilt from a stub into a
feature-complete embedded systems development tracker. Core features are stable;
some areas (2FA, advanced progress sync edge cases) are still marked "coming
soon".

---

### Added — Pages

- **`/workshop`** — Tab shell (`projects | components | pins | journal |
  analytics`) consolidating all development tools in one place.
- **`/learn`** — Tab shell (`Tutorials | Roadmap | Progress`) for the full
  learning section; syncs active tab with `?tab=` query param.
- **`/tutorials/:id`** — Full per-project deep-dive: auto-generated wiring
  steps from pin metadata, Arduino/Python code viewer (Supabase Storage → GitHub
  raw URL fallback), checkpoint progress tracker with XP toast, prerequisite
  graph and "Next Steps" list.
- **`/leaderboard`** — Global XP leaderboard (top 50 from `user_xp` table) with
  personal stats card (rank icon, level, XP, completed projects) and rank legend
  (Novice → Grandmaster, 7 tiers).
- **`/login`** — Combined login/signup page with email+password, Google OAuth,
  email confirmation-sent screen, and smart "already registered" conflict error
  that directs users to account linking.
- **`/auth/callback`** — PKCE code-exchange handler: reads `?code=`,
  calls `exchangeCodeForSession`, falls back to `getSession()` if verifier was
  already consumed (Strict Mode guard via `useRef`).
- **`/admin`** — 7-tab admin panel: overview stats, projects table (pagination
  - search), kit scanner (15 Freenove SKUs with GitHub stars / last-push),
  bulk normalise to Supabase with live progress, analytics dashboard, sync logs,
  seed/run buttons.
- **`PinMapper`** — ESP32-S3 GPIO allocation visualiser. Builds a
  `Map<pin, PinUsage[]>` from all workshop projects. Color-codes pins by function
  (GPIO / ADC / I²C / SPI / UART / USB / Strapping). Highlights conflicts in red.
  Filter bar: all / used / free / boot-USB.
- **`LearningRoadmap`** — Learning path grid with per-path XP progress bars,
  skill tag clouds, difficulty badges, and project/hour/skill counts. Drills
  into a selected path to show individual projects with completion checkmarks.
- **`TutorialBrowser`** — Full search / filter UI for Freenove tutorials: text
  search, category dropdown, difficulty radio (1–5), kit tier filter. Grid/list
  toggle. Lock icon for unowned kit tiers. Reads `?search=` from query params
  (set by AI tool).

---

### Added — UI Components

- **`SplashScreen`** — Animated ESP32-S3 chip SVG (36 pins, 9 per side). Four
  sequential loading steps (session → kits → tutorials → ready). Pins illuminate
  progressively. Framer Motion exit animation. Pre-fetches kit and tutorial data
  before the main UI mounts.
- **`AIChat`** — Floating AI assistant (bottom-right, resizable). Streaming
  responses via OpenRouter SSE with stop button (`AbortController`). Markdown
  renderer with GFM tables and syntax-highlighted code blocks (One Dark theme).
  Per-block copy button. **17 tool actions**: `navigate`, `open_project`,
  `search_projects`, `filter_tutorials`, `open_inventory`, `open_journal`,
  `add_journal`, `edit_journal`, `delete_journal`, `search_journals`,
  `get_journal_entry`, `get_user_stats`, `list_user_projects`,
  `open_workshop_tab`, `open_feedback`, `get_progress_for`,
  `show_learning_path`. 5 quick-prompt presets. Model fallback chain:
  `qwen/qwen3-14b:free` → `nvidia/nemotron-3-nano-30b-a3b:free` →
  `openai/gpt-oss-120b:free`.
- **`CookieBanner`** — Fixed bottom-center consent dialog. "Accept all" enables
  analytics; "Essential only" disables. Persists consent in localStorage and
  syncs with `usePrivacyPrefs`. Only shown on first visit.
- **`ErrorBoundary`** — Class-based React error boundary with `resetKey` prop
  (resets on route change). Shows error message with "Try Again" button.
- **`FeedbackModal`** — 3-type feedback form (Bug / Feature / General).
  Submits to Supabase `feedback` table; falls back to `mailto:` in new tab.
  Tracks submission via analytics. Success animation on done.
- **`BuyMeCoffee`** — Floating link button with 2.5s delayed entrance and
  hover-expand label.
- **`CodeViewer`** — Read-only syntax-highlighted code viewer
  (`prism-react-renderer`, Night Owl). Optional line numbers and copy button.
- **`JournalViewModal`** — Full-screen read-only journal entry view with
  markdown rendering, type badge, timestamps, and edit/delete actions.
- **`TutorialPicker`** — Modal that converts a `TutorialProject` to a `Project`
  and adds it to the workshop, filling in components, pin configs, tasks and
  `linkedTutorialId`.
- **`ProtectedRoute`** / **`AdminRoute`** — Route guards with loading spinner
  and redirect to `/login` or `/`.
- **`DailyTip`** — 12-tip ESP32/embedded tip bank. Picks one per day (stored in
  localStorage). Has "dismiss" and "next tip" buttons.
- **`StreakWidget`** — Computes consecutive-day activity streak from journal and
  project dates. Only shown when `streak > 0`.
- **`MyKit`** (account tab) — Kit selector from Supabase data; derives merged
  component inventory from owned kit tiers.
- **Glass UI system** (`src/components/ui/glass/`):
  - `GlassCard` — `motion.div` with viewport-triggered stagger animation, 4
    glass variants, `GlassCardHeader` with icon/subtitle/action slots.
  - `GlassBadge` / `DifficultyBadge` — Pill badges with hex color prop,
    filled/outlined/glow variants, 5-level difficulty config.
  - `GlassInput` / `GlassSelect` — Tailwind focus-ring inputs with icon slot.

---

### Added — Services, Hooks & Stores

- **`aiService.ts`** — OpenRouter wrapper: `streamChat` (SSE with
  `ReadableStream`), `chatCompletion` (one-shot), `parseToolCalls` (regex
  JSON extraction from fenced blocks), `stripToolBlocks`, `AI_TOOLS_PROMPT`,
  `AI_QUICK_PROMPTS`, `isAIConfigured`.
- **`analyticsService.ts`** — localStorage-first analytics with optional
  Supabase mirror. Rolling 90-day window, 5k entry cap. `trackPageView`,
  `trackEvent`, `getAnalyticsSummary` (daily buckets / top pages / growth %),
  `clearAnalytics`, `getAllEvents` / `getStoredEvents`. All writes gated by
  `getAllowUsageData()`.
- **`tutorialService.ts`** — Supabase-first data service with 5-minute
  localStorage cache (stale-while-revalidate). Fetches projects, kits,
  categories, learning paths, and code files. Full mapper layer for DB snake_case
  → TS camelCase types.
- **`kitScannerService.ts`** — 15 Freenove kit SKU catalog, GitHub API star/date
  resolution, Supabase normalise upsert with progress callback.
- **`progressService.ts`** — Cloud sync for `user_progress` and `user_xp`
  tables. `fetchLeaderboard` (top 50 with parallel profile lookups).
- **`syncService.ts`** — Admin-only: `seedStaticData` (crawls GitHub Contents
  API, normalises sketch folder names, builds project rows, inserts to
  Supabase), `syncCodeFiles` (uploads `.ino`/`.py` to Supabase Storage).
- **`seedContent.ts`** — 3 kits, 18 categories, 5+ learning paths, chapter →
  category/difficulty mapping for static bootstrap.
- **`store/progress.ts`** — Zustand persisted store. `startProject`,
  `advanceCheckpoint`, `completeProject` (minted once via `xpAwarded` flag),
  `completedCount`, `completedProjects`. Exports `RANK_THRESHOLDS`,
  `XP_PER_DIFFICULTY`, `getRank(xp)`, `getLevel(xp)`, `xpToNextRank`.
- **`store/kit.ts`** — Persisted owned-kit SKU list with `toggleKit`,
  `setOwnedSkus`, `ownsKit`.
- **`usePrivacyPrefs.ts`** — `allowUsageData` (default: **true**) +
  `receiveEmails` persisted in localStorage. Cross-tab sync via storage event.
  `getAllowUsageData()` synchronous helper for use outside React.
- **`useTutorialData.ts`** — `useAsyncData<T>` infrastructure; public hooks:
  `useProjects`, `useProject`, `useSearchProjects`, `useKits`,
  `useCategories`, `useLearningPaths`.
- **`utils/kitHelpers.ts`** — Database-driven tier utilities: `kitColor`,
  `sortKitsByTier`, `tierOrder`, `includedTiers`, `highestOwnedKit`,
  `buildIncludedTiersMap`.

---

### Added — Auth & Data Layer

- **`lib/auth.ts`** — Full Supabase auth module: email sign-in/sign-up/OAuth
  (PKCE, `select_account`), `linkIdentity` / `unlinkIdentity`, `signOut`,
  `deleteAccount` (cascading delete across all user-owned tables + RPC call),
  `getSession`, `onAuthStateChange`, profile CRUD, `changePassword`,
  `sendPasswordReset`.
- **`lib/supabase.ts`** — Lazy singleton `SupabaseClient<Database>`.
  `flowType: "pkce"`, `detectSessionFromUrl: false`. Returns `null` if
  unconfigured so the app degrades gracefully offline.
- **`contexts/AuthContext.tsx`** — Provider wrapping the whole app. Bootstraps
  from `getSession` + `onAuthStateChange`. Exposes `user`, `profile`, `session`,
  `loading`, `isAdmin`, `linkedProviders`, all auth actions.
- **`types/database.ts`** — TypeScript types for all 11 Supabase tables
  (`Row`, `Insert`, `Update`, `Relationships`).
- **`supabase/schema.sql`** — Full DDL: 9 tables with constraints, GIN/B-tree
  indexes, auto-profile trigger (`handle_new_user` SECURITY DEFINER).
- **`supabase/migrations/20260409_analytics_feedback.sql`** — `page_views` and
  `feedback` tables with RLS policies (insert-only for anon, read-own for users,
  admin-only reads for page_views).

---

### Added — Test Suite (211 tests, 14 files)

- `ai-service.test.ts` (31) — `parseToolCalls` (all 17 tools, malformed JSON,
  missing fields), `stripToolBlocks`, `isAIConfigured`.
- `analytics-service.test.ts` (28) — storage, session IDs, daily bucket
  aggregation, top pages, growth %, privacy opt-out gate, corruption resilience.
- `component-store.test.ts` (18) — all 8 hardware categories, edge cases.
- `journal-store.test.ts` (18) — all 6 entry types, date ISO revival.
- `kit-scanner.test.ts` (1) — unconfigured Supabase early-return.
- `kit-store.test.ts` (6) — tier hierarchy `includedTiers` (basic ⊂ super ⊂ ultimate).
- `privacy-prefs.test.ts` (11) — defaults, opt-in/out, persistence, corruption.
- `progress-store.test.ts` (6) — rank thresholds ordering/fields, XP per
  difficulty monotonicity.
- `project-store.test.ts` (19) — all 4 statuses, localStorage persistence.
- `seed-content.test.ts` (11) — 3 kits, tier hierarchy, ≥18 categories (unique
  IDs, valid hex colors), ≥5 learning paths, cross-reference integrity.
- `supabase-client.test.ts` (4) — `isSupabaseConfigured` with/without env vars.
- `sync-service.test.ts` (4) — all functions return errors when unconfigured.
- `tutorial-service.test.ts` (26) — offline/cache paths, all fetch functions,
  `getDataSource`, `invalidateCache`.
- `utils.test.ts` (28) — `getStatusColor`, `getDifficultyColor`,
  `getRarityColor`, `cn`, `inputClass`.

---

### Added — Infrastructure & Config

- **PWA** (`vite-plugin-pwa`): `autoUpdate` service worker, web app manifest
  (standalone, 192/512 icons), Workbox runtime caching for 3D model files
  (`CacheFirst`, 30-day expiry) and Google Fonts (1-year expiry).
- **`ARCHITECTURE.md`** — Tech stack table, full directory tree, key decisions
  (Supabase-optional graceful degradation, Supabase-first with localStorage
  cache, kit tier hierarchy, AI tool system, PWA).
- **`.env.example`** — Documents all 4 environment variables.
- **`.github/workflows/codeql.yml`** — CodeQL security scanning on push/PR to
  `main` and weekly Monday 08:00 UTC schedule. `security-and-quality` query
  suite, SARIF upload.
- **`src/index.css`** — Complete glassmorphic design system v2.0: CSS custom
  properties, `@utility` blocks (`bg-gradient`, `glass`/`glass-strong`/
  `glass-subtle`/`glass-interactive`, `glow-sm/md/lg`, `text-gradient`,
  `bg-orb-1/2/3`, `noise-overlay`), card-hover transforms, custom scrollbar.
- **`public/favicon.svg`**, **`pwa-192x192.png`**, **`pwa-512x512.png`** — App
  icons.
- **`pnpm-workspace.yaml`** + lockfile — Migrated from npm to pnpm.

---

### Changed

- **`Dashboard`** — Live-data connected: uses `useTutorialData` hooks for
  counts. Added `DailyTip`, `StreakWidget`, "Freenove Tutorial Gateway" card with
  live category/path/kit links, and lazy-loaded ESP32 3D model via
  `IntersectionObserver`.
- **`Inventory`** — Now derives component list from owned kit SKUs × kit project
  metadata instead of a static list. Merges with user-added components; dedupes
  by name.
- **`Project`** — Added "From Tutorial" button that opens `TutorialPicker` to
  clone a Freenove project into the workshop.
- **`Journal`** — Wired `JournalViewModal` on entry clicks.
- **`Navbar`** — Reads `useAuth` + `useProgressStore`; shows XP, rank icon,
  Admin tab (admin-only), login/account state. All new routes included in tab
  map.
- **`CodeEditor`** (modal) — Full CRUD snippet manager: per-snippet language
  selector (10 options), tag input (slug-normalised), collapse/expand, copy with
  check feedback.
- **`RecentActivity`** — Now pulls from live journal + project stores, merged
  and sorted by date descending. Relative timestamps. Journal type icons.
- **`QuickActions`** — "Manage Inventory" now navigates to
  `/workshop?tab=components`.
- **`account/Profile`** — Inline edit with Supabase save (`updateProfile` +
  `refreshProfile`). Spinner on save. Initials avatar fallback.
- **`account/Security`** — Connected accounts card: Google link/unlink with
  guard (must have email login before unlinking).
- **`account/DataAndPrivacy`** — Comprehensive export (projects + journal +
  components + kit + analytics JSON download). Delete account with typed
  confirmation phrase (`"delete my account"`), cascading Supabase delete + local
  store clear.
- **`account/AccountContent`** — Live profile from AuthContext; "My Kit" tab;
  sign-out button.
- **`store/journal.ts`** — Added `dateReviver` localStorage adapter to revive
  ISO-8601 strings back to `Date` objects.
- **`types/project.ts`** — Added `CodeSnippet`, `task`, `pinConfig`,
  `linkedTutorialId`, `codeSnippets` fields.
- **`types/journal.ts`** — Added `updatedAt?: Date`.
- **`utils/utils.ts`** — Added `cn()`, `generateId()` (3-tier
  `crypto.randomUUID` polyfill), `getRarityColor()`.
- **`vite.config.ts`** — PWA plugin, `@` path alias, coverage thresholds raised
  to 85 % lines/functions/statements and 80 % branches.
- **`index.html`** — Full PWA meta tags (theme-color, apple-mobile-web-app).
- **`RootLayout`** — Wraps app in `AuthProvider`; mounts `SplashScreen` with
  exit animation; tracks route changes with `trackPageView`; listens for
  `"open-feedback"` event; renders `AIChat`, `BuyMeCoffee`, `CookieBanner`.
- **`Router`** — All new routes registered.
- **`package.json`** — Version bumped to `0.1.0-beta.1`; corrected repository
  URL; added `release` script; `bugs`/`homepage` fields added.

---

### Fixed

- `crypto.randomUUID` crashing in non-secure (HTTP) dev contexts — replaced all
  call sites with `generateId()` polyfill.
- Google OAuth `redirect_uri_mismatch` — `redirectTo` now correctly points at
  `/auth/callback` (not origin root).
- PKCE verifier-not-found error caused by Supabase auto-detecting `?code=`
  before the callback page ran — fixed with `detectSessionFromUrl: false`.
- Dashboard stat cards, `QuickActions`, `RecentActivity`, `Deadline` components
  throwing on missing/null data.
- Dead "Edit" button on project cards (`updateProject` was not wired to store).
- AI chat referencing `.projects` instead of `.progress` on the progress store.
- Journal `Date` objects becoming strings after localStorage round-trip.
- `signInWithGoogle` not branching: now calls `linkIdentity` if a user is
  already signed in, instead of always starting a new OAuth flow.

---

### Security

- All `crypto.randomUUID` call sites replaced with a hardened polyfill.
- CodeQL scanning enabled on every push/PR and weekly.
- Supabase PKCE flow enforced (`flowType: "pkce"`); implicit flow disabled.
- `detectSessionFromUrl: false` prevents token leakage via URL on
  non-callback pages.
- Supabase RLS policies enforce row-level access for all user data tables.
- AI chat link renderer rejects non-HTTPS URLs to prevent XSS via crafted links.
- `delete_own_account` Postgres function required for full auth-user deletion
  (must be created via `SECURITY DEFINER` — see README).

---

## Version guide

| Pattern | Meaning |
|---|---|
| `0.x.0-beta.y` | Public beta — may have breaking changes between betas |
| `0.x.0-rc.y` | Release candidate — feature-frozen, bug-fixes only |
| `0.x.0` | Stable minor release |
| `0.x.y` | Patch / hotfix |
| `1.0.0` | First stable production release |

[Unreleased]: https://github.com/owen-6936/esp32-dev-manager/compare/v0.1.0-beta.1...HEAD
[0.1.0-beta.1]: https://github.com/owen-6936/esp32-dev-manager/releases/tag/v0.1.0-beta.1

### Added

- **Google OAuth sign-in** — PKCE flow with `/auth/callback` exchange handler
- **Account linking** — link/unlink Google from Account → Security while already signed in
- **Cookie consent banner** — "Accept all" / "Essential only" on first visit
- **Privacy preferences** — `allowUsageData` (default ON) and `receiveEmails` persisted in localStorage; respected by all analytics calls
- **Export all data** — downloads projects, journal entries, components, kit inventory and analytics as a single JSON file
- **Delete account** — full cascade delete (all user rows + auth user via `delete_own_account` RPC) with typed confirmation phrase
- **Connected accounts card** in Security page — shows Google linked/unlinked status with Link / Unlink button
- **CodeQL workflow** — weekly + push/PR security scanning (`.github/workflows/codeql.yml`)
- **`generateId()` polyfill** — 3-tier fallback for `crypto.randomUUID` in non-secure contexts
- **AI chat** with 17 tools, streaming, stop-streaming, and persistent history
- **Analytics dashboard** — page views, event tracking, 7/30-day charts, top pages
- **Journal** — rich entries with tags, mood, date filtering and search
- **Workshop** (Code Editor) — full CRUD for project code snippets
- **Progress & XP system** — rank ladder from Novice → Grandmaster with level display
- **Kit scanner** — inventory management for ESP32 S3 starter kit components
- **Achievements** — 20+ unlockable achievements with rarity tiers
- **Leaderboard** — ranked view of XP across projects
- **PWA** — installable, offline-capable, model asset caching
- **Splash screen** with animated Lottie intro
- **Buy Me a Coffee** widget and in-app feedback modal

### Changed

- Supabase client now uses `flowType: 'pkce'` + `detectSessionFromUrl: false` to prevent double code-exchange errors
- `signInWithGoogle` branches on auth state: links identity if already signed in, otherwise starts fresh OAuth
- `ToggleRow` in DataAndPrivacy is now a controlled component (state persisted, not ephemeral)
- Coverage thresholds raised to 85 % lines/functions/statements, 80 % branches

### Fixed

- `crypto.randomUUID` crashing in HTTP (non-secure) dev contexts
- Google OAuth `redirect_uri_mismatch` — `redirectTo` now correctly points at `/auth/callback`
- PKCE verifier-not-found error caused by Supabase auto-detecting the `?code=` before the callback page ran
- Dashboard stat cards, QuickActions, RecentActivity, and Deadline components throwing on missing data
- Dead "Edit" button on project cards
- AI chat `.projects` → `.progress` store key bug

### Security

- All `crypto.randomUUID` calls replaced with a hardened polyfill
- CodeQL scanning enabled on every push and weekly
- Supabase PKCE flow enforced; implicit flow disabled

---

## Version guide

| Version pattern | Meaning |
|---|---|
| `0.x.0-beta.y` | Public beta — may have breaking changes between beta versions |
| `0.x.0-rc.y` | Release candidate — feature-frozen, bug-fixes only |
| `0.x.0` | Stable minor release |
| `0.x.y` | Patch / hotfix |
| `1.0.0` | First stable production release |

