import 'server-only'

import { cache } from 'react'
import { ROLES, hasRole } from '../../persistence/users/blockchain/has-role'

export const isAdminUseCase = cache(async (address?: string): Promise<boolean> => {
    if (!address) return false

    return hasRole({
        role: ROLES.ADMIN,
        account: address,
    })
})
