'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function RowSkeleton() {
    return (
        <div className="flex items-center justify-between py-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
        </div>
    )
}

export default function SettingsSkeleton() {
    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-6 w-40" />
            </div>

            <div className="space-y-6">
                {/* Notifications */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <Skeleton className="h-5 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RowSkeleton />
                        <RowSkeleton />
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <Skeleton className="h-5 w-32" />
                    </CardHeader>
                    <CardContent>
                        <RowSkeleton />
                    </CardContent>
                </Card>

                {/* General */}
                <Card className="rounded-2xl">
                    <CardHeader>
                        <Skeleton className="h-5 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RowSkeleton />
                        <RowSkeleton />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
