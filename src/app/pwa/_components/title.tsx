'use client'

import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { cn } from '@/lib/utils/tailwind'
import { useEffect } from 'react'

interface Title {
    title?: string | null
}

export default function Title({ title = null }: Title) {
    const setTopBarTitle = useSettingsStore(state => state.setTopBarTitle)

    useEffect(() => {
        setTopBarTitle(title)
        return () => {
            setTopBarTitle(null)
        }
    }, [setTopBarTitle, title])

    return null
}
