type HabitCardProps = {
    index?: number
    name: string
    currentStreak: number
    percentage: number
    improvement?: number
    variant?: "top" | "risk" | "improved"
}

export function HabitCard({
    index,
    name,
    currentStreak,
    percentage,
    improvement,
    variant = "top",
}: HabitCardProps) {
    const percentageColor =
        variant === "risk"
            ? "text-red-400"
            : "text-foreground"

    return (
        <div
            className="
        flex items-center justify-between
        border-b py-3 last:border-none
        transition-all duration-200 ease-out
        hover:bg-muted/30
        hover:translate-x-0.5
        "
        >
            {/* Left */}
            <div className="flex items-start gap-3">
                {index && (
                    <span className="text-sm text-muted-foreground bg-muted-foreground/20 p-2 rounded-md">
                        #{index}
                    </span>
                )}

                <div>
                    <p className="font-medium leading-none">
                        {name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {currentStreak} day streak
                    </p>
                </div>
            </div>

            {/* Right */}
            <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <p className={`font-medium ${percentageColor}`}>
                        {percentage}%
                    </p>

                    {variant === "improved" && improvement !== undefined && (
                        <span
                            className={`
                text-xs font-medium
                ${improvement > 0 ? "text-green-400" : ""}
                ${improvement < 0 ? "text-red-400" : ""}
              `}
                        >
                            {improvement > 0 ? `+${improvement}%` : `${improvement}%`}
                        </span>
                    )}
                </div>

                <p className="text-xs text-muted-foreground">
                    completion
                </p>
            </div>
        </div>
    )
}
