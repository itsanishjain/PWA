'use client'

import { Button } from '@/app/pwa/_components/ui/button'
import route from '@/lib/utils/routes'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef } from 'react'
import MyPoolsTabs from './my-pools.tabs'
import type { MyPoolsTab } from './my-pools.tabs.config'
import { Route } from 'next'
import { useAppStore } from '@/app/pwa/_client/providers/app-store.provider'

const MyPools: React.FC = (): JSX.Element => {
    const searchParams = useSearchParams()
    const { myPoolsTab, setMyPoolsTab, setBottomBarContent } = useAppStore(state => ({
        myPoolsTab: state.myPoolsTab,
        setMyPoolsTab: state.setMyPoolsTab,
        setBottomBarContent: state.setBottomBarContent,
    }))
    const initialLoadRef = useRef(true)

    useEffect(() => {
        console.log('MyPools mounted')
        const tabFromUrl = searchParams?.get('tab') as 'upcoming' | 'past'

        if (initialLoadRef.current) {
            if (tabFromUrl && ['upcoming', 'past'].includes(tabFromUrl)) {
                setMyPoolsTab(tabFromUrl)
            } else {
                // Si no hay deeplink válido, ajusta el search param al valor de la store
                updateSearchParam(myPoolsTab)
            }
            initialLoadRef.current = false
        }

        setBottomBarContent(
            <Button
                asChild
                className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                <Link href={'/pool/new' as Route}>Create Pool</Link>
            </Button>,
        )
        return () => {
            console.log('MyPools unmounted')
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
            console.log('Changing tab to:', tabId)
            setMyPoolsTab(tabId as MyPoolsTab['id'])
            updateSearchParam(tabId)
        },
        [setMyPoolsTab],
    )

    return <MyPoolsTabs currentTab={myPoolsTab} onChangeTab={handleChangeTab} initialLoad={initialLoadRef.current} />
}

export default MyPools
