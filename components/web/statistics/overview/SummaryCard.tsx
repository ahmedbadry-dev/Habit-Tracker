import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

type SummaryCardProps = {
    title: string
    value: number
    icon: LucideIcon
}

export default function SummaryCard({
    title,
    value,
    icon: Icon,
}: SummaryCardProps) {
    return (
        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="flex md:flex-col justify-between space-y-4">

                <div className="flex gap-2 items-center">
                    <div className="p-2 rounded-lg bg-muted">
                        <Icon className="size-5 text-primary" />
                    </div>

                    <p className="text-sm text-muted-foreground ">{title}</p>
                </div>

                <p className="text-4xl font-semibold ">{value}</p>
            </CardContent>
        </Card>
    )
}
