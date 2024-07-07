'use client'

import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { cn } from '@/lib/utils/tailwind'

interface MainContentWrapperProps {
    children: React.ReactNode
}

export default function MainContentWrapper({ children }: MainContentWrapperProps) {
    const isBottomBarVisible = useSettingsStore(state => Boolean(state.bottomBarContent))

    return (
        <main
            className={cn(
                'mx-auto flex size-full w-dvw max-w-screen-md flex-1 flex-col pt-safe-offset-24 mb-safe-or-24 px-safe-or-3',
                isBottomBarVisible ? 'pb-6' : '',
            )}>
            {children}
        </main>
    )
}
