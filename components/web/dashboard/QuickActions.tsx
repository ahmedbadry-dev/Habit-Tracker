import { Card, CardContent } from "@/components/ui/card"
import { Flame, TrendingUp, Target, Sparkles } from "lucide-react"
import Link from "next/link"

type Action = {
    title: string
    description: string
    icon: React.ReactNode
    href?: string
}

const actions: Action[] = [
    {
        title: "Boost Streak",
        description: "Maintain your daily momentum",
        icon: <Flame className="size-5" />,
        href: "/statistics",
    },
    {
        title: "View Analytics",
        description: "Track your progress insights",
        icon: <TrendingUp className="size-5" />,
        href: "/statistics",
    },
    {
        title: "Set Goals",
        description: "Adjust your weekly targets",
        icon: <Target className="size-5" />,
    },
    {
        title: "Motivation",
        description: "Get a daily inspiration",
        icon: <Sparkles className="size-5" />,
    },
]

export default function QuickActions() {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-medium">Quick Actions</h2>

            <div className="grid gap-4 md:grid-cols-2">
                {actions.map((action, i) => (
                    <Link key={i} href={action.href ?? "#"}>
                        <Card className="transition-all duration-200 hover:bg-muted/30 hover:-translate-y-1 cursor-pointer
                        
                        
                        ">
                            <CardContent className="flex items-start gap-4 py-5">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    {action.icon}
                                </div>

                                <div>
                                    <p className="font-medium">{action.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {action.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
