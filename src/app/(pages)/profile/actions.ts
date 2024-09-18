'use server'

import { getUserUseCase } from '../../_server/use-cases/users/get-user'
import { authenticatedProcedure } from '../../_server/procedures/authenticated'
import { getTokenBalanceAction } from '../pools/actions'

export const getUserInfoAction = authenticatedProcedure.createServerAction().handler(async ({ ctx: { user } }) => {
    return getUserUseCase(user.id)
})

export async function getProfilePageAction() {
    const [balance] = await Promise.all([
        // getUpcomingPoolsAction(),
        // getAdminStatusAction(),
        getUserInfoAction(),
        getTokenBalanceAction(),
    ])

    return { balance }
}
