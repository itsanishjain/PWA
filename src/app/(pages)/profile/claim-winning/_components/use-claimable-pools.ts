import { useQuery } from '@tanstack/react-query'
import { fetchClaimablePools } from './fetch-claimable-pools'
import { wagmi } from '@/app/pwa/_client/providers/configs'

export const useClaimablePools = (address: string) => {
    const {
        data: claimablePools,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['claimablePools', address, wagmi.config.state.chainId],
        queryFn: fetchClaimablePools,
    })

    return { claimablePools, isLoading, error }
}
