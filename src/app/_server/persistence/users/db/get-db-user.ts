import 'server-only'

import type { Tables } from '@/types/db'
import type { PostgrestSingleResponse } from '@supabase/supabase-js'
import { db } from '../../../database/db'

type UserRow = Pick<Tables<'users'>, 'avatar' | 'displayName'>

export async function getDbUser(privyId: string): Promise<UserRow | undefined> {
    const { data: userData, error }: PostgrestSingleResponse<UserRow> = await db
        .from('users')
        .select('avatar, displayName')
        .eq('privyId', privyId)
        .single()

    if (error) {
        if (error.code === 'PGRST116') {
            return // Pool not found
        }
        throw new Error(`Error fetching user from database: ${error.message}`)
    }

    return {
        avatar: userData.avatar,
        displayName: userData.displayName,
    }
}
