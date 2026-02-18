'use client'

import { createContext, createElement, useContext, useEffect, useMemo } from 'react'
import { useConvexAuth, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { AppLanguage, isRtl, messages } from '@/lib/i18n'

type AppLanguageContextValue = {
  lang: AppLanguage
  dir: 'rtl' | 'ltr'
  dict: (typeof messages)[AppLanguage]
}

const AppLanguageContext = createContext<AppLanguageContextValue | null>(null)

export function AppLanguageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useConvexAuth()
  const settings = useQuery(
    api.settings.getMySettings,
    isAuthenticated ? {} : 'skip'
  )
  const lang: AppLanguage = settings?.language ?? 'en'
  const dict = messages[lang]
  const dir: 'rtl' | 'ltr' = isRtl(lang) ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  const value = useMemo(
    () => ({ lang, dir, dict }),
    [lang, dir, dict]
  )

  return createElement(AppLanguageContext.Provider, { value }, children)
}

export function useAppLanguage() {
  const ctx = useContext(AppLanguageContext)
  if (!ctx) {
    throw new Error('useAppLanguage must be used within AppLanguageProvider')
  }
  return ctx
}
