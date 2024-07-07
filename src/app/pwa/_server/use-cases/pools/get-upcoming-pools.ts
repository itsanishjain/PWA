import 'server-only'
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
}

export async function getAllPoolsUseCase(): Promise<PoolItem[]> {
    const [dbPools, contractPools] = await Promise.all([getDbPools(), getContractPools()])

    const allPools = dbPools.map(dbPool => {
        const contractPool = contractPools.find(cp => cp.id === dbPool.id)

        if (!contractPool) {
            throw new Error(`Pool ${dbPool.id} not found in contract data`)
        }

        return {
            id: contractPool.id.toString(),
            name: contractPool.name,
            startDate: contractPool.startDate,
            endDate: contractPool.endDate,
            numParticipants: contractPool.numParticipants,
            status: contractPool.status,
            image: dbPool.image,
        }
    })

    const now = new Date()
    return allPools.filter(pool => new Date(pool.startDate) > now)
}
