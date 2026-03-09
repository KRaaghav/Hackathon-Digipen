import { createContext, useContext, useState, useEffect } from 'react'
import { TRANSLATIONS, LANGUAGE_OPTIONS, translateWithParams } from '../utils/translations'

const LANG_KEY = 'pf_lang'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY)
    return saved === 'es' ? 'es' : 'en'
  })

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language)
  }, [language])

  const t = (key, params) => {
    const keys = key.split('.')
    let value = TRANSLATIONS[language] || TRANSLATIONS.en
    for (const k of keys) {
      value = value?.[k]
    }
    const str = value ?? key
    return params ? translateWithParams(str, params) : str
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, LANGUAGE_OPTIONS }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
