import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aguasvalentino.erp',
  appName: 'AguasValentinoERP',
  webDir: 'dist',
  server: {
    url: 'http://192.168.1.121:3000', // 👈 Asegúrate que tu frontend esté corriendo ahí
    cleartext: true, // Necesario si usas HTTP y no HTTPS
  },
};

export default config;
