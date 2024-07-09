'use client'

import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { getUserInfoAction } from '../../profile/actions'

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
    const { ready, authenticated } = usePrivy()
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        if (ready) {
            setIsConnected(authenticated)
        }
    }, [ready, authenticated])

    if (!isConnected) return null

    return (
        <>
            {balanceInfo}
            {nextUserPool}
            {renderBottomBar}
        </>
    )
}
