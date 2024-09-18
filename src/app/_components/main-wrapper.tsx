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
                'relative mx-auto flex w-dvw max-w-screen-md flex-1 flex-col overflow-auto pt-safe-offset-24 px-safe-or-2',
                'mt-24 pb-safe-offset-24', // Adjust margin and padding to account for topbar height
                isBottomBarVisible ? 'mb-safe-or-24' : 'mb-safe', // Add bottom margin when bottombar is visible
            )}>
            {children}
        </main>
    )
}
