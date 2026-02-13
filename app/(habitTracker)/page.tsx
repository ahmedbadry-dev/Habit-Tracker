
import DashboardClient from "@/components/web/dashboard/DashboardClient"
import HeroSection from "@/components/web/dashboard/HeroSection"
import QuickActions from "@/components/web/dashboard/QuickActions"
import TodayHabits from "@/components/web/dashboard/TodayHabits"
import { Habit } from "@/types/habit/habit"

export default function DashboardPage() {
  // لاحقًا Convex
  const habits: Habit[] = [
    {
      id: "1",
      title: "Morning Meditation",
      description: "Start the day with mindfulness",
      category: "Wellness",
      icon: "🧘",
      color: "linear-gradient(135deg,#22c55e,#16a34a)",
      completed: false,
      completionPercentage: 50,
      streak: 14,
    },
  ]

  return (
    <div className="p-4 space-y-8">
      <HeroSection />
      <QuickActions />
      <TodayHabits />
      <DashboardClient initialHabits={habits} />
    </div>
  )
}
