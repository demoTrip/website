import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import enUsTrans from "./locales/en-us.json";
import esEsTrans from "./locales/es-es.json";
import zhTcTrans from "./locales/zh-tc.json";
import zhCnTrans from "./locales/zh-cn.json";
import jpJpTrans from "./locales/jp-jp.json";
import {initialState} from "@features/header/headerSlice"
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: enUsTrans
  },
  tc: {
    translation: zhTcTrans
  },
  es: {
    translation: esEsTrans
  },
  cn: {
    translation: zhCnTrans
  },
  jp: {
    translation: jpJpTrans
  }
};

i18n.use(LanguageDetector) //嗅探当前浏览器语言
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: initialState.locale || "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;