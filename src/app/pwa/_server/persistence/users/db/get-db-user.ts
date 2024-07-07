import 'server-only'

import type { Tables } from '@/types/db'
import { db } from '../../../database/db'

type UserItem = Pick<Tables<'users'>, 'avatar' | 'displayName'>

export async function getDbUser(privyId: string): Promise<UserItem | null> {
    const { data: userData, error } = await db
        .from('users')
        .select('avatar, displayName')
        .eq('privyId', privyId)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            return null // Pool not found
        }
        throw new Error(`Error fetching user from database: ${error.message}`)
    }

    return {
        avatar: userData.avatar,
        displayName: userData.displayName,
    }
}
