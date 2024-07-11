'use client'

import { getPoolStatus } from '@/app/pwa/_lib/utils/get-pool.status'
import { getStatusString } from '@/app/pwa/_lib/utils/get-relative-date'
import { cn } from '@/lib/utils/tailwind'
import { motion } from 'framer-motion'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import frog from '@/public/app/images/frog.png'

interface PoolItem {
    id: string
    name: string
    image: string
    startDate: Date
    endDate: Date
    status: string
    numParticipants: number
}

export default function PoolListCard({ name, startDate, endDate, id, status, image }: PoolItem) {
    const statusIndicator = getPoolStatus({ startDate, endDate })

    const resolvedImage = image || frog.src

    return (
        <Link href={`/pool/${id}` as Route}>
            <motion.div
                className='flex h-24 items-center gap-[14px] rounded-[2rem] bg-[#f4f4f4] p-3 pr-4'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <div className='relative size-[72px] shrink-0 overflow-hidden rounded-[16px] bg-neutral-200'>
                    <Image src={resolvedImage} alt='Pool Image' fill priority sizes='72px' className='object-cover' />
                    {status !== 'past' && (
                        <div
                            className={cn(
                                'absolute bottom-0 z-10 flex w-full items-center justify-center bg-black/40 pr-[9px] text-center text-[10px] text-white backdrop-blur-md before:mr-[4px] before:size-[5px] before:rounded-full',
                                statusIndicator === 'live' && 'before:animate-pulse before:bg-[#24ff00]',
                            )}>
                            {statusIndicator.charAt(0).toUpperCase() + statusIndicator.slice(1)}
                        </div>
                    )}
                </div>
                <div className='flex flex-col gap-[5px] truncate'>
                    <h1 className='truncate text-sm font-semibold'>{name}</h1>
                    <span className='truncate text-xs font-medium tracking-tight'>0/200 Registered</span>
                    <span className='truncate text-xs font-medium tracking-tight'>
                        {getStatusString({ status: statusIndicator, startDate, endDate })}
                    </span>
                </div>
            </motion.div>
        </Link>
    )
}
