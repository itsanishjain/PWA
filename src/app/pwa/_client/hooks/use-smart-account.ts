'use client'

import { createUserAction } from '@/app/pwa/(pages)/profile/new/actions'
import route from '@/lib/utils/routes'
import type { User } from '@privy-io/react-auth'
import { useLogin, usePrivy, useWallets, type CallbackError } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { initializeSmartAccount } from '../blockchain/initialize-smart-account'
import type { PrivyErrorCode } from './use-error-handling'
import { useErrorHandling } from './use-error-handling'

export const useSmartAccount = () => {
    const { ready } = usePrivy()
    const { login } = useLogin({
        onComplete(user, isNewUser, wasAlreadyAuthenticated, _loginMethod, _loginAccount) {
            console.log('onComplete called with:', { user, isNewUser, wasAlreadyAuthenticated })
        },
    })
    // const router = useRouter()
    // const [loading, setLoading] = useState(false)
    // const { error, handleError, resetError } = useErrorHandling()
    // const { wallets, ready } = useWallets()

    // const initializeAccount = useCallback(async () => {
    //     if (!ready || !wallets.length) return

    //     const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy')
    //     if (embeddedWallet) {
    //         try {
    //             await initializeSmartAccount(embeddedWallet)
    //         } catch (error) {
    //             if (error instanceof Error) {
    //                 handleError('Failed to initialize smart account', error)
    //             } else {
    //                 throw error
    //             }
    //         }
    //     } else {
    //         // TODO: it can be the user just connected with EOA, handle that.
    //         handleError('Initialization error', new Error('Embedded wallet not found'))
    //     }
    // }, [ready, wallets, handleError])

    // const handleUserAuthentication = async (user: User, isNewUser: boolean, wasAlreadyAuthenticated: boolean) => {
    //     console.log('handleUserAuthentication called with:', { user, isNewUser, wasAlreadyAuthenticated })

    //     if (!user.wallet) {
    //         throw new Error('Wallet not found')
    //     }

    //     setLoading(true)
    //     resetError()

    //     try {
    //         if (wasAlreadyAuthenticated) {
    //             // User was already authenticated, no action needed
    //             return
    //         }

    //         if (isNewUser) {
    //             // New user: initialize smart account, create in DB, redirect to profile/new
    //             await initializeAccount()
    //             await createUserAction()
    //             router.push(route['/profile/new'])
    //             // } else {
    //             // Existing user: check DB and redirect accordingly
    //             // const existingUser = await getUserUseCase(user.id)
    //             // if (!existingUser) {
    //             // User not in DB: create and redirect to profile/new
    //             // await createOrUpdateUser(user.id, user.wallet.address)
    //             // router.push('/profile/new' as Route)
    //             // } else if (!existingUser.displayName || !existingUser.avatar) {
    //             // User in DB but missing info: redirect to profile/new
    //             // router.push('/profile/new' as Route)
    //             // }
    //         }
    //     } catch (error: unknown) {
    //         handleError('Authentication error', error as Error)
    //     } finally {
    //         setLoading(false)
    //     }
    // }

    // const { login } = useLogin({
    //     async onComplete(user, isNewUser, wasAlreadyAuthenticated, _loginMethod, _loginAccount) {
    //         await handleUserAuthentication(user, isNewUser, wasAlreadyAuthenticated)
    //     },

    //     onError: ((errorCode: PrivyErrorCode) => {
    //         handleError('Login error', errorCode)
    //     }) as CallbackError,
    // })

    return { login, loading: !ready, error: null }
}
