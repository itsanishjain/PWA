import { wagmi } from '@/app/pwa/_client/providers/configs'
import { useQuery } from '@tanstack/react-query'
import { fetchPoolDetails } from './fetch-pool-details'

export const usePoolDetails = (poolId: bigint) => {
    const {
        data: poolDetails,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['poolDetails', poolId, wagmi.config.state.chainId],
        queryFn: fetchPoolDetails,
    })

    return { poolDetails, isLoading, error }
}
