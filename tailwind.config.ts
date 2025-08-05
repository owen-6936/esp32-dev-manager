import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line is crucial
    "./tailwind-custom-utility.css",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
