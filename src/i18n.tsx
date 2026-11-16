import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'es' | 'en'
export type T = { es: string; en: string }

type Ctx = {
  lang: Lang
  t: (x: T) => string
  toggleLang: () => void
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

const LangCtx = createContext<Ctx | null>(null)

export function load<V>(key: string, fallback: V): V {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as V) : fallback
  } catch {
    return fallback
  }
}
export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable */
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => load<Lang>('lang', navigator.language.startsWith('en') ? 'en' : 'es'))
  const [theme, setTheme] = useState<'dark' | 'light'>(() => load<'dark' | 'light'>('theme', 'dark'))

  useEffect(() => {
    document.documentElement.lang = lang
    save('lang', lang)
  }, [lang])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    save('theme', theme)
  }, [theme])

  const t = useCallback((x: T) => x[lang], [lang])
  return (
    <LangCtx.Provider
      value={{
        lang,
        t,
        toggleLang: () => setLang((l) => (l === 'es' ? 'en' : 'es')),
        theme,
        toggleTheme: () => setTheme((x) => (x === 'dark' ? 'light' : 'dark')),
      }}
    >
      {children}
    </LangCtx.Provider>
  )
}

export function useApp() {
  const c = useContext(LangCtx)
  if (!c) throw new Error('AppProvider missing')
  return c
}
