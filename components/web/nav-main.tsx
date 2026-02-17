"use client"


import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink } from "./navLink"
import Link from "next/link"
import { useAuthGuard } from "@/hooks/useAuthGuard"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    protected?: boolean
  }[]
}) {
  const { requireAuth } = useAuthGuard()


  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Link
              href={'/add-habit'}
              className="w-full"
              onClick={(e) => {
                const allowed = requireAuth()
                if (!allowed) e.preventDefault()
              }}
            >
              <SidebarMenuButton
                tooltip="Quick Create"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <IconCirclePlusFilled />
                Quick Create
              </SidebarMenuButton>
            </Link>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <Link
                href={'/settings'}
                onClick={(e) => {
                  const allowed = requireAuth()
                  if (!allowed) e.preventDefault()
                }}
              >
                <IconMail />
              </Link>
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink
                href={item.url}
                className="group block"
                protectedRoute={item.protected}
              >
                <SidebarMenuButton
                  tooltip={item.title}
                  className="
                      rounded-md
                      transition-colors duration-200
                      bg-transparent
                      group-[&.active]:bg-muted/60
                      group-[&.active]:text-foreground
                      hover:bg-muted/40
                      cursor-pointer
                      border-[3px] border-r-[3px] border-transparent 
                      group-[&.active]:border-[3px] group-[&.active]:border-r-[3px] group-[&.active]:border-r-primary
                      group-[&.active]:rounded-r-none
                      rounded-r-none
                    "
                >
                  {item.icon && <item.icon />}
                  {item.title}
                </SidebarMenuButton>
              </NavLink>
            </SidebarMenuItem>
          ))}


        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
