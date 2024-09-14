import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { getSupabaseBrowserClient } from '@/app/(pages)/pool/[pool-id]/participants/_components/db-client'
import { blo } from 'blo'
import { Address } from 'viem'

const fetchUserAvatar = async (privyId?: string) => {
    if (!privyId) return

    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.from('users').select('avatar').eq('privyId', privyId).single()

    if (error) throw error
    return data?.avatar
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
