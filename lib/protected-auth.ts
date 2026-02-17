import { cache } from "react"
import { redirect } from "next/navigation"
import { fetchMutation } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { getToken } from "@/lib/auth-server"

export const requireAuthAndSyncUser = cache(async () => {
  const token = await getToken()
  if (!token) {
    redirect("/auth/sign-in")
  }

  try {
    await fetchMutation(api.users.syncUser, {}, { token })
  } catch {
    redirect("/auth/sign-in")
  }

  return token
})
