import OverviewPage from "@/components/web/statistics/overview/OverviewPage"

export type StatisticsRange = "week" | "month" | "year"

const validRanges: StatisticsRange[] = ["week", "month", "year"]

export default async function StatisticsPage({
    searchParams,
}: {
    searchParams: Promise<{ range?: string }>
}) {
    const { range: rawRange } = await searchParams

    const range: StatisticsRange =
        validRanges.includes(rawRange as StatisticsRange)
            ? (rawRange as StatisticsRange)
            : "week"

    return <OverviewPage range={range} />
}
