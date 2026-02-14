import { StatisticsRange } from "@/app/(habitTracker)/statistics/page"
import { CategoryProgress } from "./CategoryProgress"
import { SummaryCards } from "./SummaryCards"
import { TimeProgress } from "./TimeProgress"
import { getToken } from "@/lib/auth-server"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"

export default async function OverviewPage({ range }: { range: StatisticsRange }) {
    const token = await getToken()
    const data = await fetchQuery(api.statistics.getStatistics, { range }, { token })

    return (
        <div className="space-y-6">
            <SummaryCards data={data.summary} range={range} />
            <TimeProgress title="Progress" data={data.progress} />
            <CategoryProgress data={data.categories} />
        </div>
    )
}
