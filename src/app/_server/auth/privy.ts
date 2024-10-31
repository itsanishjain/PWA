import 'server-only'

import { cookies } from 'next/headers'
import { PrivyClient } from '@privy-io/server-auth'

import type { User } from '@privy-io/server-auth'
import { Address } from 'viem'

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const privyAppSecret = process.env.PRIVY_APP_SECRET

if (!privyAppId || !privyAppSecret) {
    throw new Error('Missing Privy app ID or app secret')
}

export const privy = new PrivyClient(privyAppId, privyAppSecret)

export const getPrivyVerificationKey = async () => {
    return process.env.PRIVY_VERIFICATION_KEY || (await privy.getVerificationKey())
}

export const verifyToken = async (): Promise<User | undefined> => {
    const accessToken = cookies().get('privy-token')?.value
    if (!accessToken) return undefined

    const privyVerificationKey = await getPrivyVerificationKey()
    if (!privyVerificationKey) return undefined

    try {
        const verifiedClaims = await privy.verifyAuthToken(accessToken, privyVerificationKey)
        if (!verifiedClaims?.userId) return undefined

        const user = await privy.getUser({ idToken: accessToken })
        return user
    } catch {
        return undefined
    }
}

export const getUserWalletAddress = async (): Promise<Address | undefined> => {
    const user = await verifyToken()
    return user?.wallet?.address as Address | undefined
}
