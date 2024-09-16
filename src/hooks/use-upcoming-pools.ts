import { useInfiniteQuery } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/app/(pages)/pool/[pool-id]/participants/_components/db-client'
import { PoolItem } from '@/app/_lib/entities/models/pool-item'
import { getContractPools } from '@/app/_server/persistence/pools/blockchain/get-contract-pools'

const ITEMS_PER_PAGE = 8

const fetchUpcomingPools = async ({ pageParam = 0 }): Promise<PoolItem[]> => {
    const supabase = getSupabaseBrowserClient()

    // Fetch pools from the smart contract
    const contractPools = await getContractPools()

    // Fetch pool data from Supabase
    const { data: dbPools } = await supabase
        .from('pools')
        .select('*')
        .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1)

    const now = new Date()

    const upcomingPools = contractPools
        .map(contractPool => {
            const dbPool = dbPools?.find(dp => dp.contract_id === parseInt(contractPool.id))
            if (!dbPool) return null

            const startDate = new Date(Number(contractPool.timeStart) * 1000)
            if (startDate <= now) return null

            return {
                id: contractPool.id.toString(),
                name: contractPool.name,
                image: dbPool.bannerImage ?? '',
                startDate,
                endDate: new Date(Number(contractPool.timeEnd) * 1000),
                status: contractPool.status.toString(),
                numParticipants: Number(contractPool.numParticipants),
                softCap: dbPool.softCap,
            }
        })
        .filter((pool): pool is PoolItem => pool !== null)
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    return upcomingPools.slice(0, ITEMS_PER_PAGE)
}

export const useUpcomingPools = () => {
    return useInfiniteQuery({
        queryKey: ['upcoming-pools'],
        queryFn: fetchUpcomingPools,
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === ITEMS_PER_PAGE ? pages.length : undefined
        },
    })
}
