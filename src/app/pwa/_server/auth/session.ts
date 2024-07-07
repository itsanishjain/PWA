import 'server-only'

import { cache } from 'react'
import { validateRequest } from './auth'

export class AuthenticationError extends Error {
    constructor(message: string = 'Authentication failed') {
        super(message)
        this.name = 'AuthenticationError'
    }
}

export const getCurrentUser = cache(async () => {
    const { user, needsRefresh } = await validateRequest()
    if (needsRefresh) {
        throw new AuthenticationError('Token expired, needs refresh')
    }
    if (!user) {
        return undefined
    }
    return user
})

export const assertAuthenticated = async () => {
    const user = await getCurrentUser()
    if (!user) {
        throw new AuthenticationError()
    }
    return user
}
