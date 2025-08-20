# ESP32 S3 Journey Tracker

![Deploy to GitHub Pages](https://github.com/owen-6936/esp32-dev-manager/actions/workflows/checks.yml/badge.svg)

## Live Preview

<!--PREVIEW_URL_START-->
[Preview Deployment](https://esp32-dev-manager-4alnwg24v-owens-projects-2ab3ca8c.vercel.app)
<!--PREVIEW_URL_END-->

<!--QR_CODE_START-->
![Scan to Preview](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fesp32-dev-manager-4alnwg24v-owens-projects-2ab3ca8c.vercel.app%0A)
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

- **Project Management**: Track projects with detailed information on status, progress, budget, and deadlines.
- **Component Inventory**: A searchable and filterable inventory to manage your electronic components, including quantity, price, and usage.
- **Development Journal**: A digital notebook to document your progress, problems, and learning insights.
- **Learning Analytics**: Visualize your progress in different skill categories with learning metrics.
- **Community Projects**: Browse and interact with projects shared by other developers.
- **Utility Tools**: Built-in tools for tasks like pin configuration and power consumption calculation.

---

## 💻 Tech Stack

### Frontend

- **React**
- **TypeScript**
- **Zustand**
- **Tailwind CSS**
- **Lucide Icons**
- **Framer Motion**
- **Vaul**
- **Headless UI**
- **React Router Dom**

### Backend (Planned)

- **Node.js**
- **Express.js**
- **Database**: (e.g., MongoDB, PostgreSQL)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or Yarn
- Git

### Installation

```bash
git clone https://github.com/owen-6936/esp32-dev-manager.git
cd esp32-dev-manager

npm install
# or
yarn install

npm run dev
# or
yarn dev
```

The application will be accessible at `http://localhost:5173`.

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── store/               # Zustand stores for state management
│   ├── component/
│   ├── journal/
│   ├── learning/
│   └── project/
├── types/               # Type definitions and interfaces
│   ├── project/
│   └── shared/
└── ...                  # Other files and assets
```

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

- **User Authentication**
- **API Integration**
- **Real-time Updates**
- **Advanced Analytics**
- **Slack Notifications**
- **Deploy Status Polling**

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions or find a bug, please open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.
