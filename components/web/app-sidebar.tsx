"use client"
import { useEffect, useState } from "react"
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
import { api } from "@/convex/_generated/api"
import { APP_NAV_ITEMS } from "./nav-config"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [mounted, setMounted] = useState(false)
    const { isAuthenticated } = useConvexAuth()
    const profile = useQuery(
        api.users.getCurrentUserProfile,
        isAuthenticated ? {} : "skip"
    )

    useEffect(() => {
        setMounted(true)
    }, [])

    const user = mounted ? {
        name: profile?.name ?? "User",
        email: profile?.email ?? (isAuthenticated ? "loading..." : "guest"),
        avatar: profile?.name.slice(0, 2).toUpperCase() ?? 'GU',
    } : {
        name: "User",
        email: "guest",
        avatar: 'GU',
    }

    const navMain = APP_NAV_ITEMS.map((item) => ({
        title: item.label,
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
