import { useQuery } from '@tanstack/react-query'
import { fetchClaimablePools } from './fetch-claimable-pools'
import { getConfig } from '@/app/_client/providers/configs/wagmi.config'

export const useClaimablePools = (address: string) => {
    const {
        data: claimablePools,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['claimablePools', address, getConfig().state.chainId],
        queryFn: fetchClaimablePools,
    })

    return { claimablePools, isLoading, error }
}
