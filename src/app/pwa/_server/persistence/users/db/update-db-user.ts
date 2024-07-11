import 'server-only'

import { db } from '../../../database/db'
import { uploadAvatarToStorage } from '../storage/upload-avatar'

interface UserItem {
    avatar?: File
    displayName?: string
}

export async function updateUserInDb(userPrivyId: string, data: UserItem) {
    let avatarUrl: string | undefined

    if (data.avatar) {
        avatarUrl = await uploadAvatarToStorage(userPrivyId, data.avatar)
    }

    const { error } = await db
        .from('users')
        .update({
            avatar: avatarUrl,
            displayName: data.displayName,
            privyId: userPrivyId,
        })
        .eq('privyId', userPrivyId)

    if (error) {
        throw new Error(`Error updating user in database: ${error.message}`)
    }
}
