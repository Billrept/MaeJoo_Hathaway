import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Ensure this path is correct
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'],
    },
    react: {
      useSuspense: false, // Set this to false to avoid hydration issues
      wait: true,
      ssr: true, // Make sure ssr is set to true
    },
  });

export default i18n;
