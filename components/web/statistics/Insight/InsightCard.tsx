type InsightCardProps = {
    title: string
    value: string | number
    subtitle?: string
    insight?: string
    highlight?: boolean
}

export function InsightCard({
    title,
    value,
    subtitle,
    insight,
    highlight = false,
}: InsightCardProps) {
    return (
        <div
            className={`
        rounded-xl p-6
        transition-all duration-300
        border
        ${highlight
                    ? "bg-primary/5 border-primary/30 shadow-[0_0_0_1px_rgba(0,0,0,0.02)]"
                    : "bg-background hover:bg-muted/20"
                }
      `}
        >
            {/* Title */}
            <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {title}
            </h3>

            {/* Main Value */}
            <div className="mt-4">
                <p
                    className={`
            font-semibold tracking-tight
            ${highlight ? "text-5xl text-primary" : "text-4xl"}
          `}
                >
                    {value}
                </p>

                {subtitle && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Divider */}
            {insight && (
                <>
                    <div
                        className={`
              my-5 h-px
              ${highlight ? "bg-primary/20" : "bg-border/60"}
            `}
                    />
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {insight}
                    </p>
                </>
            )}
        </div>
    )
}
