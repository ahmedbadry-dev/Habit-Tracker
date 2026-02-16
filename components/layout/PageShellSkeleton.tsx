// components/layout/PageShellSkeleton.tsx
export default function PageShellSkeleton() {
    return (
        <div className="p-6 space-y-4">
            <div className="h-7 w-48 rounded bg-muted animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
                ))}
            </div>
        </div>
    )
}
