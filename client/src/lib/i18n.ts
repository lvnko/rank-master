import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import enUS_JSON from "@/locale/en-US.json";
import zhTW_JSON from "@/locale/zh-TW.json";

i18n.use(initReactI18next).init({
    resources: {
        "en-US": { ...enUS_JSON },
        "zh-TW": { ...zhTW_JSON }
    }, // Where we're gonna put translations' files
    lng: "en-US",     // Set the initial language of the App
});