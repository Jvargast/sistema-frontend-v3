import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./locals/i18n.es.json";
import en from "./locals/i18n.en.json";

const savedLang = localStorage.getItem('language') || 'es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en }
    },
    lng: savedLang,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
