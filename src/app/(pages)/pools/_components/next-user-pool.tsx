'use client'

import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import PoolList from './pool-list'
import type { Route } from 'next'
import PoolsSkeleton from './pools-skeleton'
import { useUserNextPool } from '@/hooks/use-user-next-pool'

export default function NextUserPool() {
    const { data: pool, isLoading, error } = useUserNextPool()

    if (error) {
        console.error('Error fetching user next pool', error)
        return <div>Error loading next pool</div>
    }

    return (
        <>
            <Link href={'/my-pools' as Route} className='flex shrink justify-between'>
                <h1 className='text-lg font-semibold'>Your Pools</h1>
                <ChevronRightIcon className='size-6 text-[#1a70e0]' />
            </Link>
            {isLoading ? <PoolsSkeleton length={1} /> : <PoolList pools={pool ? [pool] : []} name='user' />}
        </>
    )
}
