import { THabitFormValues } from "@/schema/habitSchema"
import { Control } from "react-hook-form"
import { BasicInfoSection } from "./sections/BasicInfoSection"
import { AppearanceSection } from "./sections/AppearanceSection"
import { FrequencyGoalsSection } from "./sections/FrequencyGoalsSection"
import { RemindersSection } from "./sections/RemindersSection"
import { HabitPreview } from "./HabitPreview"

export const HabitForm = ({ control, remindersEnabled }: { control: Control<THabitFormValues>, remindersEnabled: boolean }) => {

    return (
        <form>
            <div className="space-y-8" >
                <BasicInfoSection control={control} />
                <AppearanceSection control={control} />
                <FrequencyGoalsSection control={control} />
                <RemindersSection control={control} remindersEnabled={remindersEnabled} />
                <HabitPreview control={control} />
            </div>
        </form>
    )
}
