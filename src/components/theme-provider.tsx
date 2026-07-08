'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: Theme
  setTheme: (t: Theme) => void
}>({ theme: 'dark', setTheme: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme | null
    const t = stored || 'dark'
    setThemeState(t)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(t)
  }, [])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('theme', t)
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(t)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
