import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/web/header/Header"
import { NavLink } from "@/components/web/navLink"
import StatisticsFilter from "@/components/web/statistics/overview/StatisticsFilters"
import { ArrowLeft, Filter } from "lucide-react"
import Link from "next/link"

const StatisticsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="p-4 space-y-4 ">
            <Header>
                <div className="flex gap-6 items-center">
                    <div>
                        <Link href={'/'} className={buttonVariants({ variant: "outline" })}>
                            <ArrowLeft className="size-4 text-muted-foreground" />
                        </Link>
                    </div>
                    <div className="relative">
                        <p className="text-2xl font-medium">Statistics</p>
                        <span className="absolute w-[50%] h-1 bg-primary -bottom-2 rounded"></span>
                    </div>
                </div>
                {/* select filtration */}
                <div className="flex items-center gap-4">
                    <StatisticsFilter />
                    <div className="p-2 rounded-full cursor-pointer border-2 border-popover-foreground/30 hover:bg-muted">
                        <Filter className="size-4 text-muted-foreground" />
                    </div>
                </div>
            </Header>
            <nav className="mb-10">
                <div className="flex text-center bg-accent rounded-2xl max-w-5xl m-auto ">
                    <NavLink href={'/statistics'} className="flex-1 p-2 [&.active]:bg-primary-foreground [&.active]:text-primary text-muted-foreground rounded-2xl transition duration-200">Overview</NavLink>
                    <NavLink href={'/statistics/habits'} className="flex-1 p-2 [&.active]:bg-primary-foreground [&.active]:text-primary text-muted-foreground rounded-2xl transition duration-200">Habits</NavLink>
                    <NavLink href={'/statistics/insights'} className="flex-1 p-2 [&.active]:bg-primary-foreground [&.active]:text-primary text-muted-foreground rounded-2xl transition duration-200">Insights</NavLink>
                </div>
            </nav>
            {children}
        </div >
    )
}

export default StatisticsLayout
