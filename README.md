# ESP32 Dev Manager

## Project Overview

The **ESP32 Dev Manager** is a comprehensive web-based application designed to streamline the development workflow for embedded systems engineers and hobbyists working with ESP32 microcontrollers and Arduino-compatible platforms. It provides a centralized dashboard for managing project lifecycles, tracking hardware components, documenting development progress through a rich journal, and lays the groundwork for real-time device telemetry.

## Features

* **Project Lifecycle Management:** Create, organize, and track multiple embedded projects, including their status and descriptions.

* **Component Inventory:** Maintain a detailed inventory of electronic components used in each project, facilitating resource management and reusability.

* **Development Journaling:** A robust journaling feature allows for timestamped entries to document ideas, challenges, solutions, and key learnings throughout the development process.

* **Power Consumption Monitoring (Planned):** Integrated sections for visualizing current and historical power consumption data, crucial for optimizing battery-powered applications.

* **Real-time Data Visualization (Planned):** Architecture prepared for future integration with live data streams from ESP32 devices (e.g., sensor readings, GPS data) via WebSockets or MQTT.

* **Intuitive User Interface:** A modern, responsive, and visually appealing interface designed for a seamless user experience.

## Technologies Used

This application is built with a modern frontend stack:

* **React (with TypeScript):** A declarative JavaScript library for building dynamic user interfaces, enhanced with TypeScript for type safety and improved code quality.

* **Tailwind CSS:** A utility-first CSS framework for rapid and highly customizable styling, ensuring responsive design across various devices.

* **Framer Motion:** Utilized for creating smooth, performant, and engaging UI animations and transitions.

* **Headless UI:** Provides fully unstyled, accessible UI components (e.g., modals), allowing for complete visual customization with Tailwind CSS.

* **Lucide React:** A versatile and consistent icon library used for clear visual communication throughout the application.

* **Chart.js:** Employed for rendering dynamic and interactive data visualizations (e.g., bar charts, donut charts) on HTML canvas elements.

## Installation and Local Setup

To run this project locally, follow these steps:

1. **Clone the repository:**

```

git clone [https://github.com/owen-6936/esp32-dev-manager.git](https://www.google.com/search?q=https://github.com/owen-6936/esp32-dev-manager.git)

```

2. **Navigate to the project directory:**

```

cd esp32-dev-manager

```

3. **Install dependencies:**

```

npm install

```

4. **Start the development server:**

```

npm run dev

```

The application will typically be accessible at `http://localhost:5173` in your web browser.

## Usage

Upon launching the application, you will be presented with a dashboard.

* Use the sidebar navigation to switch between sections: Dashboard, Projects, Journal, Power, Data, and Settings.

* In the "Projects" section, you can add new projects and select an active project.

* The "Journal" section allows you to add new entries to document your development progress for the selected project.

## License

This project is licensed under the **MIT License**. See the `LICENSE` file for more details.

## Contact

For any questions or collaborations, feel free to reach out via my GitHub: [Owen's GitHub](https://github.com/owen-6936)
