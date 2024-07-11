'use client'

import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import PoolTopLogo from '@/app/pwa/_components/icons/pool-top-logo'
import { Route } from 'next'
import Link from 'next/link'

export default function PageTitle() {
    const topBarTitle = useSettingsStore(state => state.topBarTitle)

    return
    ;<Link href={'/' as Route}>
        <h1 className='text-[0.875rem] font-semibold'>{topBarTitle ? topBarTitle : <PoolTopLogo />}</h1>
    </Link>
    // Alternative with text instead of svg/png:
    // <h1 className='text-center text-[42px] font-bold text-shadow-inner font-logo bg-clip-text text-transparent bg-text-inner'>
    // 	pool
    // </h1>
}
