import 'server-only'

import { getDbUser } from '../../persistence/users/db/get-db-user'
import { updateUserInDb } from '../../persistence/users/db/update-db-user'

interface UserItem {
    avatar?: string
    displayName?: string
}

export const updateProfileUseCase = async (userId: string, info: UserItem) => {
    const profile = await getDbUser(userId)

    if (!profile) {
        throw new Error('Profile not found')
    }

    await updateUserInDb(userId, info)
}
