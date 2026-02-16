export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">
                    Preparing your habits...
                </p>
            </div>
        </div>
    )
}
