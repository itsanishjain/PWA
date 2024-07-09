import 'server-only'

import { processImage } from '@/app/pwa/_server/lib/utils/process-image'
import { db } from '../../../database/db'
import { uploadAvatarToStorage } from '../storage/upload-avatar'

interface UserItem {
    avatar?: string | null
    displayName?: string
}

export async function updateUserInDb(userPrivyId: string, data: UserItem) {
    let avatarUrl: string | undefined

    if (data.avatar) {
        const processedBuffer = await processImage(data.avatar)
        avatarUrl = await uploadAvatarToStorage(userPrivyId, processedBuffer)
    }

    const updateData = Object.fromEntries(
        Object.entries({
            displayName: data.displayName,
            avatar: avatarUrl,
        }).filter(([_, value]) => value !== undefined),
    )

    const { error } = await db
        .from('users')
        .update({
            ...updateData,
            privyId: userPrivyId,
        })
        .eq('privyId', userPrivyId)

    if (error) {
        throw new Error(`Error updating user in database: ${error.message}`)
    }
}
