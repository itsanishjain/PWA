import 'server-only'

import { cache } from 'react'
import { getContractPools } from '../../persistence/pools/blockchain/get-contract-pools'
import { getDbPools } from '../../persistence/pools/db/get-db-pools'

interface PoolItem {
    id: string
    name: string
    startDate: Date
    endDate: Date
    numParticipants: number
    status: string
    image: string
    softCap: number
}

export const getAllPoolsUseCase = cache(async (): Promise<PoolItem[]> => {
    const [dbPools, contractPools] = await Promise.all([getDbPools(), getContractPools()])

    const allPools = dbPools.map(dbPool => {
        const contractPool = contractPools.find(cp => cp.id === dbPool.id)

        if (!contractPool) {
            throw new Error(`Pool ${dbPool.id} not found in contract data`)
        }

        const pool: PoolItem = {
            ...dbPool,
            ...contractPool,
        }

        return pool
    })

    return allPools
})
