export function getOverallInsight(rate: number) {
  if (rate >= 85) return "Excellent consistency. You're building strong habits."
  if (rate >= 70) return 'Good momentum. A little push can make it exceptional.'
  return "There's room for improvement. Focus on small daily wins."
}

export function getBestHabitInsight(name: string, percentage: number) {
  return `${name} is your strongest habit at ${percentage}% completion. Keep reinforcing it.`
}

export function getRiskInsight(name: string, percentage: number) {
  return `${name} needs attention at ${percentage}% completion. Consider small daily adjustments.`
}

export function getStreakInsight(days: number) {
  if (days >= 30)
    return "You're building long-term consistency. That's powerful."
  if (days >= 14) return "You're forming the habit. Stay consistent."
  return 'Small streaks grow fast. Keep going.'
}
