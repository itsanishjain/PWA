import type { PoolDetailsDTO } from '@/app/pwa/(pages)/pool/[pool-id]/_lib/definitions'
import { POOLSTATUS } from '@/app/pwa/(pages)/pool/[pool-id]/_lib/definitions'
import 'server-only'
import type { Address } from 'viem'
import type { ParticipantDetail } from '../../persistence/pools/blockchain/get-contract-participant-detail'
import getContractParticipantDetail from '../../persistence/pools/blockchain/get-contract-participant-detail'
import type { ContractPoolData } from '../../persistence/pools/blockchain/get-contract-pool'
import { getContractPool } from '../../persistence/pools/blockchain/get-contract-pool'
import type { WinnerDetail } from '../../persistence/pools/blockchain/get-contract-winner-detail'
import getContractWinnerDetail from '../../persistence/pools/blockchain/get-contract-winner-detail'
import type { ParticipantsInfo } from '../../persistence/pools/db/get-db-participants-info'
import getDbParticipantsInfo from '../../persistence/pools/db/get-db-participants-info'
import type { PoolItem } from '../../persistence/pools/db/get-db-pool'
import { getDbPool } from '../../persistence/pools/db/get-db-pool'

function processPoolDetails(
    contractPool: ContractPoolData,
    poolInfo: PoolItem,
    participantsInfo: ParticipantsInfo,
    winnerDetail: WinnerDetail | null,
    userInfo: ParticipantDetail | null,
): PoolDetailsDTO {
    return {
        claimableWinnings: Number(winnerDetail?.amountWon) ?? undefined,
        participants: participantsInfo.participants.map((user: { name: string; avatarUrl: string }) => ({
            name: user.name,
            avatarUrl: user.avatarUrl,
        })),
        userDeposit: Number(userInfo?.deposit) ?? 0,
        goal: poolInfo.softCap * contractPool.price,
        progress: Number(contractPool.poolBalance) / 10 ** contractPool.tokenDecimals,
        name: contractPool.name,
        startDate: contractPool.startDate,
        endDate: contractPool.endDate,
        numParticipants: participantsInfo.count,
        price: contractPool.price,
        tokenSymbol: contractPool.tokenSymbol,
        tokenDecimals: contractPool.tokenDecimals,
        status: contractPool.status,
        imageUrl: poolInfo.image,
        winnerTitle: contractPool.status === POOLSTATUS.ENDED ? 'Winner' : undefined,
        softCap: poolInfo.softCap,
        description: poolInfo.description,
        termsUrl: poolInfo.terms,
        mainHost: contractPool.mainHost,
    }
}

export async function getPoolDetailsUseCase(poolId: string, userAddress?: Address): Promise<PoolDetailsDTO> {
    const contractPool = await getContractPool(poolId)

    if (!contractPool) {
        throw new Error(`Pool with ID ${poolId} not found in contract`)
    }
    const [poolInfo, usersInfo] = await Promise.all([
        getDbPool(poolId),
        getDbParticipantsInfo(poolId, contractPool.participantAddresses),
    ])

    if (!poolInfo) {
        throw new Error(`Pool with ID ${poolId} not found in database`)
    }

    let winnerDetail: WinnerDetail | null = null
    let userDeposit: ParticipantDetail | null = null

    if (userAddress && contractPool.participantAddresses.includes(userAddress)) {
        userDeposit = await getContractParticipantDetail(poolId, userAddress)

        if (contractPool.status === POOLSTATUS.ENDED) {
            winnerDetail = await getContractWinnerDetail(poolId, userAddress)
        }
    }

    return processPoolDetails(contractPool, poolInfo, usersInfo, winnerDetail, userDeposit)
}
