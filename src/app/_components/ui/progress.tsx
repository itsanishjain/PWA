'use client'

import { cn } from '@/lib/utils/tailwind'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { forwardRef } from 'react'

const Progress = forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            'relative h-[0.8125rem] w-full overflow-hidden rounded-full border-[0.5px] border-[#CBDAFA] bg-white',
            className,
        )}
        {...props}>
        <ProgressPrimitive.Indicator
            className='detail_card_progress size-full flex-1 rounded-full transition-all'
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
