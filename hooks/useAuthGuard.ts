"use client"

import { useAuthGuardContext } from "@/components/web/auth/AuthGuardProvider"
import { useIsAuthenticated } from "./useIsAuthenticated"

export function useAuthGuard() {
  const { isAuthenticated, isLoading } = useIsAuthenticated()
  const { open, close, isOpen } = useAuthGuardContext()

  const requireAuth = (callback?: () => void) => {
    if (isAuthenticated) {
      callback?.()
      return true
    }
    open()
    return false
  }

  return {
    isAuthenticated,
    isLoading,
    isOpen,
    openAuthModal: open,
    closeAuthModal: close,
    requireAuth,
  }
}
