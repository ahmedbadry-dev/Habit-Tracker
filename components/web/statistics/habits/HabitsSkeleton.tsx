import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function HabitsSkeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-2">

            {Array.from({ length: 3 }).map((_, sectionIndex) => (
                <Card key={sectionIndex} className="p-6 space-y-6">

                    {/* Section Header */}
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-60" />
                    </div>

                    {/* Habit Items */}
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 rounded-lg border"
                            >
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>

                                <Skeleton className="h-6 w-12" />
                            </div>
                        ))}
                    </div>
                </Card>
            ))}

        </div>
    )
}
