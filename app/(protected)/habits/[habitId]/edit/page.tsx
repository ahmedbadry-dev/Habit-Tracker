import { preloadQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { requireAuthAndSyncUser } from "@/lib/protected-auth"

import { notFound } from "next/navigation"
import EditHabitClient from "@/components/web/habit/EditHabitClient"
import { Id } from "@/convex/_generated/dataModel"

type Props = {
    params: Promise<{ habitId: Id<'habits'> }>
}

export default async function EditHabitPage({ params }: Props) {
    const token = await requireAuthAndSyncUser()

    const habitId = (await params).habitId

    const habit = await preloadQuery(
        api.habits.getHabitById,
        { habitId },
        { token }
    ).catch(() => null)

    if (!habit) return notFound()

    return <EditHabitClient preloadedHabit={habit} />
}
