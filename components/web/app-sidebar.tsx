"use client"
import { useConvexAuth, useQuery } from "convex/react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    IconChartBar,
    IconDashboard,
    IconInnerShadowTop,
    IconListDetails,
    IconSettings
} from "@tabler/icons-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { useAppLanguage } from "@/hooks/useAppLanguage"
import { api } from "@/convex/_generated/api"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { dict } = useAppLanguage()
    const { isAuthenticated } = useConvexAuth()
    const profile = useQuery(
        api.users.getCurrentUserProfile,
        isAuthenticated ? {} : "skip"
    )

    const user = {
        name: profile?.name ?? "User",
        email: profile?.email ?? (isAuthenticated ? "loading..." : "guest"),
        avatar: "",
    }

    const navMain = [
        {
            title: dict.nav.dashboard,
            url: "/",
            icon: IconDashboard,
            protected: false,
        },
        {
            title: dict.nav.addHabit,
            url: "/add-habit",
            icon: IconListDetails,
            protected: true,
        },
        {
            title: dict.nav.statistics,
            url: "/statistics",
            icon: IconChartBar,
            protected: true,
        },
        {
            title: dict.nav.settings,
            url: "/settings",
            icon: IconSettings,
            protected: true,
        },
    ]

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="#">
                                <IconInnerShadowTop className="size-5!" />
                                <span className="text-base font-semibold">Ahmed Badry</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}
