import 'server-only'

import { getBalance } from '@wagmi/core'
import { baseSepolia } from '@wagmi/core/chains'
import type { Address } from 'viem'
import { currentPoolAddress, serverConfig } from '../../../blockchain/server-config'
import { TokenBalance } from '@/app/_lib/entities/models/token-balance'

export async function getAddressBalance(address: string): Promise<TokenBalance | undefined> {
    try {
        const result = await getBalance(serverConfig, {
            address: address as Address,
            token: currentPoolAddress,
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
