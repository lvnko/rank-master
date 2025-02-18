import i18n from "i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from "react-i18next";
// import enUS_JSON from "@/locale/en-US.json";
// import zhTW_JSON from "@/locale/zh-TW.json";

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next).init({
        // resources: {
        //     "en-US": { ...enUS_JSON },
        //     "zh-TW": { ...zhTW_JSON }
        // }, // Where we're gonna put translations' files
        ns: ['translation', 'common'],
        defaultNS: 'translation',
        fallbackLng: ['en-US'],     // Set the initial language of the App
        supportedLngs: ['en-US', 'zh-TW'],
        interpolation: {
          escapeValue: false, // not needed for react as it escapes by default
        },
    });