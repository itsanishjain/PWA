'use client'

import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'

export default function AuthenticatedContent({
    balanceInfo,
    nextUserPool,
    renderBottomBar,
}: {
    isAdmin: boolean | null
    balanceInfo: React.ReactNode
    nextUserPool: React.ReactNode
    renderBottomBar: React.ReactNode
}) {
    const { authenticated } = usePrivy()
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        setIsConnected(authenticated)
    }, [authenticated])

    if (!isConnected) return null

    return (
        <>
            {balanceInfo}
            {nextUserPool}
            {renderBottomBar}
        </>
    )
}
