import 'server-only'

import type { Address } from 'viem'
import { createUserInDb } from '../../persistence/users/db/create-db-user'

interface UserItem {
    walletAddress: Address
}

export async function createUserUseCase(userId: string, info: UserItem) {
    await createUserInDb(userId, info)
}
