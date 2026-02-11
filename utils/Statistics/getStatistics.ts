import { StatisticsData, StatisticsRange } from '@/types/statistics'

export function getCompletedLabel(range: string) {
  switch (range) {
    case 'month':
      return 'Completed This Month'
    case 'year':
      return 'Completed This Year'
    default:
      return 'Completed This Week'
  }
}

export async function getStatistics(
  range: StatisticsRange
): Promise<StatisticsData> {
  // هنا لاحقًا هيبقى DB query حقيقي

  if (range === 'month') {
    return {
      summary: {
        totalHabits: 12,
        completed: 160,
        currentStreak: 12,
        longestStreak: 45,
      },
      progress: [
        { label: 'Week 1', completed: 40, total: 60 },
        { label: 'Week 2', completed: 52, total: 60 },
        { label: 'Week 3', completed: 48, total: 60 },
        { label: 'Week 4', completed: 55, total: 60 },
      ],
      categories: [
        { name: 'Health', completed: 50, total: 60, percentage: 83 },
        { name: 'Learning', completed: 40, total: 60, percentage: 66 },
        { name: 'Mindfulness', completed: 30, total: 60, percentage: 50 },
      ],
    }
  }

  if (range === 'year') {
    return {
      summary: {
        totalHabits: 12,
        completed: 900,
        currentStreak: 12,
        longestStreak: 45,
      },
      progress: [
        { label: 'Jan', completed: 120, total: 160 },
        { label: 'Feb', completed: 110, total: 140 },
        { label: 'Mar', completed: 130, total: 170 },
        { label: 'Apr', completed: 140, total: 180 },
      ],
      categories: [
        { name: 'Health', completed: 400, total: 500, percentage: 80 },
        { name: 'Learning', completed: 300, total: 450, percentage: 66 },
        { name: 'Mindfulness', completed: 200, total: 400, percentage: 50 },
      ],
    }
  }

  // default = week
  return {
    summary: {
      totalHabits: 12,
      completed: 48,
      currentStreak: 12,
      longestStreak: 45,
    },
    progress: [
      { label: 'Mon', completed: 8, total: 12 },
      { label: 'Tue', completed: 10, total: 12 },
      { label: 'Wed', completed: 7, total: 12 },
      { label: 'Thu', completed: 11, total: 12 },
      { label: 'Fri', completed: 9, total: 12 },
      { label: 'Sat', completed: 6, total: 12 },
      { label: 'Sun', completed: 8, total: 12 },
    ],
    categories: [
      { name: 'Health', completed: 15, total: 20, percentage: 75 },
      { name: 'Learning', completed: 18, total: 25, percentage: 72 },
      { name: 'Mindfulness', completed: 10, total: 20, percentage: 50 },
    ],
  }
}
