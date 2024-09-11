import 'server-only'

import { poolAbi, poolAddress } from '@/types/contracts'
import { getPublicClient } from '@wagmi/core'
import type { Address } from 'viem'
import { currentPoolAddress, serverClient, serverConfig } from '../../../blockchain/server-config'
import { adminRole } from '@/app/pwa/_lib/blockchain/constants'
import { HasRoleFunction } from '@/app/pwa/_lib/blockchain/functions/pool/has-role'

export const fetchClaimablePools = async ({ queryKey }: { queryKey: [string, string, number] }) => {
    const [_, address] = queryKey
    const publicClient = getPublicClient(serverConfig)

    const claimablePools = await publicClient?.readContract({
        abi: poolAbi,
        functionName: 'getClaimablePools',
        address: poolAddress[publicClient.chain.id as ChainId],
        args: [address as Address],
    })

    return claimablePools
}

export const ROLES = {
    ADMIN: adminRole(),
    SPONSOR: adminRole(),
}

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const hasRole = async ({ role, account }: { role: Role; account: string }): Promise<boolean> => {
    return serverClient.readContract({
        address: currentPoolAddress,
        abi: [HasRoleFunction],
        functionName: HasRoleFunction.name,
        args: [role, account as Address],
    })
}
