'use client'

import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { COLOR_PRESETS, HABIT_ICONS, habitSchema, THabitFormValues } from "@/schema/habitSchema"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { HabitPreview } from "@/components/web/HabitPreview"


export const CATEGORY_CONFIG = {
    health: {
        label: "Health",
        icon: "🧬",
        color: "linear-gradient(135deg,#22c55e,#16a34a)",
    },
    mindfulness: {
        label: "Mindfulness",
        icon: "🧠",
        color: "linear-gradient(135deg,#a855f7,#7c3aed)",
    },
    learning: {
        label: "Learning",
        icon: "📚",
        color: "linear-gradient(135deg,#3b82f6,#2563eb)",
    },
    productivity: {
        label: "Productivity",
        icon: "🔥",
        color: "linear-gradient(135deg,#f97316,#ea580c)",
    },
    creativity: {
        label: "Creativity",
        icon: "🎨",
        color: "linear-gradient(135deg,#ec4899,#8b5cf6)",
    },
    social: {
        label: "Social",
        icon: "👥",
        color: "linear-gradient(135deg,#eab308,#ca8a04)",
    },
} as const




const page = () => {
    const { control, handleSubmit, watch } = useForm<THabitFormValues>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "health",
            icon: "heart",
            color: "indigo",
            frequency: "daily",
            target: undefined,
            unit: "times",
            reminders: {
                enabled: false,
                time: "09:00",
            }
        }
    })

    const remindersEnabled = watch("reminders.enabled")

    const onSubmit: SubmitHandler<THabitFormValues> = (data) => {
        const payload = {
            ...data,
            target: data.target ?? 1,
        }
        console.log(payload);
    }
    return (
        <div className="p-4 space-y-4 ">
            {/* header */}
            <header className="mb-10">
                <div className="flex items-center justify-between">
                    <div className="flex gap-6 items-center">
                        <div>
                            <Link href={'/'} className={buttonVariants({ variant: "outline" })}>
                                <ArrowLeft className="size-4" />
                            </Link>
                        </div>
                        <div className="relative">
                            <p className="text-2xl font-medium">New Habit</p>
                            <span className="absolute w-[50%] h-1 bg-primary -bottom-2 rounded"></span>
                        </div>
                    </div>
                    {/* submit btn */}
                    <Button type="submit" onClick={handleSubmit(onSubmit)}>Create</Button>
                </div>
            </header>

            <form>
                <div className="space-y-8" >

                    {/* ================= Basic Information ================= */}
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

                    {/* ================= Appearance ================= */}
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

                    {/* ================= Frequency & Goals ================= */}
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


                    {/* ================= Reminders ================= */}
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


                    {/* ================= Preview ================= */}
                    <HabitPreview control={control} />
                </div>
            </form>
        </div >
    )
}

export default page
