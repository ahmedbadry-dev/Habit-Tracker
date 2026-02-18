'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { IconSettings } from '@tabler/icons-react'

function Row({
    title,
    desc,
    right,
}: {
    title: React.ReactNode
    desc?: string
    right: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-between gap-6 py-4">
            <div className="space-y-1">
                <div className="text-sm font-medium">{title}</div>
                {desc ? (
                    <div className="text-xs text-muted-foreground">{desc}</div>
                ) : null}
            </div>
            <div className="shrink-0">{right}</div>
        </div>
    )
}

const REMINDER_TIMES = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '12:00',
    '18:00',
    '20:00',
] as const

const WEEK_STARTS = ['monday', 'sunday', 'saturday'] as const
type SettingsPatch = {
    pushEnabled?: boolean
    defaultReminderTime?: string
    weekStartsOn?: 'monday' | 'sunday' | 'saturday'
}

export default function SettingsClient() {
    const { theme, setTheme } = useTheme()
    const router = useRouter()

    const settings = useQuery(api.settings.getMySettings)
    const update = useMutation(api.settings.updateMySettings)

    const [optimistic, setOptimistic] = React.useState<null | SettingsPatch>(null)

    const safeUpdate = async (patch: SettingsPatch) => {
        setOptimistic((prev) => ({ ...(prev ?? {}), ...patch }))

        try {
            await update({ patch })
            setOptimistic(null)
        } catch (err) {
            setOptimistic(null)
            console.error(err)
            toast.error('Failed to update setting')
        }
    }

    const darkModeChecked = (theme ?? 'light') === 'dark'

    if (settings === undefined || settings === null) return null

    const merged = {
        pushEnabled: optimistic?.pushEnabled ?? settings.pushEnabled,
        defaultReminderTime:
            optimistic?.defaultReminderTime ?? settings.defaultReminderTime,
        weekStartsOn: optimistic?.weekStartsOn ?? settings.weekStartsOn,
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
            <div className="mb-6 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg border bg-background">
                    <span className="text-sm"><IconSettings className='size-4 text-muted-foreground' /></span>
                </div>
                <h1 className="text-xl font-semibold">Settings</h1>
            </div>

            <div className="space-y-6">
                <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            Notifications
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <Row
                            title={
                                <span className="inline-flex items-center gap-2">
                                    Push Notifications
                                    <Badge variant="secondary">Soon</Badge>
                                </span>
                            }
                            desc="Enable browser push reminders."
                            right={
                                <Switch
                                    checked={merged.pushEnabled}
                                    onCheckedChange={() => { }}
                                />
                            }

                        />

                        {/* <Row
                            title="Test Notification"
                            desc="Send a test push to this device"
                            right={
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                        try {
                                            const result = await sendTestPush({
                                                title: 'Habit Tracker',
                                                body: 'Test notification sent successfully.',
                                                url: '/settings',
                                            })
                                            const ok = result?.success ?? 0
                                            const total = result?.sent ?? 0
                                            toast.success(`Sent ${ok}/${total} notifications`)
                                        } catch (err) {
                                            console.error(err)
                                            toast.error('Failed to send test notification')
                                        }
                                    }}
                                    disabled={!merged.pushEnabled}
                                >
                                    Send Test
                                </Button>

                            }
                        /> */}

                        <Separator />

                        <Row
                            title="Default Reminder Time"
                            desc="Choose the default daily reminder time."
                            right={
                                <Select
                                    value={merged.defaultReminderTime}
                                    onValueChange={(v) =>
                                        safeUpdate({ defaultReminderTime: v })
                                    }
                                >
                                    <SelectTrigger className="w-35 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REMINDER_TIMES.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {formatTimeLabel(t)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            }
                        />
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            Appearance
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <Row
                            title="Dark Mode"
                            desc="Switch between light and dark theme."
                            right={
                                <Switch
                                    checked={darkModeChecked}
                                    onCheckedChange={(v) =>
                                        setTheme(v ? 'dark' : 'light')
                                    }
                                />
                            }
                        />
                    </CardContent>
                </Card>

                <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                            General
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="pt-0">
                        <Row
                            title="Week Starts On"
                            desc="Select the first day of the week."
                            right={
                                <Select
                                    value={merged.weekStartsOn}
                                    onValueChange={(v) =>
                                        safeUpdate({
                                            weekStartsOn: v as
                                                | 'monday'
                                                | 'sunday'
                                                | 'saturday',
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-35 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {WEEK_STARTS.map((w) => (
                                            <SelectItem key={w} value={w}>
                                                {w === 'monday'
                                                    ? 'Monday'
                                                    : w === 'sunday'
                                                        ? 'Sunday'
                                                        : 'Saturday'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            }
                        />
                    </CardContent>
                </Card>

                <Card className="rounded-2xl md:hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Account</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={async () => {
                                await authClient.signOut()
                                router.push('/auth/sign-in')
                            }}
                        >
                            <LogOut className="size-4" />
                            Log out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function formatTimeLabel(hhmm: string) {
    const [hStr, mStr] = hhmm.split(':')
    const h = Number(hStr)
    const m = Number(mStr)

    const isPM = h >= 12
    const hour12 = ((h + 11) % 12) + 1
    const mm = String(m).padStart(2, '0')

    return `${hour12}:${mm} ${isPM ? 'PM' : 'AM'}`
}
