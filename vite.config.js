import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

export default defineConfig(({ mode }) => {
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
              target: "http://192.168.1.121:8080", // local backend
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined, // No necesitas `server` en producción (lo ignora)
    build: {
      outDir: "dist",
    },
  };
});
