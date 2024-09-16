'use client'

import { getPoolStatus } from '@/app/pwa/_lib/utils/get-pool.status'
import { getStatusString } from '@/app/pwa/_lib/utils/get-relative-date'
import { cn } from '@/lib/utils/tailwind'
import { motion } from 'framer-motion'
import type { Route } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import frog from '@/public/app/images/frog.png'
import { Skeleton } from '@/app/pwa/_components/ui/skeleton'

interface PoolItem {
    id: string
    name: string
    image: string
    startDate: Date
    endDate: Date
    status: string
    numParticipants: number
    softCap: number
}

const PoolCardSkeleton = () => {
    return (
        <Skeleton className='flex h-24 items-center gap-[14px] rounded-[2rem] bg-[#f4f4f4] p-3 pr-4'>
            <Skeleton className='size-[72px] rounded-[16px] bg-[#36a0f7]/20' />
            <div className='flex flex-col gap-[5px]'>
                <Skeleton className='h-4 w-10 bg-[#36a0f7]/20' />
                <Skeleton className='h-4 w-16 bg-[#36a0f7]/20' />
                <Skeleton className='h-4 w-28 bg-[#36a0f7]/20' />
            </div>
        </Skeleton>
    )
}

export default function PoolListCard({
    name,
    startDate,
    endDate,
    id,
    status,
    image,
    numParticipants,
    softCap,
}: PoolItem) {
    const statusIndicator = getPoolStatus({ startDate, endDate })

    const resolvedImage = image || frog.src

    if (!id) return <PoolCardSkeleton />

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
                    <span className='truncate text-xs font-medium tracking-tight'>{`${numParticipants}/${softCap} Registered`}</span>
                    <span className='truncate text-xs font-medium tracking-tight'>
                        {getStatusString({ status: statusIndicator, startDate, endDate })}
                    </span>
                </div>
            </motion.div>
        </Link>
    )
}
