'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import PoolList from './pool-list'
import PoolsSkeleton from './pools-skeleton'
import { useUpcomingPools } from '@/hooks/use-upcoming-pools'

export default function UpcomingPools() {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useUpcomingPools()
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [inView, fetchNextPage, hasNextPage])

    if (isError) {
        return <div>Error loading upcoming pools</div>
    }

    const pools = data?.pages.flatMap(page => page) ?? []

    return (
        <>
            <h1 className='mb-4 text-lg font-semibold'>Upcoming Pools</h1>
            {isLoading ? (
                <PoolsSkeleton length={8} />
            ) : (
                <>
                    <PoolList pools={pools} name='feed' />
                    {isFetchingNextPage && <PoolsSkeleton length={4} />}
                    <div ref={ref} />
                </>
            )}
        </>
    )
}
