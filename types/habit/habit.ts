export type Habit = {
  id: string
  title: string
  description?: string
  category: string
  icon: string
  color: string
  completed: boolean
  completionPercentage: number
  streak: number
  completedAt?: string
}
