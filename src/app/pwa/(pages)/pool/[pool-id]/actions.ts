'use server'

import { validateRequest } from '@/app/pwa/_server/auth/auth'
import { unauthenticatedAction } from '@/app/pwa/_server/lib/safe-action'
import { getPoolDetailsUseCase } from '@/app/pwa/_server/use-cases/pools/get-pool-details'
import { z } from 'zod'
import { PoolDetailsDTOSchema, validatePoolDetailsDTO } from './_lib/definitions'

// TODO: handle special statuses: Paused, Deposit disabled, Deposit re-enabled, Ended, Cancelled, Deleted...
export const getPoolDetailsAction = unauthenticatedAction
    .createServerAction()
    .input(
        z.object({
            poolId: z.string(),
        }),
    )
    .output(
        z.object({
            pool: PoolDetailsDTOSchema.optional(),
            needsRefresh: z.boolean().optional(),
        }),
    )
    .handler(async ({ input }) => {
        const { session, needsRefresh } = await validateRequest()

        if (needsRefresh) {
            return { needsRefresh: true }
        }

        if (!session || !session.address) {
            console.log('anonymous user requested pool details')
        }

        const poolDetails = validatePoolDetailsDTO(
            await getPoolDetailsUseCase(input.poolId, session?.address || undefined),
        )

        return { pool: poolDetails }
    })
