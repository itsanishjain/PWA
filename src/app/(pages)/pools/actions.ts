'use server'

import { Address } from 'viem'
import { authenticatedProcedure } from '../../_server/procedures/authenticated'
import { getAllPoolsUseCase } from '../../_server/use-cases/pools/get-all-pools'
import { getUserNextPoolUseCase } from '../../_server/use-cases/pools/get-user-next-pool'
import { unauthenticatedProcedure } from '../../_server/procedures/unauthenticated'
import { getAddressBalanceUseCase } from '../../_server/use-cases/users/get-user-balance'
import { isAdminUseCase } from '../../_server/use-cases/users/is-admin'
import { PoolItem } from '../../_lib/entities/models/pool-item'

export const getUpcomingPoolsAction = unauthenticatedProcedure
    .createServerAction()
    .handler(async (): Promise<PoolItem[]> => {
        return getAllPoolsUseCase()
    })

export const getUserNextPoolAction = authenticatedProcedure
    .createServerAction()
    .handler(async ({ ctx: { user } }): Promise<PoolItem | undefined> => {
        const address = user.wallet?.address as Address
        if (!address) return
        return getUserNextPoolUseCase(address)
    })

export const getTokenBalanceAction = authenticatedProcedure.createServerAction().handler(async ({ ctx: { user } }) => {
    const address = user.wallet?.address as Address
    return getAddressBalanceUseCase(address)
})

export const getAdminStatusAction = authenticatedProcedure.createServerAction().handler(async ({ ctx: { user } }) => {
    const address = user.wallet?.address as Address
    return isAdminUseCase(address)
})

export const getUserAddressAction = authenticatedProcedure.createServerAction().handler(async ({ ctx: { user } }) => {
    return user.wallet?.address as Address
})

export async function getPoolsPageAction() {
    const [[nextPool], [upcomingPools], [balance], [isAdmin]] = await Promise.all([
        getUserNextPoolAction(),
        getUpcomingPoolsAction(),
        getTokenBalanceAction(),
        getAdminStatusAction(),
    ])

    return { nextPool, balance, pools: upcomingPools, isAdmin }
}
