export function formatTime(
  iso: string | number | Date,
  options?: {
    withDate?: boolean
    locale?: string
  }
) {
  if (!iso) return ''

  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) return ''

  const { withDate = false, locale = 'en-US' } = options ?? {}

  const time = date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
  })

  if (!withDate) return time

  const day = date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  })

  return `${day} • ${time}`
}
