'use client'

import PoolList from './pool-list'
import PoolsSkeleton from './pools-skeleton'
import { useServerActionQuery } from '@/app/pwa/_client/hooks/server-action-hooks'
import { getUpcomingPoolsAction } from '../actions'
import { PoolItem } from '@/app/pwa/_lib/entities/models/pool-item'

export default function UpcomingPools({ initialPools }: { initialPools?: PoolItem[] | null }) {
    const {
        isLoading,
        isPending,
        isFetching,
        data: pools,
    } = useServerActionQuery(getUpcomingPoolsAction, {
        queryKey: ['upcoming-pools'],
        input: undefined,
        initialData: initialPools || undefined,
    })

    if (isLoading || isPending || isFetching) {
        return <PoolsSkeleton title='Upcoming Pools' length={7} />
    }

    const upcomingPools = pools?.filter(pool => pool.startDate > new Date())

    return (
        <>
            <h1 className='mb-4 text-lg font-semibold'>Upcoming Pools</h1>
            <PoolList pools={upcomingPools} />
        </>
    )
}
