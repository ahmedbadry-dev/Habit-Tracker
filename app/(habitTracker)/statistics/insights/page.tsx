import { InsightsSkeleton } from "@/components/web/statistics/Insight/InsightsSkeleton"
import InsightsTab from "@/components/web/statistics/Insight/InsightsTab"
import { StatisticsRange } from "@/types/statistics"
import { Suspense } from "react"

const validRanges: StatisticsRange[] = ["week", "month", "year"]
export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ range?: string }>
}) {
    const { range: rawRange } = await searchParams
    const range: StatisticsRange =
        validRanges.includes(rawRange as StatisticsRange)
            ? (rawRange as StatisticsRange)
            : "week"

    return (
        <Suspense fallback={<InsightsSkeleton />}>
            <InsightsTab range={range} />
        </Suspense>
    )
}
