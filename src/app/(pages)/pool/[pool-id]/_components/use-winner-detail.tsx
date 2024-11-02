import { getConfig } from '@/app/_client/providers/configs/wagmi.config'
import { getWinnerDetail } from '@/app/_lib/blockchain/functions/pool/get-winner-detail'
import { useQuery } from '@tanstack/react-query'

export const useWinnerDetail = (poolId: string, address: string) => {
    const {
        data: winnerDetail,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['get-winner-detail', poolId, address, getConfig().state.chainId],
        queryFn: getWinnerDetail,
    })

    return { winnerDetail, isLoading, error }
}
