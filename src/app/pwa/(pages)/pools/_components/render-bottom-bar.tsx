'use client'

import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { Button } from '@/app/pwa/_components/ui/button'
import route from '@/lib/utils/routes'
import { Route } from 'next'
import Link from 'next/link'
import { useEffect } from 'react'

export default function RenderBottomBar({ isAdmin = false }: { isAdmin?: boolean | null }) {
    const setBottomBar = useSettingsStore(state => state.setBottomBarContent)

    useEffect(() => {
        if (isAdmin) {
            setBottomBar(
                <Button
                    asChild
                    className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                    <Link href={'/pool/new' as Route}>Create Pool</Link>
                </Button>,
            )
        }
        return () => {
            setBottomBar(null)
        }
    }, [isAdmin, setBottomBar])

    return null
}
