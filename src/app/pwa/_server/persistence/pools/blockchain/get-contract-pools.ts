import 'server-only'

import { poolAbi } from '@/types/contracts'
import { getPublicClient, multicall } from '@wagmi/core'
import { getAbiItem } from 'viem'
import { currentPoolAddress, serverConfig } from '../../../blockchain/server-config'

const LatestPoolId = getAbiItem({
    abi: poolAbi,
    name: 'latestPoolId',
})

const GetAllPoolInfo = getAbiItem({
    abi: poolAbi,
    name: 'getAllPoolInfo',
})

interface PoolItem {
    id: string
    name: string
    startDate: Date
    endDate: Date
    numParticipants: number
    status: string
}

const publicClient = getPublicClient(serverConfig)

export async function getContractPools() {
    const latestPoolId = await publicClient.readContract({
        address: currentPoolAddress,
        abi: [LatestPoolId],
        functionName: LatestPoolId.name,
    })

    const poolIds = Array.from({ length: Number(latestPoolId) }, (_, i) => BigInt(i + 1))

    const results = await multicall(serverConfig, {
        contracts: poolIds.map(id => ({
            address: currentPoolAddress,
            abi: [GetAllPoolInfo],
            functionName: GetAllPoolInfo.name,
            args: [id],
        })),
    })

    return results
        .map((result, index) => {
            if (result.status === 'success') {
                const [, poolDetail, , poolStatus, , participants] = result.result
                return {
                    id: poolIds[index].toString(),
                    name: poolDetail.poolName,
                    status: poolStatus,
                    timeStart: Number(poolDetail.timeStart),
                    timeEnd: Number(poolDetail.timeEnd),
                    numParticipants: participants.length,
                }
            }
            return null
        })
        .filter(pool => pool !== null)
}
