import 'server-only'

import { createServerActionProcedure } from 'zsa'
import { assertAuthenticated, AuthenticationError } from '../auth/session'
import { rateLimitByKey } from './limiter'

const GLOBAL_USER = 'unauthenticated-global'

export const authenticatedAction = createServerActionProcedure().handler(async () => {
    try {
        const user = await assertAuthenticated()
        await rateLimitByKey(`${user.id}-global`, 10, 10_000)
        return { user }
    } catch (error) {
        if (error instanceof AuthenticationError && error.message === 'Token expired, needs refresh') {
            // Redirect to a client-side refresh page
            throw new Error('NEEDS_REFRESH')
        }
        throw error
    }
})

export const unauthenticatedAction = createServerActionProcedure().handler(async () => {
    await rateLimitByKey(GLOBAL_USER, 10, 10_000)
})
