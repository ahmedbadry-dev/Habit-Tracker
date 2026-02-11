export function calculatePercentage(
  completed: number,
  total: number,
  decimals = 0
): number {
  if (!total || total === 0) return 0

  const percentage = (completed / total) * 100
  return Number(percentage.toFixed(decimals))
}

export function getCompletionStats(completed: number, total: number) {
  const percentage = calculatePercentage(completed, total)

  return {
    completed,
    total,
    percentage,
  }
}

export function getColor(percentage: number) {
  if (percentage >= 80) return 'bg-green-500'
  if (percentage >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}
