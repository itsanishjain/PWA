import 'server-only'

import type { Address } from 'viem'
import { db } from '../../../database/db'

interface UserItem {
    walletAddress: Address
}

export async function createUserInDb(userPrivyId: string, data: UserItem) {
    const { error } = await db
        .from('users')
        .insert({
            privyId: userPrivyId,
            walletAddress: data.walletAddress,
            role: 'user',
        })
        .select('*')
        .single()

    if (error) {
        throw new Error(`Error creating user in database: ${error.message}`)
    }
}
