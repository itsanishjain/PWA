import 'server-only'

import type { Tables } from '@/types/db'
import { cache } from 'react'
import { getPrivyUser } from '../../auth/privy'
import { getDbUser } from '../../persistence/users/db/get-db-user'

type UserItem = Pick<Tables<'users'>, 'avatar' | 'displayName'>

export const getUserUseCase = cache(async (privyId?: string): Promise<UserItem | null> => {
    let id: string | undefined = privyId

    if (!id) {
        const privyUser = await getPrivyUser()
        id = privyUser?.id
    }

    if (!id) {
        return null
    }

    const user = await getDbUser(id)

    if (!user) {
        return null
    }

    return {
        avatar: user.avatar,
        displayName: user.displayName,
    }
})
