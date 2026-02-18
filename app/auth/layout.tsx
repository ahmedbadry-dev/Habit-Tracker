import PixelBlast from "@/components/PixelBlast"
import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

            {/* 🔥 Background */}
            <div className="absolute inset-0 -z-10 opacity-40">
                <PixelBlast
                    variant="square"
                    pixelSize={5}
                    color="#5ea500"
                    patternScale={2}
                    patternDensity={1}
                    pixelSizeJitter={0}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid={false}
                    speed={0.5}
                    edgeFade={0.25}
                    transparent
                />
            </div>

            {/* overlay عشان readability */}
            <div className="absolute inset-0 bg-black/40 -z-10" />

            {/* Back button */}
            <div className="absolute top-5 left-5">
                <Link href="/" className={buttonVariants({ variant: "secondary" })}>
                    <ArrowLeft />
                    Go Back
                </Link>
            </div>

            {/* Content */}
            <div className="w-full max-w-md mx-auto p-4">
                {children}
            </div>
        </div>
    )
}

export default Layout
