import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrophyIcon, TrendingUp } from "lucide-react"
import { ProgressRing } from "./ProgressRing"


export default function HeroSection() {
    const percentage = 30

    return (
        <Card
            className="
        bg-gradient-to-br
        from-background
        via-background
        to-muted/20
        border-border/40
        shadow-sm
        animate-in fade-in duration-500
      "
        >
            <CardHeader>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl lg:text-5xl font-medium tracking-tight">
                        Good Morning!
                    </h1>

                    <Badge
                        className="
              flex items-center gap-2
              px-4 py-2
              bg-primary/90 text-primary-foreground
              hover:bg-primary
              transition-all duration-200
            "
                    >
                        <TrophyIcon className="size-4" />
                        <span className="text-xs md:text-sm">
                            12 Day Streak
                        </span>
                    </Badge>
                </div>

                <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="size-4" />
                    <span className="text-sm text-muted-foreground">
                        Sunday, February 8
                    </span>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div
                    className="
            flex justify-between items-center
            p-6
            rounded-2xl
            bg-muted/30
            backdrop-blur-sm
            border border-border/40
            transition-all duration-300
            hover:bg-muted/40
          "
                >
                    {/* Left Side */}
                    <div className="flex gap-6 items-center">
                        <ProgressRing percentage={percentage} />

                        <div>
                            <p className="text-xl md:text-2xl font-medium">
                                3 of 6 completed
                            </p>
                            <p className="text-muted-foreground">
                                50% completed
                            </p>
                        </div>
                    </div>

                    {/* Right Icon */}
                    <TrendingUp className="opacity-70" />
                </div>
            </CardContent>
        </Card>
    )
}
