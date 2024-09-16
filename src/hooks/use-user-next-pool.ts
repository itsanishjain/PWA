import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { Address } from 'viem'
import { getSupabaseBrowserClient } from '@/app/(pages)/pool/[pool-id]/participants/_components/db-client'
import { getUserPools } from '@/app/_server/persistence/pools/blockchain/get-contract-user-pools'
import { PoolItem } from '@/app/_lib/entities/models/pool-item'

const statusMap: Record<number, string> = {
    0: 'INACTIVE',
    1: 'DEPOSIT_ENABLED',
    2: 'STARTED',
    3: 'ENDED',
    4: 'DELETED',
}

const fetchUserNextPool = async (userAddress: Address): Promise<PoolItem | undefined> => {
    const supabase = getSupabaseBrowserClient()
    const userPools = await getUserPools(userAddress)

    const { data: dbPools } = await supabase.from('pools').select('*')

    const validPools = userPools
        .filter(
            (pool): pool is NonNullable<typeof pool> =>
                pool !== null && pool !== undefined && (pool.status === 1 || pool.status === 2),
        )
        .map(pool => {
            const dbPool = dbPools?.find(dp => dp.contract_id === parseInt(pool.id))
            return {
                id: pool.id,
                name: pool.name,
                image: dbPool?.bannerImage ?? '',
                startDate: new Date(pool.timeStart * 1000),
                endDate: new Date(pool.timeEnd * 1000),
                status: statusMap[pool.status] || 'UNKNOWN',
                numParticipants: pool.numParticipants,
                softCap: dbPool?.softCap ?? 0,
            }
        })

    const [nextUpcomingPool] = validPools.sort((a, b) => {
        if (a.startDate.getTime() !== b.startDate.getTime()) {
            return a.startDate.getTime() - b.startDate.getTime()
        }
        return a.endDate.getTime() - b.endDate.getTime()
    })

    return nextUpcomingPool
}

export const useUserNextPool = () => {
    const { user } = usePrivy()
    const userAddress = user?.wallet?.address as Address | undefined

    return useQuery({
        queryKey: ['user-next-pool', userAddress],
        queryFn: () => fetchUserNextPool(userAddress!),
        enabled: Boolean(userAddress),
    })
}
