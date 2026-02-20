import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './en.ts'
import es from './es.ts'

const resources = {
  en: { translation: en.translation },
  es: { translation: es.translation },
}
export const languages = Object.keys(resources)

const supportedLngs = Object.keys(resources)
console.log('Supported Languages', supportedLngs)

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupQuerystring: 'lng',
    },
    interpolation: {
      escapeValue: false,
    },
    debug: true,
  })

export default i18n
