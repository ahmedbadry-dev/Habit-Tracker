import PageShellSkeleton from "@/components/layout/PageShellSkeleton"
import PageTransition from "@/components/layout/PageTransition"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/web/app-sidebar"
import { AuthRequiredModal } from "@/components/web/auth/AuthRequiredModal"
import { SiteHeader } from "@/components/web/site-header"
import { api } from "@/convex/_generated/api"
import { getToken } from "@/lib/auth-server"
import { fetchMutation } from "convex/nextjs"
import { redirect } from "next/navigation"
import { Suspense } from "react"

const HabitLayout = async ({ children }: { children: React.ReactNode }) => {
    const token = await getToken()
    if (!token) {
        redirect("/auth/sign-in")
    }

    if (token) {
        await fetchMutation(api.users.syncUser, {}, { token })
    }
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