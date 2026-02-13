export function toDateKeyUTC(dt: Date) {
  return dt.toISOString().slice(0, 10)
}

export function parseDateKeyUTC(dateKey: string) {
  // dateKey = YYYY-MM-DD
  return new Date(dateKey + 'T00:00:00Z')
}

export function addDays(dateKey: string, days: number) {
  const d = parseDateKeyUTC(dateKey)
  d.setUTCDate(d.getUTCDate() + days)
  return toDateKeyUTC(d)
}

export function prevDateKey(dateKey: string) {
  return addDays(dateKey, -1)
}

export function nextDateKey(dateKey: string) {
  return addDays(dateKey, 1)
}

/**
 * Week starts Monday (Mon..Sun)
 * Return weekStartKey (Monday) for any dateKey
 */
export function weekStartKey(dateKey: string) {
  const d = parseDateKeyUTC(dateKey)
  const day = d.getUTCDay() // Sun=0..Sat=6
  const diffToMon = (day + 6) % 7 // Mon => 0
  d.setUTCDate(d.getUTCDate() - diffToMon)
  return toDateKeyUTC(d)
}
