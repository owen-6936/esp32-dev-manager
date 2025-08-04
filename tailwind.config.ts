import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This line is crucial
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
