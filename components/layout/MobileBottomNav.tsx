"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { APP_NAV_ITEMS, NAV_LABEL_FALLBACKS } from "@/components/web/nav-config"
import { useAppLanguage } from "@/hooks/useAppLanguage"

export default function MobileBottomNav() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { dict } = useAppLanguage()
  const { isAuthenticated, requireAuth } = useAuthGuard()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/80 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto grid h-18 max-w-3xl grid-cols-4 items-center px-2 pb-[env(safe-area-inset-bottom)] pt-1">
        {APP_NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          const isProtectedGuest = Boolean(item.protected && mounted && !isAuthenticated)
          const label = mounted ? dict.nav[item.labelKey] : NAV_LABEL_FALLBACKS[item.labelKey]

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => {
                if (!item.protected) return
                const allowed = requireAuth()
                if (!allowed) event.preventDefault()
              }}
              className={cn(
                "group relative mx-1 flex h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 transition-all duration-200 active:scale-[0.97]",
                "hover:shadow-sm",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
                isActive && "-translate-y-px scale-[1.01]",
                isProtectedGuest && "opacity-85"
              )}
            >
              <item.icon
                className={cn(
                  "size-5 transition-transform duration-200",
                  isActive ? "text-primary" : "text-current"
                )}
              />
              <span
                className={cn(
                  "text-[11px] font-medium leading-none transition-colors duration-200",
                  isActive ? "text-primary" : "text-current"
                )}
              >
                {label}
              </span>
              <span
                className={cn(
                  "absolute bottom-1.5 h-1 w-1 rounded-full bg-primary transition-opacity duration-200",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
