'use server'

import { getPoolDetailsUseCase } from '@/app/_server/use-cases/pools/get-pool-details'
import { z } from 'zod'
import { PoolDetailsDTOSchema, validatePoolDetailsDTO } from './_lib/definitions'
import { unauthenticatedProcedure } from '@/app/_server/procedures/unauthenticated'
import { verifyToken } from '@/app/_server/auth/privy'

// TODO: handle special statuses: Paused, Deposit disabled, Deposit re-enabled, Ended, Cancelled, Deleted...
export const getPoolDetailsAction = unauthenticatedProcedure
    .createServerAction()
    .input(
        z.object({
            poolId: z.string(),
        }),
    )
    .output(
        z.object({
            pool: PoolDetailsDTOSchema.optional(),
        }),
    )
    .handler(async ({ input }) => {
        const user = await verifyToken()

        const poolDetails = validatePoolDetailsDTO(
            await getPoolDetailsUseCase(input.poolId, user?.wallet?.address || undefined),
        )

        return { pool: poolDetails }
    })
