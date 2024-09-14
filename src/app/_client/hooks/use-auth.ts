'use client'

import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useDisconnect } from 'wagmi'

export function useAuth() {
    const router = useRouter()
    const { disconnect } = useDisconnect({
        mutation: {
            onSuccess: () => {
                console.log('[use-auth] disconnect success')
                router.replace('/' as Route)
            },
        },
    })
    const { logout } = useLogout({
        onSuccess: () => {
            console.log('[use-auth] logout success')

            disconnect()
        },
    })
    const { login } = useLogin({
        onComplete(user, isNewUser, wasAlreadyAuthenticated, loginMethod, loginAccount) {
            console.log('[use-auth] auth complete')

            if (isNewUser) {
                console.log('[use-auth] new user', { loginMethod, loginAccount })
                router.replace('/profile/new' as Route)
            }

            if (wasAlreadyAuthenticated) {
                console.log('[use-auth] already authenticated')
                return
            }

            router.refresh()
            console.log('[use-auth] user', user)
        },
        onError(error) {
            if (error === 'exited_auth_flow') {
                console.log('[use-auth] exited auth flow')
                return
            }
            console.error('[use-auth] error', error)
            toast.error('An error occurred while logging in. Please try again.', {
                richColors: true,
            })
            router.refresh()
        },
    })

    const { ready, authenticated } = usePrivy()

    return { login, logout, authenticated: ready && authenticated, ready }
}
