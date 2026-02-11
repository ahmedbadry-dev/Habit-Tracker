export type StatisticsSummary = {
  totalHabits: number
  completed: number
  currentStreak: number
  longestStreak: number
}

export type TimeProgressItem = {
  label: string
  completed: number
  total: number
}

export type TimeProgressData = TimeProgressItem[]

export type CategoryStats = {
  name: string
  completed: number
  total: number
  percentage: number
}

export type StatisticsData = {
  summary: StatisticsSummary
  progress: TimeProgressData
  categories: CategoryStats[]
}

export type StatisticsRange = 'week' | 'month' | 'year'
