
import DashboardClient from "@/components/web/dashboard/DashboardClient"
import HeroSection from "@/components/web/dashboard/HeroSection"
import QuickActions from "@/components/web/dashboard/QuickActions"
import TodayHabits from "@/components/web/dashboard/TodayHabits"
import { api } from "@/convex/_generated/api"
import { preloadQuery } from "convex/nextjs"
import { fetchAuthMutation, getToken } from "@/lib/auth-server"

function getTodayKey() {
  const now = new Date()
  return now.toISOString().slice(0, 10)
}
export default async function DashboardPage() {



  const todayKey = getTodayKey()
  const token = await getToken()
  if (token) {
    await fetchAuthMutation(api.users.syncUser, {})
  }

  const preloaded =
    token
      ? await Promise.all([
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
      : null

  const preloadedOverview = preloaded?.[0]
  const preloadedUserName = preloaded?.[1]

  return (
    <div className="p-4 space-y-8">
      {preloadedOverview && preloadedUserName ? (
        <HeroSection
          mode="auth"
          preloadedOverview={preloadedOverview}
          preloadedUserName={preloadedUserName}
        />
      ) : (
        <HeroSection mode="guest" />
      )}
      <QuickActions />
      <TodayHabits />
      <DashboardClient todayKey={todayKey} />
    </div>
  )
}
