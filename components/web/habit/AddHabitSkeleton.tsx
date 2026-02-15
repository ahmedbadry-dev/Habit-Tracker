import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function AddHabitSkeleton() {
    return (
        <div className="p-4 space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-10 w-24 rounded-lg" />
            </div>

            {/* Form Card */}
            <Card className="p-6 space-y-6">

                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-20 w-full rounded-md" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-32 rounded-md" />

            </Card>

        </div>
    )
}
