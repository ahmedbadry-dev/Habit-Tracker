import { cn } from "@/lib/utils"

type AnalyticsSectionProps = {
    title: string
    description?: string
    count?: number
    children: React.ReactNode
    className?: string
}

export function AnalyticsSection({
    title,
    description,
    count,
    children,
    className,
}: AnalyticsSectionProps) {
    return (
        <div className={cn("rounded-lg border p-6", className)}>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                        {title}
                    </h3>
                    {description && (
                        <p className="mt-1 text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>

                {count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                        {count} habits
                    </span>
                )}
            </div>

            <div>{children}</div>
        </div>
    )
}
