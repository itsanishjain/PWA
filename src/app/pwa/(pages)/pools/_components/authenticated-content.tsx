'use client'

import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import PoolSkeleton from './pools-skeleton'

export default function AuthenticatedContent({
    nextUserPool,
    renderBottomBar,
}: {
    isAdmin: boolean | null
    nextUserPool: React.ReactNode
    renderBottomBar: React.ReactNode
}) {
    const { ready, authenticated } = usePrivy()
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (ready) {
            setIsConnected(authenticated)
        }
    }, [ready, authenticated])

    if (!ready) return <PoolSkeleton title='Your Pools' length={1} />

    if (ready && !isConnected) {
        return (
            <div className='flex-center h-80 flex-col animate-in'>
                <h1 className='mb-4 text-lg font-semibold'>Not connected</h1>
                <p className='text-sm'>Please connect your wallet to continue</p>
            </div>
        )
    }

    return (
        <>
            {nextUserPool}
            {renderBottomBar}
        </>
    )
}
