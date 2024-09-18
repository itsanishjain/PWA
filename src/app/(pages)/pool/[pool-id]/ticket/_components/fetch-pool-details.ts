import { getConfig } from '@/app/_client/providers/configs/wagmi.config'
import { currentPoolAddress } from '@/app/_server/blockchain/server-config'
import { poolAbi } from '@/types/contracts'
import { getPublicClient } from '@wagmi/core'

export const fetchPoolDetails = async ({ queryKey }: { queryKey: [string, bigint, number] }) => {
    const publicClient = getPublicClient(getConfig())
    const [_, poolId] = queryKey
    const poolDetailFromSC = await publicClient?.readContract({
        abi: poolAbi,
        address: currentPoolAddress,
        functionName: 'getAllPoolInfo',
        args: [poolId],
    })

    return { poolDetailFromSC }
}
