import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

export function useRequiredSettings() {
  const settings = useQuery(api.settings.getMySettings)

  if (settings === undefined || settings === null) {
    return null
  }

  return settings
}
