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
    IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { useAppLanguage } from "@/hooks/useAppLanguage"
import { api } from "@/convex/_generated/api"
import { APP_NAV_ITEMS } from "./nav-config"

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

    const navMain = APP_NAV_ITEMS.map((item) => ({
        title: dict.nav[item.labelKey],
        url: item.href,
        icon: item.icon,
        protected: item.protected,
    }))

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
