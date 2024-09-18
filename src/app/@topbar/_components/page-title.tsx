'use client'

import { useAppStore } from '@/app/_client/providers/app-store.provider'
import PoolTopLogo from '@/app/_components/icons/pool-top-logo'
import Link from 'next/link'

export default function PageTitle() {
    const title = useAppStore(s => s.topBarTitle)

    return (
        <Link href='/'>
            <h1 className='text-[0.875rem] font-semibold'>
                {title ?? (
                    <div className='h-8 w-24'>
                        <PoolTopLogo />
                    </div>
                )}
            </h1>
        </Link>
    )
}

// TODO: fix SSR issue: title not getting set

// Alternative with text instead of svg/png:
// <h1 className='text-center text-[42px] font-bold text-shadow-inner font-logo bg-clip-text text-transparent bg-text-inner'>
// 	pool
// </h1>
