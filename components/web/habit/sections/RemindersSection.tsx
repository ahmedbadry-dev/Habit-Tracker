import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { THabitFormValues } from '@/schema/habitSchema'
import { Control, Controller } from 'react-hook-form'

export const RemindersSection = ({ control, remindersEnabled }: { control: Control<THabitFormValues>, remindersEnabled: boolean }) => {

    return (
        <section className="space-y-4">
            <Card>
                <CardContent>
                    <div className="relative mb-6">
                        <h3 className="text-lg font-medium ">Reminders</h3>
                        <span className="absolute w-1 h-full bg-primary top-0 right-0 rounded-2xl"></span>
                    </div>


                    {/* Enable reminder */}
                    <Controller
                        name="reminders.enabled"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field orientation="horizontal" className="items-center justify-between">
                                <div>
                                    <FieldLabel className="mb-1 text-sm">Enable Reminders</FieldLabel>
                                    <FieldDescription>
                                        Get notified when it's time to practice your habit
                                    </FieldDescription>
                                </div>

                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                {fieldState.error && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    {/* Reminder time */}
                    <Controller
                        name="reminders.time"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className={cn("mt-4", !remindersEnabled && "opacity-50")}
                                aria-disabled={!remindersEnabled}
                            >
                                <FieldLabel htmlFor="reminder-time">Reminder Time</FieldLabel>

                                <Input
                                    id="reminder-time"
                                    type="time"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    disabled={!remindersEnabled}                 // ✅ يمنع mouse + keyboard
                                    aria-invalid={fieldState.invalid || undefined}
                                    aria-describedby={fieldState.error ? "reminder-time-error" : undefined}
                                />

                                {fieldState.error && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

                </CardContent>
            </Card>
        </section>
    )
}
