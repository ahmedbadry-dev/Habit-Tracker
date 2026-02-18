import PageShellSkeleton from "@/components/layout/PageShellSkeleton"
import PageTransition from "@/components/layout/PageTransition"
import MobileBottomNav from "@/components/layout/MobileBottomNav"
import { ConvexClientProvider } from "@/components/web/ConvexClientProvider"
import { AuthGuardProvider } from "@/components/web/auth/AuthGuardProvider"
import { AuthRequiredModal } from "@/components/web/auth/AuthRequiredModal"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/web/app-sidebar"
import { SiteHeader } from "@/components/web/site-header"
import { getToken } from "@/lib/auth-server"
import { Suspense } from "react"

const HabitLayout = async ({ children }: { children: React.ReactNode }) => {
    const token = await getToken()

    return (
        <ConvexClientProvider initialToken={token}>
            <AuthGuardProvider>
                <SidebarProvider
                    style={
                        {
                            "--sidebar-width": "calc(var(--spacing) * 72)",
                            "--header-height": "calc(var(--spacing) * 12)",
                        } as React.CSSProperties
                    }
                >
                    <div className="hidden md:block">
                        <AppSidebar variant="inset" />
                    </div>
                    <SidebarInset>
                        <SiteHeader />
                        <PageTransition>
                            <main className="flex-1 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
                                <div className="@container/main max-w-5xl m-auto">
                                    <Suspense fallback={<PageShellSkeleton />}>
                                        {children}
                                    </Suspense>
                                </div>
                            </main>
                        </PageTransition>
                    </SidebarInset>
                    <MobileBottomNav />
                </SidebarProvider>
                <AuthRequiredModal />
            </AuthGuardProvider>
        </ConvexClientProvider>
    )
}

export default HabitLayout
