'use client'

import { useAppStore } from '@/app/pwa/_client/providers/app-store.provider'
import { cn } from '@/lib/utils/tailwind'
import { useEffect } from 'react'

interface MainContentWrapperProps {
    children: React.ReactNode
    title?: string | null
}

export default function MainContentWrapper({ children, title = null }: MainContentWrapperProps) {
    const { isBottomBarVisible, setTopBarTitle } = useAppStore(state => ({
        isBottomBarVisible: Boolean(state.bottomBarContent),
        setTopBarTitle: state.setTopBarTitle,
    }))

    useEffect(() => {
        setTopBarTitle(title)
        return () => {
            setTopBarTitle(null)
        }
    }, [setTopBarTitle, title])

    return (
        <main
            className={cn(
                'mx-auto flex h-full w-dvw max-w-screen-md flex-1 flex-col pt-safe-offset-24 mb-safe-or-24 px-safe-or-6',
                isBottomBarVisible ? 'pb-6' : '',
            )}>
            {children}
        </main>
    )
}
