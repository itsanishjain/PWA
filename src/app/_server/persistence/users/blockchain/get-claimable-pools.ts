import 'server-only'

import { poolAbi, poolAddress } from '@/types/contracts'
import { getPublicClient } from '@wagmi/core'
import type { Address } from 'viem'
import { serverConfig } from '../../../blockchain/server-config'

export const fetchClaimablePools = async ({ queryKey }: { queryKey: [string, string, number] }) => {
    const [_, address] = queryKey
    const publicClient = getPublicClient(serverConfig)

    const claimablePools = await publicClient?.readContract({
        abi: poolAbi,
        functionName: 'getClaimablePools',
        address: poolAddress[publicClient.chain.id as ChainId],
        args: [address as Address],
    })

    return claimablePools
}
