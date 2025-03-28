import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";

  return {
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    plugins: [react()],
    optimizeDeps: {
      include: ["swapy"],
    },
    server: isDev
      ? {
          host: "0.0.0.0",
          port: 3000,
          strictPort: true,
          proxy: {
            "/api": {
              target: env.VITE_API_URL,
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
    build: {
      outDir: "dist",
    },
  };
});
