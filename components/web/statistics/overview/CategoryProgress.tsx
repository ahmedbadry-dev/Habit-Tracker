import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculatePercentage, getColor } from "@/utils/Statistics/getCompletionStats"

type Category = {
    name: string
    completed: number
    total: number
}

export function CategoryProgress({ data }: { data: Category[] }) {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Categories</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {data.map((category) => (
                    <div
                        key={category.name}
                        className="rounded-lg border bg-muted/30 p-4 transition hover:bg-muted/50"
                    >
                        {/* Top Row */}
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="font-medium">{category.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {category.completed} / {category.total} completed
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold">
                                    {calculatePercentage(category.completed, category.total)}%
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    completion
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${getColor(calculatePercentage(category.completed, category.total))}`}

                                style={{ width: `${calculatePercentage(category.completed, category.total)}%` }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
