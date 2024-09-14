import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { getSupabaseBrowserClient } from '@/app/(pages)/pool/[pool-id]/participants/_components/db-client'
import { blo } from 'blo'
import { Address } from 'viem'

const fetchUserAvatar = async (privyId?: string) => {
    if (!privyId) return

    const supabase = getSupabaseBrowserClient()
    try {
        const { data, error } = await supabase.from('users').select('avatar').eq('privyId', privyId).single()

        // PGRST116 is negligible here, as it only means the user has no avatar set
        if (error && error?.code !== 'PGRST116') throw error

        return data?.avatar
    } catch (error) {
        console.error('[use-user-avatar] error', error)
    }
}

export const useUserAvatar = () => {
    const { user } = usePrivy()

    return useQuery({
        queryKey: ['userAvatar', user?.id],
        queryFn: () => fetchUserAvatar(user?.id),
        enabled: !!user?.id,
        select: data => {
            if (data) return data
            const address = user?.wallet?.address as Address | undefined
            if (address) return blo(address)
        },
    })
}
