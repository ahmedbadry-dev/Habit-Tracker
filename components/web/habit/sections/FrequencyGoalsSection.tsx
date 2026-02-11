import { Card, CardContent } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { THabitFormValues } from '@/schema/habitSchema'
import { Control, Controller } from 'react-hook-form'

export const FrequencyGoalsSection = ({ control }: { control: Control<THabitFormValues> }) => {
    return (
        <section className="space-y-4">
            <Card>
                <CardContent>
                    <div className="relative mb-6">
                        <h3 className="text-lg font-medium ">Frequency & Goals</h3>
                        <span className="absolute w-1 h-full bg-primary top-0 right-0 rounded-2xl"></span>
                    </div>

                    {/* How often */}
                    <FieldGroup>
                        <Controller
                            name="frequency"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid} className="gap-0">
                                    <FieldLabel className="pb-2">How often?</FieldLabel>
                                    <Select
                                        name={field.name}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            id="form-rhf-select-frequency"
                                            aria-invalid={fieldState.invalid}
                                            className="min-w-30"
                                        >
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="item-aligned">
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    {/* Target + Unit */}
                    <FieldGroup>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="target"
                                control={control}
                                render={(({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Target</FieldLabel>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={field.value ?? ""}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === "" ? undefined : Number(e.target.value)
                                                )
                                            }
                                        />

                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                ))}
                            />

                            <Controller
                                name="unit"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-0">
                                        <FieldLabel className="pb-2">Unit</FieldLabel>
                                        <Select
                                            name={field.name}
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                id="form-rhf-select-unit"
                                                aria-invalid={fieldState.invalid}
                                                className="min-w-30"
                                            >
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="item-aligned">
                                                <SelectItem value="times">times</SelectItem>
                                                <SelectItem value="minutes">minutes</SelectItem>
                                                <SelectItem value="hours">hours</SelectItem>
                                                <SelectItem value="pages">pages</SelectItem>
                                                <SelectItem value="glasses">glasses</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                    </FieldGroup>
                </CardContent>
            </Card>
        </section>
    )
}
