'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'claro' | 'escuro' | 'sistema'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'claro' | 'escuro'
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'claro',
  setTheme: () => {},
  resolvedTheme: 'claro',
})

export const useTheme = () => useContext(ThemeContext)

function getSystemTheme(): 'claro' | 'escuro' {
  if (typeof window === 'undefined') return 'claro'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('claro')
  const [resolvedTheme, setResolvedTheme] = useState<'claro' | 'escuro'>('claro')

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved && ['claro', 'escuro', 'sistema'].includes(saved)) {
      setThemeState(saved)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    const apply = (resolved: 'claro' | 'escuro') => {
      setResolvedTheme(resolved)
      if (resolved === 'escuro') {
        document.documentElement.setAttribute('data-theme', 'escuro')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
    }

    if (theme === 'sistema') {
      apply(getSystemTheme())

      // Listen for system preference changes
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      const handler = (e: MediaQueryListEvent) => {
        apply(e.matches ? 'escuro' : 'claro')
      }
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } else {
      apply(theme)
    }
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
