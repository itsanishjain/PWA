import { getConfig } from '@/app/_client/providers/configs/wagmi.config'
import { poolAbi, poolAddress } from '@/types/contracts'
import { getPublicClient } from '@wagmi/core'
import { Address } from 'viem'

export const fetchClaimablePools = async ({ queryKey }: { queryKey: [string, string, number] }) => {
    const [_, address] = queryKey
    const publicClient = getPublicClient(getConfig())

    const claimablePools = await publicClient?.readContract({
        abi: poolAbi,
        functionName: 'getClaimablePools',
        address: poolAddress[publicClient.chain.id as ChainId],
        args: [address as Address],
    })

    return claimablePools
}
