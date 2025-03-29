import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import dotenv from "dotenv";

// Solución para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detectar entorno actual
const nodeEnv = process.env.NODE_ENV || "development";

// Cargar variables .env.local o .env.prod según modo
dotenv.config({ path: `.env.${nodeEnv === "production" ? "prod" : "local"}` });

// También puedes usar Vite para cargar `.env.*` por consistencia si quieres:
const env = loadEnv(nodeEnv, process.cwd(), "");

// Determinar si estás en desarrollo
const isDev = nodeEnv === "development";

// Obtener variables del entorno
const platform = env.VITE_PLATFORM || process.platform;
const apiUrl = env.VITE_API_URL || "http://localhost:8080/api";

// URL del frontend
const frontendURL = isDev
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "dist", "index.html")}`;

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL(frontendURL);
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (platform !== "darwin") app.quit();
});

// Solo para depuración
console.log(`🚀 Running in ${isDev ? "development" : "production"} mode`);
console.log(`🌍 API URL: ${apiUrl}`);
console.log(`🖥️ Platform: ${platform}`);
