
import AddHabitClient from "@/components/web/habit/AddHabitClient"


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



export default function AddHabitPage() {
    return (
        <div className="p-4 space-y-4">
            <AddHabitClient />
        </div>
    )
}
