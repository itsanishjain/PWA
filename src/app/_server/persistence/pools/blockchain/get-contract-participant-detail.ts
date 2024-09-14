import 'server-only'

import { poolAbi } from '@/types/contracts'
import type { Address } from 'viem'
import { getAbiItem } from 'viem'
import { currentPoolAddress, serverClient } from '../../../blockchain/server-config'

const GetParticipantDetail = getAbiItem({
    abi: poolAbi,
    name: 'getParticipantDetail',
})

export interface ParticipantDetail {
    deposit: bigint
    refunded: boolean
}

export default async function getContractParticipantDetail(
    poolId: string,
    participantAddress: string,
): Promise<ParticipantDetail | null> {
    try {
        const participantInfo = await serverClient.readContract({
            address: currentPoolAddress,
            abi: [GetParticipantDetail],
            functionName: 'getParticipantDetail',
            args: [participantAddress as Address, BigInt(poolId)],
        })

        if (!participantInfo) {
            return null
        }

        const { deposit, refunded } = participantInfo

        return {
            deposit,
            refunded,
        }
    } catch (error) {
        console.error('Error fetching participant details from contract:', error)
        return null
    }
}
