import { StatisticsRange } from "@/app/(habitTracker)/statistics/page"
import { CategoryProgress } from "./CategoryProgress"
import { SummaryCards } from "./SummaryCards"
import { TimeProgress } from "./TimeProgress"
import { getStatistics } from "@/utils/Statistics/getStatistics"




export default async function OverviewPage({ range }: { range: StatisticsRange }) {



    const data = await getStatistics(range)

    return (
        <div className="space-y-6">
            <SummaryCards data={data.summary} range={range} />
            <TimeProgress title="Progress" data={data.progress} />
            <CategoryProgress data={data.categories} />
        </div>
    )
}
