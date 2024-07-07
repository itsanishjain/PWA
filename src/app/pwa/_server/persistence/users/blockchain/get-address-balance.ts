import 'server-only'

import { dropletAddress } from '@/types/contracts'
import { getBalance } from '@wagmi/core'
import { baseSepolia } from '@wagmi/core/chains'
import type { Address } from 'viem'
import { serverConfig } from '../../../blockchain/server-config'

export async function getAddressBalance(
    address: string,
): Promise<{ balance: bigint; symbol: string; decimals: number } | null> {
    try {
        const result = await getBalance(serverConfig, {
            address: address as Address,
            token: dropletAddress[baseSepolia.id],
            chainId: baseSepolia.id,
        })

        return {
            balance: result.value,
            symbol: result.symbol,
            decimals: result.decimals,
        }
    } catch (error) {
        console.error('Error fetching address balance and token info:', error)
        return null
    }
}
