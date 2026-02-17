"use client"

import * as React from "react"

type AuthGuardContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const AuthGuardContext = React.createContext<AuthGuardContextValue | null>(null)

export function AuthGuardProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const value = React.useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen]
  )

  return (
    <AuthGuardContext.Provider value={value}>
      {children}
    </AuthGuardContext.Provider>
  )
}

export function useAuthGuardContext() {
  const ctx = React.useContext(AuthGuardContext)
  if (!ctx) {
    throw new Error("useAuthGuardContext must be used within AuthGuardProvider")
  }
  return ctx
}
