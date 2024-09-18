'use client'

import { usePrivy } from '@privy-io/react-auth'
import { ReactNode } from 'react'

interface AuthenticatedGuardProps {
    children: ReactNode
    fallback?: ReactNode
    loading?: ReactNode
}

export function AuthenticatedGuard({ children, fallback = null, loading = 'Loading...' }: AuthenticatedGuardProps) {
    const { authenticated, ready } = usePrivy()

    if (!ready) {
        return loading
    }

    if (!authenticated) {
        return fallback
    }

    return <>{children}</>
}
