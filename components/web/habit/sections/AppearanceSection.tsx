import { CATEGORY_CONFIG } from '@/app/(protected)/add-habit/page'
import { Card } from '@/components/ui/card'
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { COLOR_PRESETS, HABIT_ICONS, THabitFormValues } from '@/schema/habitSchema'
import { Control, Controller } from 'react-hook-form'

export const AppearanceSection = ({ control }: { control: Control<THabitFormValues> }) => {
    return (
        <section className="space-y-4">
            <Card className="px-6">
                <div className="relative">
                    <h3 className="text-lg font-medium ">Appearance</h3>
                    <span className="absolute w-1 h-full bg-primary top-0 right-0 rounded-2xl"></span>
                </div>

                {/* Category */}
                <FieldGroup>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FieldSet>
                                <FieldLegend className=" text-muted-foreground"><span className="text-xs">Category</span></FieldLegend>
                                <RadioGroup
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
                                        {Object.entries(CATEGORY_CONFIG).map(([key, cat]) => (
                                            <FieldLabel key={key} htmlFor={`form-rhf-radiogroup-${cat.label}`}>
                                                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                                    <div className="flex w-full justify-between items-center cursor-pointer">
                                                        <FieldContent className="flex flex-row items-center gap-4">
                                                            <div className=" bg-muted/40 border p-1 rounded "
                                                                style={{ background: cat.color }}
                                                            >
                                                                {cat.icon}
                                                            </div>
                                                            {cat.label}
                                                        </FieldContent>

                                                        <RadioGroupItem
                                                            value={key}
                                                            id={`form-rhf-radiogroup-${cat.label}`}
                                                            aria-invalid={fieldState.invalid}
                                                        />
                                                    </div>
                                                </Field>
                                            </FieldLabel>
                                        ))}
                                    </div>
                                </RadioGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </FieldSet>
                        )}
                    />
                </FieldGroup>

                {/* Icons */}
                <FieldGroup>
                    <Controller
                        name="icon"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FieldSet>
                                <FieldLegend className="text-muted-foreground"><span className="text-xs">Icon</span></FieldLegend>
                                <RadioGroup
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <div className="grid grid-cols-3 md:grid-cols-8 gap-6 justify-center">
                                        {Object.entries(HABIT_ICONS).map(([key, icon]) => (
                                            <FieldLabel key={key} htmlFor={`form-rhf-radiogroup-${key}`}>
                                                <Field
                                                    data-invalid={fieldState.invalid}
                                                    className="cursor-pointer ">
                                                    <RadioGroupItem
                                                        className="sr-only"
                                                        value={key}
                                                        id={`form-rhf-radiogroup-${key}`}
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    <div className="text-xl leading-none flex justify-center items-center">
                                                        {icon}
                                                    </div>
                                                </Field>
                                            </FieldLabel>
                                        ))}
                                    </div>
                                </RadioGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </FieldSet>
                        )}
                    />
                </FieldGroup>

                {/* colors */}
                <FieldGroup>
                    <Controller
                        name="color"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FieldSet>
                                <FieldLegend className="text-muted-foreground"><span className="text-xs">Icon</span></FieldLegend>
                                <RadioGroup
                                    name={field.name}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
                                        {Object.entries(COLOR_PRESETS).map(([key, color]) => (
                                            <FieldLabel key={key} htmlFor={`form-rhf-radiogroup-${key}`}>
                                                <Field
                                                    data-invalid={fieldState.invalid}
                                                    className="cursor-pointer h-12 ">
                                                    <RadioGroupItem
                                                        className="sr-only"
                                                        value={key}
                                                        id={`form-rhf-radiogroup-${key}`}
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    <div
                                                        style={{ background: color }}
                                                        className="w-full h-full rounded">
                                                    </div>
                                                </Field>
                                            </FieldLabel>
                                        ))}

                                    </div>
                                </RadioGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </FieldSet>
                        )}
                    />
                </FieldGroup>
            </Card>
        </section>
    )
}
