'use server'

import { getUserUseCase } from '../_server/use-cases/users/get-user'

export const getUserAvatarAction = async (): Promise<string | null> => {
    const user = await getUserUseCase()
    if (!user) {
        return null
    }

    console.log('[getUserAvatarAction] user:', user.displayName)

    console.log('[getUserAvatarAction] avatar found?', Boolean(user.avatar))

    return user?.avatar || null
}
