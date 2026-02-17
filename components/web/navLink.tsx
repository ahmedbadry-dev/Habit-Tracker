'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export function NavLink({
    href,
    children,
    className = '',
    protectedRoute = false,
}: {
    href: string
    children: React.ReactNode
    className?: string
    protectedRoute?: boolean
}) {
    const pathname = usePathname()
    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href)
    const { requireAuth } = useAuthGuard()

    return (
        <Link
            href={href}
            className={`${className} ${isActive ? 'active' : ''}`}
            onClick={(e) => {
                if (!protectedRoute) return
                const allowed = requireAuth()
                if (!allowed) e.preventDefault()
            }}
        >
            {children}
        </Link>
    )
}
