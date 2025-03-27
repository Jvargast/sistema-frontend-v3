import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

// ✅ Cargar las variables de entorno desde el archivo `.env`
dotenv.config();

// ✅ Solución para __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Cargar variables de entorno en Electron (desde `process.env`)
const isDev = process.env.VITE_ENV === 'development';  // Ahora sí está definido
const platform = process.env.VITE_PLATFORM || process.platform;
const apiUrl = process.env.VITE_API_URL || 'http://localhost:8080/api';

// ✅ Definir la URL del frontend (React + Vite)
const frontendURL = isDev
  ? 'http://localhost:3000'  // Modo desarrollo con Vite
  : `file://${path.join(__dirname, 'dist', 'index.html')}`;  // Producción

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,  // Seguridad adicional
      enableRemoteModule: false,
    },
  });

  mainWindow.loadURL(frontendURL);
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (platform !== 'darwin') app.quit();
});

// ✅ Imprimir variables para depuración
console.log(`🚀 Running in ${isDev ? 'development' : 'production'} mode`);
console.log(`🌍 API URL: ${apiUrl}`);
console.log(`🖥️ Platform: ${platform}`);
