import 'server-only'

import { dropletAddress } from '@/types/contracts'
import { getBalance } from '@wagmi/core'
import { base, baseSepolia } from '@wagmi/core/chains'
import type { Address } from 'viem'
import { serverConfig } from '../../../blockchain/server-config'
import { inProduction } from '@/app/pwa/_lib/utils/environment.mjs'

export async function getAddressBalance(
    address: string,
): Promise<{ balance: bigint; symbol: string; decimals: number } | null> {
    try {
        const chain = inProduction ? base : baseSepolia
        const result = await getBalance(serverConfig, {
            address: address as Address,
            token: dropletAddress[chain.id],
            chainId: chain.id,
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
