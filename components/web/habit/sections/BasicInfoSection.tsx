import { Card } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { THabitFormValues } from '@/schema/habitSchema'
import { Control, Controller } from 'react-hook-form'

export const BasicInfoSection = ({ control }: { control: Control<THabitFormValues> }) => {
    return (
        <section className="space-y-4">
            <Card className="px-6">
                <div className="relative">
                    <h3 className="text-lg font-medium ">Basic Information</h3>
                    <span className="absolute w-1 h-full bg-primary top-0 right-0 rounded-2xl"></span>
                </div>
                <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-0">
                            <FieldLabel className="pb-2">Habit Name</FieldLabel>
                            <Input
                                {...field}
                                placeholder="e.g. Morning Exercise"
                                className="bg-muted/70"
                            />
                            <FieldDescription className="text-xs pt-1 pl-1 ">
                                Choose a clear and motivating name for your habit
                            </FieldDescription>
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="gap-0">
                            <FieldLabel className="pb-2">Description</FieldLabel>
                            <Textarea
                                {...field}
                                placeholder="What will you do? How will it help you?"
                                className="bg-muted/70"
                            />
                            <FieldDescription className="text-xs pt-1 pl-1 ">
                                Optional: Add details about your habit
                            </FieldDescription>
                            {fieldState.error && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </Card>
        </section>
    )
}


