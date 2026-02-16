'use client'

import React from 'react'
import { motion } from 'framer-motion'
import CelebrationBurst from '@/components/layout/CelebrationBurst'


export default function HabitItemClient({ habit }) {
    const [showBurst, setShowBurst] = React.useState(false)

    const prevCompleted = React.useRef(habit.completed)

    React.useEffect(() => {
        if (!prevCompleted.current && habit.completed) {
            setShowBurst(true)

            const t = setTimeout(() => {
                setShowBurst(false)
            }, 800)

            return () => clearTimeout(t)
        }

        prevCompleted.current = habit.completed
    }, [habit.completed])

    return (
        <motion.div
            className="relative overflow-visible rounded-2xl border p-5"
            animate={
                habit.completed
                    ? { scale: [1, 2, 1] }
                    : { scale: 1 }
            }
            transition={{ duration: 1 }}
        >
            {showBurst && <CelebrationBurst />}

            {/* existing card content هنا */}
            <h3 className="truncate">{habit.title}</h3>
        </motion.div>
    )
}
