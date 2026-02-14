import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function OverviewSkeleton() {
    return (
        <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="rounded-xl">
                        <CardContent className="flex md:flex-col justify-between space-y-4 p-6">
                            <div className="flex gap-2 items-center">
                                <Skeleton className="h-9 w-9 rounded-lg" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-10 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Time progress */}
            <Card className="rounded-xl">
                <CardHeader>
                    <Skeleton className="h-5 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-12" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Categories */}
            <Card className="rounded-xl">
                <CardHeader>
                    <Skeleton className="h-5 w-28" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="rounded-lg border bg-muted/30 p-4 space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-10" />
                            </div>
                            <Skeleton className="h-2 w-full rounded-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
