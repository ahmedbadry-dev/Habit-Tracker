import { Suspense } from "react"
import HabitsTab from "@/components/web/statistics/habits/HabitsTab"
import { HabitsSkeleton } from "@/components/web/statistics/habits/HabitsSkeleton"
import { StatisticsRange } from "@/types/statistics"

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
        <Suspense fallback={<HabitsSkeleton />}>
            <HabitsTab range={range} />
        </Suspense>
    )
}
