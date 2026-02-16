'use client'

import { useEffect } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { AppLanguage, isRtl, messages } from '@/lib/i18n'

export function useAppLanguage() {
  const settings = useQuery(api.settings.getMySettings)
  const lang: AppLanguage = settings?.language ?? 'en'
  const dict = messages[lang]
  const dir = isRtl(lang) ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  return { lang, dir, dict }
}
