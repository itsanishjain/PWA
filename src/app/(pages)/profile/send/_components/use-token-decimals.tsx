import { useQuery } from '@tanstack/react-query'
import { fetchTokenDecimals } from './fetch-token-decimal'
import { getConfig } from '@/app/_client/providers/configs/wagmi.config'

export const useTokenDecimals = (tokenAddress: string) => {
    const {
        data: tokenDecimalsData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['tokenDecimals', tokenAddress, getConfig().state.chainId],
        queryFn: fetchTokenDecimals,
    })

    return { tokenDecimalsData, isLoading, error }
}
