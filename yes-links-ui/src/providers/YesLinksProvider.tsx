'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { injectTheme } from '@/theme/themeInjector'

interface YesLinksContextType {
  token: string | null
  theme?: any
}

export const YesLinksContext = createContext<YesLinksContextType | null>(null)

export const YesLinksProvider: React.FC<{
  token: string
  theme?: any
  children: React.ReactNode
}> = ({ token, theme, children }) => {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rootRef.current && theme) {
      injectTheme(theme, rootRef.current)
    }
  }, [theme])

  return (
    <YesLinksContext.Provider value={{ token, theme }}>
      <div ref={rootRef} className="yes-link-root">
        {children}
      </div>
    </YesLinksContext.Provider>
  )
}

export const useYesLinks = () => {
  const context = useContext(YesLinksContext)
  if (!context) {
    throw new Error('useYesLinks must be used within a YesLinksProvider')
  }
  return context
}
