import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { getSupabaseBrowserClient } from '@/app/(pages)/pool/[pool-id]/participants/_components/db-client'
import { blo } from 'blo'
import { Address } from 'viem'

const fetchUserAvatar = async (privyId?: string) => {
    if (!privyId) return null

    const supabase = getSupabaseBrowserClient()
    const { data } = await supabase.from('users').select('avatar').eq('privyId', privyId).maybeSingle()

    return data?.avatar ?? null
}

export const useUserAvatar = () => {
    const { user } = usePrivy()

    return useQuery({
        queryKey: ['user-avatar', user?.id],
        queryFn: () => fetchUserAvatar(user?.id),
        enabled: Boolean(user?.id),
        select: data => {
            if (data) return data
            const address = user?.wallet?.address as Address | undefined
            if (address) return blo(address)
        },
    })
}
