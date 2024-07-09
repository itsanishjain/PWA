'use client'

import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'

export default function AuthenticatedContent({
    renderBottomBar,
}: {
    isAdmin: boolean | null
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

    return <>{renderBottomBar}</>
}
