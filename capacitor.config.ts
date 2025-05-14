import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aguasvalentino.erp',
  appName: 'AguasValentinoERP',
  webDir: 'dist',
  server: {
    url: 'https://erp.aguasvalentino.com',
    cleartext: false, 
  },
};

export default config;
