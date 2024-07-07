import 'server-only'
import { db } from '../../../database/db'

export async function uploadAvatarToStorage(userId: string, avatarBuffer: Buffer): Promise<string> {
    const fileName = `${userId}/avatar.png`

    const { error } = await db.storage.from('images').upload(fileName, avatarBuffer, {
        contentType: 'image/png',
        upsert: true, // overwrite existing file with same name
    })

    if (error) {
        throw new Error(`Error uploading avatar: ${error.message}`)
    }

    const { data: urlData } = db.storage.from('images').getPublicUrl(`${userId}/avatar.png`)

    return urlData.publicUrl
}
