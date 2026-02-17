import {
  ChartColumn,
  LayoutDashboard,
  PlusCircle,
  Settings,
  type LucideIcon,
} from "lucide-react"

export type NavItemConfig = {
  href: string
  labelKey: "dashboard" | "addHabit" | "statistics" | "settings"
  icon: LucideIcon
  protected?: boolean
}

export const APP_NAV_ITEMS: NavItemConfig[] = [
  {
    href: "/",
    labelKey: "dashboard",
    icon: LayoutDashboard,
    protected: false,
  },
  {
    href: "/add-habit",
    labelKey: "addHabit",
    icon: PlusCircle,
    protected: true,
  },
  {
    href: "/statistics",
    labelKey: "statistics",
    icon: ChartColumn,
    protected: true,
  },
  {
    href: "/settings",
    labelKey: "settings",
    icon: Settings,
    protected: true,
  },
]
