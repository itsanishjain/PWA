import { useQuery } from '@tanstack/react-query'
import { fetchClaimablePools } from './fetch-claimable-pools'
import { getConfig } from '@/app/_client/providers/configs/wagmi.config'
import { useUserInfo } from '@/hooks/use-user-info'

export const useClaimablePools = () => {
    const { data: user } = useUserInfo()
    const {
        data: rawClaimablePools,
        isPending,
        error,
    } = useQuery({
        queryKey: ['claimablePools', user?.address || '0x', getConfig().state.chainId],
        queryFn: fetchClaimablePools,
        enabled: Boolean(user?.address),
    })

    const claimablePools = rawClaimablePools
        ? [
              rawClaimablePools[0].filter((_, index) => !rawClaimablePools[1][index]),
              rawClaimablePools[1].filter(claimed => !claimed),
          ]
        : undefined

    return { claimablePools, isPending, error }
}
