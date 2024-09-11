import 'server-only'

import { dropletAddress } from '@/types/contracts'
import { getBalance } from '@wagmi/core'
import { baseSepolia } from '@wagmi/core/chains'
import type { Address } from 'viem'
import { serverConfig } from '../../../blockchain/server-config'
import { TokenBalance } from '@/app/pwa/_lib/entities/models/token-balance'

export async function getAddressBalance(address: string): Promise<TokenBalance | undefined> {
    try {
        const result = await getBalance(serverConfig, {
            address: address as Address,
            token: dropletAddress[baseSepolia.id],
            chainId: baseSepolia.id,
        })

        return {
            value: result.value,
            symbol: result.symbol,
            decimals: result.decimals,
            formatted: result.formatted,
        }
    } catch (error) {
        console.error('Error fetching address balance and token info:', error)
        return
    }
}
