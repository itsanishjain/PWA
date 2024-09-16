import { useQuery } from '@tanstack/react-query'
import { fetchTokenDecimals } from './fetch-token-decimal'
import { wagmi } from '@/app/pwa/_client/providers/configs'

export const useTokenDecimals = (tokenAddress: string) => {
    const {
        data: tokenDecimalsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['tokenDecimals', tokenAddress, wagmi.config.state.chainId],
        queryFn: fetchTokenDecimals,
    })

    return { tokenDecimalsData, isLoading, error }
}
