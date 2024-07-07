'use client'

import { cn } from '@/lib/utils/tailwind'
import { useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

export default function NumberTicker({
    value,
    direction = 'up',
    delay = 0,
    className,
    padding = 0,
}: {
    value: number
    direction?: 'up' | 'down'
    className?: string
    delay?: number // delay in s
    padding?: number
}) {
    const ref = useRef<HTMLSpanElement>(null)

    // Adjust the value based on padding
    const adjustedValue = value * Math.pow(10, Math.max(0, padding - value.toString().length))

    const motionValue = useMotionValue(direction === 'down' ? adjustedValue : 0)
    const springValue = useSpring(motionValue, {
        duration: 500,
    })
    const isInView = useInView(ref, { once: true, margin: '0px' })

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                motionValue.set(direction === 'down' ? 0 : adjustedValue)
            }, delay * 500)
        }
    }, [motionValue, isInView, delay, adjustedValue, direction])

    useEffect(() => {
        return springValue.on('change', (latest: number) => {
            if (ref.current) {
                const formattedValue = Math.floor(latest).toString().padStart(padding, '0')
                ref.current.textContent = Intl.NumberFormat('en-US').format(parseInt(formattedValue))
            }
        })
    }, [springValue, padding])

    // If value is 0, we don't need animation
    if (adjustedValue === 0) {
        return (
            <span className={cn('inline-block tabular-nums', className)}>
                {padding > 0 ? '0'.padStart(padding, '0') : '0'}
            </span>
        )
    }

    return <span className={cn('inline-block tabular-nums', className)} ref={ref} />
}
