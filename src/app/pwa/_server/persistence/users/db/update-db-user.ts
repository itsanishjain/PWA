import 'server-only'

import { processImage, processImage2 } from '@/app/pwa/_server/lib/utils/process-image'
import { db } from '../../../database/db'
import { uploadAvatarToStorage } from '../storage/upload-avatar'

interface UserItem {
    avatar?: string
    displayName?: string
}

export async function updateUserInDb(userPrivyId: string, data: UserItem) {
    let avatarUrl: string | undefined

    if (data.avatar) {
        const processedBuffer = await processImage2(data.avatar)

        avatarUrl = await uploadAvatarToStorage(userPrivyId, processedBuffer.buffer)
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
