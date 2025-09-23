import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// Using Vite's '@' alias which points to the '/src' directory. This is the most robust method.
import translations from '@/translation.js'; 

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: translations.en },
      ta: { translation: translations.ta },
      hi: { translation: translations.hi },
      ur: { translation: translations.ur },
      ks: { translation: translations.ks },
    },
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

