export type RangeKey = 'week' | 'month' | 'year'

function toKey(dt: Date) {
  return dt.toISOString().slice(0, 10)
}

export function getRangeBounds(todayKey: string, range: RangeKey) {
  const base = new Date(todayKey + 'T00:00:00Z')

  const start = new Date(base)
  const end = new Date(base)

  if (range === 'week') {
    const day = start.getUTCDay()
    const diffToMon = (day + 6) % 7
    start.setUTCDate(start.getUTCDate() - diffToMon)
    end.setUTCDate(start.getUTCDate() + 6)
  }

  if (range === 'month') {
    start.setUTCDate(1)
    end.setUTCMonth(start.getUTCMonth() + 1)
    end.setUTCDate(0)
  }

  if (range === 'year') {
    start.setUTCMonth(0, 1)
    end.setUTCMonth(11, 31)
  }

  const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1

  const prevEnd = new Date(start)
  prevEnd.setUTCDate(prevEnd.getUTCDate() - 1)

  const prevStart = new Date(prevEnd)
  prevStart.setUTCDate(prevStart.getUTCDate() - (days - 1))

  return {
    startKey: toKey(start),
    endKey: toKey(end),
    previousStartKey: toKey(prevStart),
    previousEndKey: toKey(prevEnd),
    days,
  }
}
