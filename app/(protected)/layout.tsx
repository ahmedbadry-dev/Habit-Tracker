import PageShellSkeleton from "@/components/layout/PageShellSkeleton"
import PageTransition from "@/components/layout/PageTransition"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/web/app-sidebar"
import { AuthRequiredModal } from "@/components/web/auth/AuthRequiredModal"
import { SiteHeader } from "@/components/web/site-header"
import { requireAuthAndSyncUser } from "@/lib/protected-auth"
import { Suspense } from "react"

const HabitLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireAuthAndSyncUser()
    return (
        <AuthRequiredModal>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <PageTransition>
                        <main className="flex-1">
                            <div className="@container/main max-w-5xl m-auto">
                                <Suspense fallback={<PageShellSkeleton />}>
                                    {children}
                                </Suspense>
                            </div>
                        </main>
                    </PageTransition>
                </SidebarInset>
            </SidebarProvider>
        </AuthRequiredModal>
    )
}

export default HabitLayout
