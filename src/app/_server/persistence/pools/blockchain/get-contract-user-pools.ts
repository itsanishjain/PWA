// import 'server-only'

import { poolAbi } from '@/types/contracts'
import { multicall } from '@wagmi/core'
import { getAbiItem } from 'viem'
import type { Address } from 'viem'
import { currentPoolAddress, serverConfig } from '../../../blockchain/server-config'

const GetPoolsCreatedBy = getAbiItem({
    abi: poolAbi,
    name: 'getPoolsCreatedBy',
})

const GetPoolsJoinedBy = getAbiItem({
    abi: poolAbi,
    name: 'getPoolsJoinedBy',
})

const GetAllPoolInfo = getAbiItem({
    abi: poolAbi,
    name: 'getAllPoolInfo',
})

export async function getUserPools(userAddress: Address) {
    const [createdPoolsResult, joinedPoolsResult] = await multicall(serverConfig, {
        contracts: [
            {
                address: currentPoolAddress,
                abi: [GetPoolsCreatedBy],
                functionName: GetPoolsCreatedBy.name,
                args: [userAddress],
            },
            {
                address: currentPoolAddress,
                abi: [GetPoolsJoinedBy],
                functionName: GetPoolsJoinedBy.name,
                args: [userAddress],
            },
        ],
    })

    if (createdPoolsResult.status !== 'success' || joinedPoolsResult.status !== 'success') {
        console.error('Failed to fetch user pools')
        return []
    }

    const createdPools = createdPoolsResult.result
    const joinedPools = joinedPoolsResult.result
    const allUserPools = [...new Set([...createdPools, ...joinedPools])]

    const poolDetailsResults = await multicall(serverConfig, {
        contracts: allUserPools.map(poolId => ({
            address: currentPoolAddress,
            abi: [GetAllPoolInfo],
            functionName: GetAllPoolInfo.name,
            args: [poolId],
        })),
    })

    return poolDetailsResults
        .map((result, index) => {
            if (result.status === 'success') {
                const [, poolDetail, , poolStatus, , participants] = result.result
                return {
                    id: allUserPools[index].toString(),
                    name: poolDetail.poolName,
                    status: poolStatus,
                    timeStart: Number(poolDetail.timeStart),
                    timeEnd: Number(poolDetail.timeEnd),
                    numParticipants: participants.length,
                }
            }
            return null
        })
        .filter(Boolean)
}
