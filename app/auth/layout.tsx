import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="absolute top-5 left-5">
                <Link href={'/'} className={buttonVariants({ variant: "secondary" })}>
                    <ArrowLeft />
                    Go Back
                </Link>
            </div>
            <div className="w-full max-w-md mx-auto">
                {children}
            </div>
        </div>
    )
}

export default layout