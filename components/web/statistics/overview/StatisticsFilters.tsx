"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StatisticsFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentRange = searchParams.get("range") ?? "week"

    const handleChange = (value: string) => {
        router.push(`/statistics?range=${value}`)
    }

    return (
        <Select value={currentRange} onValueChange={handleChange}>
            <SelectTrigger className="w-40">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
        </Select>
    )
}
