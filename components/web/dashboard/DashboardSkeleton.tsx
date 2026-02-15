import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function SkeletonBox({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse bg-muted/50 rounded-md ${className}`}
        />
    )
}
export function DashboardSkeleton() {
    return (
        <div className="p-4 space-y-8">

            {/* Hero Skeleton */}
            <Card
                className="
        bg-linear-to-br
        from-background
        via-background
        to-muted/20
        border-border/40
        shadow-sm
        gap-2
      "
            >
                <CardHeader>
                    <div className="space-y-4">
                        {/* Greeting */}
                        <SkeletonBox className="h-8 w-60" />

                        {/* Motivation + Date */}
                        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                            <SkeletonBox className="h-5 w-72" />
                            <SkeletonBox className="h-4 w-40" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Badges */}
                    <div className="flex flex-col gap-2">
                        <SkeletonBox className="h-10 w-full rounded-full" />

                        <div className="flex gap-2">
                            <SkeletonBox className="h-10 flex-1 rounded-full" />
                            <SkeletonBox className="h-10 flex-1 rounded-full" />
                        </div>
                    </div>

                    {/* Main overall card */}
                    <div className="flex justify-between items-center p-6 rounded-2xl border border-border/40 bg-muted/30">
                        <div className="flex gap-6 items-center">
                            {/* Fake ProgressRing */}
                            <SkeletonBox className="h-16 w-16 rounded-full" />

                            <div className="space-y-2">
                                <SkeletonBox className="h-6 w-40" />
                                <SkeletonBox className="h-4 w-32" />
                            </div>
                        </div>

                        <SkeletonBox className="h-6 w-6 hidden md:block" />
                    </div>

                    {/* Weekly progress block */}
                    <div className="rounded-2xl border border-border/40 bg-muted/20 p-4 space-y-3">
                        <div className="flex justify-between">
                            <SkeletonBox className="h-4 w-32" />
                            <SkeletonBox className="h-4 w-28" />
                        </div>

                        <SkeletonBox className="h-2 w-full rounded-full" />
                        <SkeletonBox className="h-3 w-40" />
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions Skeleton */}
            <div className="flex gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-32 rounded-xl" />
                ))}
            </div>

            {/* Habits List Skeleton */}
            <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="p-4 space-y-4">
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>

                        <Skeleton className="h-2 w-full rounded-full" />

                        <div className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </Card>
                ))}
            </div>

        </div>
    )
}
