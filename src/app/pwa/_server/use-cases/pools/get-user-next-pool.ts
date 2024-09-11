// src/use-cases/pools/get-user-next-pool.ts

import { cache } from 'react'
import 'server-only'
import type { Address } from 'viem'
import { getUserPools } from '../../persistence/pools/blockchain/get-contract-user-pools'
import { getDbPools } from '../../persistence/pools/db/get-db-pools'

interface PoolItem {
    id: string
    name: string
    image: string
    startDate: Date
    endDate: Date
    status: string
    numParticipants: number
    softCap: number
}

const statusMap: Record<number, string> = {
    0: 'INACTIVE',
    1: 'DEPOSIT_ENABLED',
    2: 'STARTED',
    3: 'ENDED',
    4: 'DELETED',
}

export const getUserNextPoolUseCase = cache(async (userAddress: Address): Promise<PoolItem | undefined> => {
    const [userPools, dbPools] = await Promise.all([getUserPools(userAddress), getDbPools()])

    const now = Date.now() / 1000 // current timestamp in seconds

    const validPools = userPools
        .filter(
            (pool): pool is NonNullable<typeof pool> =>
                pool !== null &&
                pool !== undefined &&
                typeof pool.timeStart === 'number' &&
                typeof pool.timeEnd === 'number' &&
                (pool.timeStart > now || pool.timeEnd > now),
        )
        .map(pool => {
            const dbPool = dbPools.find(dp => dp.id === pool.id)
            return {
                id: pool.id,
                name: pool.name,
                image: dbPool?.image ?? '',
                startDate: new Date(pool.timeStart * 1000),
                endDate: new Date(pool.timeEnd * 1000),
                status: statusMap[pool.status] || 'UNKNOWN',
                numParticipants: pool.numParticipants,
                softCap: dbPool?.softCap ?? 0,
            }
        })

    const sortedPools = validPools.sort((a, b) => {
        const aStart = a.startDate.getTime() / 1000
        const bStart = b.startDate.getTime() / 1000
        const aEnd = a.endDate.getTime() / 1000
        const bEnd = b.endDate.getTime() / 1000

        if (aStart > now && bStart > now) {
            return aStart - bStart // Sort by closest start time for upcoming pools
        } else if (aEnd > now && bEnd > now) {
            return aEnd - bEnd // Sort by closest end time for active pools
        } else {
            return aStart > now ? -1 : 1 // Prioritize upcoming pools over active ones
        }
    })

    if (sortedPools.length > 0) {
        return sortedPools[0]
    }
})
