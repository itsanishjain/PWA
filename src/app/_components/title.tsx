'use client'

import { useEffect } from 'react'
import { useAppStore } from '../_client/providers/app-store.provider'

interface Title {
    title?: string | null
}

export default function Title({ title = null }: Title) {
    const setTopBarTitle = useAppStore(state => state.setTopBarTitle)

    useEffect(() => {
        setTopBarTitle(title)
        return () => {
            setTopBarTitle(null)
        }
    }, [setTopBarTitle, title])

    return null
}
