import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno correspondientes al modo (development, production)
  const env = loadEnv(mode, process.cwd());

  return {
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    plugins: [react()],
    resolve: {
      dedupe: ["react", "react-dom"],
    },
    optimizeDeps: {
      include: ["swapy"],
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "dist",
    },
  };
});
