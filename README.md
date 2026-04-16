# ESP32 Dev Manager

![Deploy to GitHub Pages](https://github.com/owen-6936/esp32-dev-manager/actions/workflows/checks.yml/badge.svg)

## Live Preview

<!--PREVIEW_URL_START-->
[Preview Deployment](https://esp32-dev-manager-122gib2j9-owens-projects-2ab3ca8c.vercel.app)
<!--PREVIEW_URL_END-->

<!--QR_CODE_START-->
![Scan to Preview](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fesp32-dev-manager-122gib2j9-owens-projects-2ab3ca8c.vercel.app%0A)
<!--QR_CODE_END-->

A comprehensive full-stack application designed to track and manage all aspects of your embedded systems development journey, with a special focus on ESP32 S3 projects.

**Project Name:** `esp32-dev-manager`

![ESP32 S3 Journey Tracker UI Preview](/public/app-preview.png)

---

## 📚 Table of Contents

- [✨ Features](#-features)
- [💻 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🧪 Preview Automation](#-preview-automation)
- [🔮 Future Enhancements](#-future-enhancements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

- **Tutorial Library**: Browse 61 Freenove ESP32-S3 projects with full code, component lists, pin mappings, and difficulty ratings. Projects are auto-discovered from Freenove's GitHub repos.
- **Kit Management**: Select which Freenove kit(s) you own (Basic / Super / Ultimate). The app filters tutorials and components based on your kit tier.
- **Gamification**: Earn XP for completing projects, climb 7 ranks from Novice to Grandmaster, and compete on a global leaderboard.
- **Learning Paths**: 8 curated paths (LED Basics, WiFi Networking, etc.) with progress tracking across categories.
- **Component Inventory**: Track your electronic components with search, filter, and per-component metadata.
- **Development Journal**: Document progress, problems, and insights as you build.
- **AI Assistant**: Chat-based assistant (via OpenRouter) for project help and learning guidance.
- **Admin Panel**: Normalize kit data from GitHub, seed Supabase tables, manage projects, and monitor sync status.
- **PWA Support**: Installable as a Progressive Web App with offline caching.

---

## 💻 Tech Stack

### Frontend

- **React 19** with TypeScript
- **Vite 7** — build & dev server
- **Zustand** — state management (kit, project, progress, component stores)
- **Tailwind CSS** — utility-first styling with glassmorphic design
- **Framer Motion** — animations
- **React Router 7** — client-side routing
- **Lucide Icons** / **Headless UI** / **Vaul**

### Backend

- **Supabase** — PostgreSQL database, Row-Level Security, auth, storage
- **GitHub Contents API** — auto-discovers sketches from Freenove repos
- **OpenRouter** — AI chat integration

---

## 🚀 Getting Started

### Prerequisites

- Node.js 24.x
- pnpm
- Supabase project (or local Supabase)

### Installation

```bash
git clone https://github.com/owen-6936/esp32-dev-manager.git
cd esp32-dev-manager
pnpm install
```

### Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_EMAIL=your-email@example.com
VITE_OPENROUTER_API_KEY=your-openrouter-key   # optional
```

### Development

```bash
pnpm dev
```

The app runs at `http://localhost:5173`.

### Build & Test

```bash
pnpm build          # TypeScript compile + Vite production build
pnpm test           # Run Vitest tests
pnpm test:coverage  # Run tests with coverage report
pnpm lint           # ESLint
```

---

## 📁 Project Structure

```
src/
├── components/          # UI components
│   ├── pages/           # Route-level pages (Dashboard, TutorialBrowser, etc.)
│   └── ui/              # Reusable UI components (glass cards, modals, account panels)
├── constants/           # Static config (achievements, pins, stats)
├── contexts/            # React context providers (Auth)
├── hooks/               # Custom hooks (useTutorialData, useFormValidator)
├── layouts/             # Root layout with Navbar
├── lib/                 # Supabase client, auth helpers
├── routes/              # React Router config
├── services/            # Business logic
│   ├── kitScannerService.ts   # GitHub → Supabase normalization engine
│   ├── tutorialService.ts     # Project/category/kit fetching + caching
│   ├── seedContent.ts         # Structural seed data (kits, categories, paths)
│   ├── syncService.ts         # Code file sync to Supabase Storage
│   └── aiService.ts           # OpenRouter AI chat
├── store/               # Zustand stores
│   ├── kit.ts           # Owned kits, tier hierarchy
│   ├── progress.ts      # XP, ranks, project completion
│   ├── project.ts       # User project tracking
│   ├── component.ts     # Component inventory
│   └── journal.ts       # Development journal
├── test/                # Vitest test suites
└── types/               # TypeScript interfaces
```

### Kit Normalization Architecture

The normalizer (`kitScannerService.ts`) auto-discovers projects from Freenove's GitHub repos:

1. Fetches sketch directory listings from Basic, Super, and Ultimate repos
2. Builds a **name→tier map** (lowest-tier kit that includes each project)
3. Downloads `.ino` files from the **Ultimate repo** (the superset — all projects)
4. Parses components, pins, libraries from each `.ino` file
5. Assigns `kit_tier` per project using the cross-repo name map
6. Cleans up orphaned rows from previous normalizations
7. Updates kit `project_count` by accessible tier (Basic=34, Super=45, Ultimate=61)

---

## 🧪 Preview Automation

This project uses a custom GitHub Action to automatically post Vercel preview links on every pull request, complete with a QR code for mobile testing.

### 🔧 How It Works

- When a PR is opened or updated, a comment is posted with:
  - A live preview link (based on the PR number)
  - A QR code for quick mobile access
  - Auto-cleanup of older preview comments

### 🛠️ Workflow Files

```bash
.github/workflows/vercel-preview.yml
.github/actions/vercel-preview-comment/action.yml
```

### 🧪 Example Output

> 🚀 **Vercel Preview Available**  
> 🔗 [View Live Preview](https://esp32-dev-manager-git-pr-42-owen-6936.vercel.app)
>
> 📱 Scan on mobile:  
> ![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://esp32-dev-manager-git-pr-42-owen-6936.vercel.app)
>
> 🧪 This preview is auto-generated for PR #42.

---

## 🔮 Future Enhancements

- **AI-Powered Project Generation**: Give the AI tools to create projects, write journals, and suggest learning paths based on owned components
- **Real-time Collaboration**: Shared workspaces with live progress updates
- **Custom Project Creation**: Build and share custom ESP32 projects beyond Freenove kits
- **Advanced Analytics**: Skill progression charts, time tracking, completion predictions
- **Mobile-First Redesign**: Optimized touch interactions for workshop use

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or find a bug, please open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
