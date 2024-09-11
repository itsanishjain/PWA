'use client'

import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { getUserNextPoolAction } from '../actions'
import PoolList from './pool-list'
import { Route } from 'next'
import { useQuery } from '@tanstack/react-query'
import PoolsSkeleton from './pools-skeleton'
import { PoolItem } from '@/app/pwa/_lib/entities/models/pool-item'
import { useServerActionQuery } from '@/app/pwa/_client/hooks/server-action-hooks'

export default function NextUserPool({ initialNextPool }: { initialNextPool?: PoolItem | null }) {
    const {
        data: pools,
        isLoading,
        isPending,
        isFetching,
        error,
    } = useServerActionQuery(getUserNextPoolAction, {
        queryKey: ['user-next-pool'],
        input: undefined,
        initialData: initialNextPool || undefined,
    })

    if (isLoading || isPending || isFetching) {
        return <PoolsSkeleton title='Your Pools' length={1} />
    }

    if (error) {
        // TODO: call get auth token somewhere and refresh?
        console.log('Error fetching user next pool', error)
    }

    return (
        <>
            <Link href={'/my-pools' as Route} className='flex justify-between'>
                <h1 className='text-lg font-semibold'>Your Pools</h1>
                <ChevronRightIcon className='size-6 text-[#1a70e0]' />
            </Link>
            <PoolList pools={pools && [pools]} />
        </>
    )
}
