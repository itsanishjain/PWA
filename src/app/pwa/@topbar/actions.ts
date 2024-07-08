'use server'

import { getUserUseCase } from '../_server/use-cases/users/get-user'

export const getUserAvatarAction = async (): Promise<string | null> => {
    const user = await getUserUseCase()

    if (!user?.avatar) console.log('User avatar not found for user:', user?.displayName)

    return user?.avatar || null
}
