import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { TimeProgressData } from "@/types/statistics"
import { calculatePercentage } from "@/utils/Statistics/getCompletionStats"

type TimeProgressProps = {
    title: string
    data: TimeProgressData
}

export function TimeProgress({
    title,
    data,
}: TimeProgressProps) {
    return (
        <Card className="rounded-xl">
            <CardHeader>
                <h3 className="text-base font-medium">{title}</h3>
            </CardHeader>

            <CardContent className="space-y-4">
                {data.map((item) => {
                    return (
                        <div key={item.label} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground w-14">
                                    {item.label}
                                </span>

                                <span className="text-muted-foreground">
                                    {item.completed}/{item.total}
                                </span>
                            </div>

                            <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all duration-500 ease-out"
                                    style={{ width: `${calculatePercentage(item.completed, item.total)}%` }}
                                />
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
