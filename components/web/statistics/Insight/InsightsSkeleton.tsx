import { Skeleton } from "@/components/ui/skeleton"

export function InsightsSkeleton() {
    return (
        <div className="grid gap-8 lg:grid-cols-2">

            {/* Highlight Card */}
            <div className="lg:col-span-2 rounded-xl p-6 border space-y-6">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-14 w-32" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* 3 Normal Cards */}
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl p-6 border space-y-6">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-24" />
                    <Skeleton className="h-4 w-48" />
                </div>
            ))}

        </div>
    )
}
