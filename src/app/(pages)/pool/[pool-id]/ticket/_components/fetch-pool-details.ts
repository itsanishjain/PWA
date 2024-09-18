import { getConfig } from '@/app/_client/providers/configs/wagmi.config'
import { poolAbi, poolAddress } from '@/types/contracts'
import { getPublicClient } from '@wagmi/core'

export const fetchPoolDetails = async ({ queryKey }: { queryKey: [string, bigint, number] }) => {
    const publicClient = getPublicClient(getConfig())
    const [_, poolId] = queryKey
    const poolDetailFromSC = await publicClient?.readContract({
        abi: poolAbi,
        functionName: 'getAllPoolInfo',
        address: poolAddress[publicClient.chain.id as ChainId],
        args: [poolId],
    })

    return { poolDetailFromSC }
}
