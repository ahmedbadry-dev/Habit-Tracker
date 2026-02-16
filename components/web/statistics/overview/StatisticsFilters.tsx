"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StatisticsFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentRange = searchParams.get("range") ?? "week"

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("range", value)

        router.replace(`?${params.toString()}`, {
            scroll: false,
        })
    }


    return (
        <Select value={currentRange} onValueChange={handleChange}>
            <SelectTrigger className="w-fit transition-all duration-200">
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
