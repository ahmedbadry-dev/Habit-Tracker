import {
  ChartColumn,
  LayoutDashboard,
  PlusCircle,
  Settings,
  type LucideIcon,
} from "lucide-react"

export type NavItemConfig = {
  href: string
  label: string
  icon: LucideIcon
  protected?: boolean
}

export const APP_NAV_ITEMS: NavItemConfig[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    protected: false,
  },
  {
    href: "/add-habit",
    label: "Add Habit",
    icon: PlusCircle,
    protected: true,
  },
  {
    href: "/statistics",
    label: "Statistics",
    icon: ChartColumn,
    protected: true,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    protected: true,
  },
]
