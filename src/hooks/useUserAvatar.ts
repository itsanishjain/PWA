import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { getSupabaseBrowserClient } from '@/app/(pages)/pool/[pool-id]/participants/_components/db-client'

const fetchUserAvatar = async (privyId: string) => {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase.from('users').select('avatar').eq('privyId', privyId).single()

    if (error) throw error
    return data?.avatar
}

export const useUserAvatar = () => {
    const { user } = usePrivy()

    return useQuery({
        queryKey: ['userAvatar', user?.id],
        queryFn: () => fetchUserAvatar(user?.id as string),
        enabled: !!user?.id,
    })
}
