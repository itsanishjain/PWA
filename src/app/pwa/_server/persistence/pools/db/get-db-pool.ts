import 'server-only'
import { db } from '../../../database/db'

export interface PoolItem {
    description: string
    image: string
    softCap: number
    terms: string
}

export async function getDbPool(poolId: string): Promise<PoolItem | null> {
    const { data: poolData, error } = await db
        .from('pools')
        .select('termsURL, description, softCap, bannerImage')
        .eq('contract_id', poolId)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            return null // Pool not found
        }
        throw new Error(`Error fetching pool from database: ${error.message}`)
    }

    return {
        description: poolData.description,
        image: poolData.bannerImage,
        softCap: poolData.softCap,
        terms: poolData.termsURL,
    }
}
