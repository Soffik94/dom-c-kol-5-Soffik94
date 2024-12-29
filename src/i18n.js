import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

i18n
  .use(HttpApi) // Načítání překladů
  .use(LanguageDetector) // Detekce jazyka
  .use(initReactI18next) // React binding
  .init({
    fallbackLng: "en", // Výchozí jazyk
    supportedLngs: ["en", "cs"], // Podporované jazyky
    interpolation: {
      escapeValue: false, // React již escapuje znaky
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Cesta k překladům
    },
  });

export default i18n;
