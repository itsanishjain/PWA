'use server'

import type { Address } from 'viem'
import { getWalletAddress, isAdmin } from './privy'

export async function getAuthStatus(): Promise<{
    isAuthenticated: boolean
    isAdmin: boolean
    address: Address | null
}> {
    try {
        const walletAddress = await getWalletAddress()

        if (!walletAddress) {
            return { isAuthenticated: false, isAdmin: false, address: null }
        }

        const adminStatus = await isAdmin(walletAddress)

        return {
            isAuthenticated: true,
            isAdmin: adminStatus,
            address: walletAddress,
        }
    } catch (error) {
        console.error('Error getting auth status:', error)
        return { isAuthenticated: false, isAdmin: false, address: null }
    }
}
