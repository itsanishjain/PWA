import 'server-only'
import { db } from '../../../database/db'

export interface ParticipantsInfo {
    participants: { name: string; avatarUrl: string }[]
    count: number
}

export default async function getDbParticipantsInfo(
    poolId: string,
    participantAddresses: readonly string[],
): Promise<ParticipantsInfo> {
    const { data: participantsInfo, error } = await db
        .from('pool_participants')
        .select(
            `
      users (
        displayName,
        avatar,
        walletAddress
      )
    `,
        )
        .eq('pool_id', poolId)

    if (error) {
        throw new Error(`Error getting pool participants from database: ${error.message}`)
    }

    // Transform the data to match the expected return type
    const participants = participantsInfo
        .map(({ users }) => ({
            name: users?.displayName || '',
            avatarUrl: users?.avatar || '',
            walletAddress: users?.walletAddress || '',
        }))
        .filter(participant => Boolean(participant.name) && Boolean(participant.avatarUrl))

    return {
        participants,
        count: participantsInfo.length,
    }
}
