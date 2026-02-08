import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/web/app-sidebar"
import { SiteHeader } from "@/components/web/site-header"

const HabitLayout = ({ children }: { children: React.ReactNode }) => {
    return (
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
                <div className="flex-1">
                    <div className="@container/main max-w-7xl m-auto">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default HabitLayout