'use client'

import { Control, useWatch } from "react-hook-form"
import { type THabitFormValues, COLOR_PRESETS, HABIT_ICONS } from "@/schema/habitSchema"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const HabitPreview = ({ control }: { control: Control<THabitFormValues> }) => {
    const [
        title,
        icon,
        color,
        category,
        target,
        unit,
        description,
        frequency
    ] = useWatch({
        control,
        name: ["title", "icon", "color", "category", "target", "unit", "description", "frequency"],
    })

    return (
        <section>
            <Card className="px-6">
                <div className="relative">
                    <h3 className="text-lg font-medium ">Preview</h3>
                    <span className="absolute w-1 h-full bg-primary top-0 right-0 rounded-2xl"></span>
                </div>

                <CardContent className="px-0 bg-muted/30 p-4 rounded-lg">
                    <div className="flex gap-4">
                        {/* lift */}
                        <div>
                            <div
                                className="p-2.5 rounded-md text-2xl"
                                style={{ background: COLOR_PRESETS[color] }}
                            >{HABIT_ICONS[icon]}</div>
                        </div>
                        {/* right */}
                        <div>
                            <h3 className="text-2xl font-medium">{title || "Habit Name"}</h3>
                            <h3 className="text-sm text-muted-foreground mb-4">{description || "Habit description"}</h3>
                            <div className="space-x-2 text-muted-foreground">
                                <Badge variant={'secondary'} className="py-1 px-4 text-base">{category} </Badge>
                                <span className="text-sm">{target}</span>
                                <span>{unit}</span>
                                <span>{frequency}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}

