'use server'

import { getUserUseCase } from '../_server/use-cases/users/get-user'

export const getUserAvatarAction = async (): Promise<string | null> => {
    const user = await getUserUseCase()

    return user?.avatar || null
}
