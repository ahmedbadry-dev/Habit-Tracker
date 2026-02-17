
import DashboardClient from "@/components/web/dashboard/DashboardClient"
import HeroSection from "@/components/web/dashboard/HeroSection"
import QuickActions from "@/components/web/dashboard/QuickActions"
import TodayHabits from "@/components/web/dashboard/TodayHabits"
import { api } from "@/convex/_generated/api"
import { getToken } from "@/lib/auth-server"
import { preloadQuery } from "convex/nextjs"

function getTodayKey() {
  const now = new Date()
  return now.toISOString().slice(0, 10)
}
export default async function DashboardPage() {



  const todayKey = getTodayKey()
  const token = await getToken()


  const [preloadedOverview, preloadedUserName] =
    await Promise.all([
      preloadQuery(
        api.dashboard.getDailyOverview,
        { dateKey: todayKey },
        { token }
      ),
      preloadQuery(
        api.users.getCurrentUserName,
        {},
        { token }
      ),
    ])



  return (
    <div className="p-4 space-y-8">
      <HeroSection
        preloadedOverview={preloadedOverview}
        preloadedUserName={preloadedUserName}
      />
      <QuickActions />
      <TodayHabits />
      <DashboardClient todayKey={todayKey} />
    </div>
  )
}
