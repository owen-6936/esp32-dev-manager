import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: [
                "favicon.svg",
                "robots.txt",
                "pwa-192x192.png",
                "pwa-512x512.png",
            ],
            manifest: {
                name: "ESP32 Dev Manager",
                short_name: "ESP32 Dev",
                description:
                    "Complete embedded systems development tracker for ESP32-S3 projects",
                theme_color: "#1e293b",
                background_color: "#0f172a",
                display: "standalone",
                start_url: "/",
                scope: "/",
                icons: [
                    {
                        src: "pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            workbox: {
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
                runtimeCaching: [
                    {
                        urlPattern: ({ url }) =>
                            url.pathname.endsWith(".glb") ||
                            url.pathname.endsWith(".gltf"),
                        handler: "CacheFirst",
                        options: {
                            cacheName: "model-cache",
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-cache",
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                            },
                        },
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    optimizeDeps: {
        include: ["@react-three/fiber", "@react-three/drei", "three"],
    },
    build: {
        chunkSizeWarningLimit: 5000, // set chunk size warning limit to 5MB
        outDir: "dist",
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        include: ["src/**/*.test.{ts,tsx}"],
        css: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            exclude: [
                "node_modules/**",
                "src/test/**",
                "*.config.*",
                "src/vite-env.d.ts",
                "src/main.tsx",
                "dist/**",
            ],
            thresholds: {
                lines: 85,
                functions: 85,
                branches: 80,
                statements: 85,
            },
        },
    },
});
