'use client'

import { Button } from '@/app/_components/ui/button'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import MyPoolsTabs from './my-pools.tabs'
import type { MyPoolsTab } from './my-pools.tabs.config'
import { Route } from 'next'
import { useAppStore } from '@/app/_client/providers/app-store.provider'
import { PoolItem } from '@/app/_lib/entities/models/pool-item'
import { useServerActionQuery } from '@/app/_client/hooks/server-action-hooks'
import { getUserPastPoolsAction, getUserUpcomingPoolsAction } from '../actions'

interface MyPoolsProps {
    initialUpcomingPools: PoolItem[] | null
    initialPastPools: PoolItem[] | null
}

const MyPools: React.FC<MyPoolsProps> = ({ initialUpcomingPools, initialPastPools }): JSX.Element => {
    const searchParams = useSearchParams()
    const { myPoolsTab, setMyPoolsTab, setBottomBarContent } = useAppStore(state => ({
        myPoolsTab: state.myPoolsTab,
        setMyPoolsTab: state.setMyPoolsTab,
        setBottomBarContent: state.setBottomBarContent,
    }))
    const initialLoadRef = useRef(true)

    const { data: upcomingPools } = useServerActionQuery(getUserUpcomingPoolsAction, {
        queryKey: ['getUserUpcomingPoolsAction'],
        input: undefined,
        initialData: initialUpcomingPools ?? [],
    })

    const { data: pastPools } = useServerActionQuery(getUserPastPoolsAction, {
        queryKey: ['getUserPastPoolsAction'],
        input: undefined,
        initialData: initialPastPools ?? [],
    })

    useEffect(() => {
        const tabFromUrl = searchParams?.get('tab') as 'upcoming' | 'past'

        if (initialLoadRef.current) {
            if (tabFromUrl && ['upcoming', 'past'].includes(tabFromUrl)) {
                setMyPoolsTab(tabFromUrl)
            } else {
                updateSearchParam(myPoolsTab)
            }
            initialLoadRef.current = false
        }

        setBottomBarContent(
            <Button
                asChild
                className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                <Link href={'/pool/new'}>Create Pool</Link>
            </Button>,
        )
        return () => {
            setBottomBarContent(null)
        }
    }, [searchParams, setBottomBarContent, setMyPoolsTab, myPoolsTab])

    const updateSearchParam = (tab: string) => {
        const params = new URLSearchParams(window.location.search)
        params.set('tab', tab)
        window.history.replaceState(null, '', `?${params.toString()}`)
    }

    const handleChangeTab = useCallback(
        (tabId: string) => {
            setMyPoolsTab(tabId as MyPoolsTab['id'])
            updateSearchParam(tabId)
        },
        [setMyPoolsTab],
    )

    return (
        <MyPoolsTabs
            currentTab={myPoolsTab}
            onChangeTab={handleChangeTab}
            initialLoad={initialLoadRef.current}
            upcomingPools={upcomingPools}
            pastPools={pastPools}
        />
    )
}

export default MyPools
