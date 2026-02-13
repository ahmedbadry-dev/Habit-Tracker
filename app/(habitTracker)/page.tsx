
import DashboardClient from "@/components/web/dashboard/DashboardClient"
import HeroSection from "@/components/web/dashboard/HeroSection"
import QuickActions from "@/components/web/dashboard/QuickActions"
import TodayHabits from "@/components/web/dashboard/TodayHabits"

function getTodayKey() {
  const now = new Date()
  return now.toISOString().slice(0, 10)
}
export default async function DashboardPage() {

  const todayKey = getTodayKey()
  return (
    <div className="p-4 space-y-8">
      <HeroSection todayKey={todayKey} />
      <QuickActions />
      <TodayHabits />
      <DashboardClient todayKey={todayKey} />
    </div>
  )
}
