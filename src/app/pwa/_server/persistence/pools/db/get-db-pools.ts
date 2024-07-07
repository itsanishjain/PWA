import 'server-only'

import { db } from '../../../database/db'

interface PoolItem {
    description: string
    id: string
    image: string
    status: string
}

export async function getDbPools(): Promise<PoolItem[]> {
    const { data: poolsData, error } = await db
        .from('pools')
        .select('contract_id, description, status, bannerImage')
        .order('startDate', { ascending: true })

    if (error) {
        throw new Error(`Error fetching pools from database: ${error.message}`)
    }

    return poolsData
        .map(pool => {
            if (!pool.contract_id) {
                console.error('Pool contract_id is missing')
                return null
            }

            return {
                description: pool.description,
                id: pool.contract_id.toString(),
                image: pool.bannerImage,
                status: pool.status,
            }
        })
        .filter(Boolean) as PoolItem[]
}
