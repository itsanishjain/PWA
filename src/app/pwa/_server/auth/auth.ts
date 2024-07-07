import 'server-only'

import type { User } from '@privy-io/server-auth'
import type { Address } from 'viem'
import { getPrivyUser, getWalletAddress, isAdmin } from './privy'

interface Session {
    id: string
    address: Address | null
    isAdmin: boolean
}

export const validateRequest = async (): Promise<{
    user: User | null
    session: Session | null
    needsRefresh: boolean
}> => {
    const privyUser = await getPrivyUser()

    if (!privyUser) {
        return {
            user: null,
            session: null,
            needsRefresh: true,
        }
    }

    const id = privyUser.id
    const address = await getWalletAddress()
    const adminStatus = address ? await isAdmin(address) : false

    return {
        user: privyUser,
        session: {
            id,
            address,
            isAdmin: adminStatus,
        },
        needsRefresh: false,
    }
}
