
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { SummaryCards } from "@/components/web/statistics/overview/SummaryCards"
import { TimeProgress } from "@/components/web/statistics/overview/TimeProgress"
import { CategoryProgress } from "@/components/web/statistics/overview/CategoryProgress"
import { requireAuthAndSyncUser } from "@/lib/protected-auth"


export type StatisticsRange = "week" | "month" | "year"

const validRanges: StatisticsRange[] = ["week", "month", "year"]
export default async function OverviewTab({
    searchParams,
}: {
    searchParams: Promise<{ range?: string }>
}) {
    const { range: rawRange } = await searchParams

    const range: StatisticsRange =
        validRanges.includes(rawRange as StatisticsRange)
            ? (rawRange as StatisticsRange)
            : "week"

    const token = await requireAuthAndSyncUser()
    const data = await fetchQuery(api.statistics.getStatistics, { range }, { token })

    return (
        <div className="space-y-6">
            <SummaryCards data={data.summary} range={range} />
            <TimeProgress title="Progress" data={data.progress} />
            <CategoryProgress data={data.categories} />
        </div>
    )
}
