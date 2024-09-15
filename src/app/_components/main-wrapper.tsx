'use client'

import { cn } from '@/lib/utils/tailwind'
import { useEffect } from 'react'
import { useAppStore } from '@/app/_client/providers/app-store.provider'

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
                'flex flex-1 flex-col overflow-auto px-safe-or-6',
                'mt-24 pb-safe-offset-24', // Adjust top padding to account for topbar height
                isBottomBarVisible ? 'mb-24' : '', // Add bottom margin when bottombar is visible
            )}>
            {children}
        </main>
    )
}
