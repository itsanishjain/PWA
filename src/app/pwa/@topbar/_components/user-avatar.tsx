'use client'

import { Avatar, AvatarImage } from '@/app/pwa/_components/ui/avatar'
import { Route } from 'next'
import Link from 'next/link'
import ReactBlockies from 'react-blockies'
import { useAccount } from 'wagmi'
import { useServerActionQuery } from '../../_client/hooks/server-action-hooks'
import { getUserInfoAction } from '../../(pages)/profile/actions'

interface UserAvatarProps {
    userAvatar: string | null
}

export default function UserAvatar({ userAvatar }: UserAvatarProps) {
    const {
        data: userInfo,
        isLoading,
        isSuccess,
    } = useServerActionQuery(getUserInfoAction, {
        queryKey: ['userInfo'],
        initialData: userAvatar ? { displayName: '', avatar: userAvatar } : undefined,
        input: undefined,
    })

    const { address } = useAccount()

    if (isLoading) {
        return <div className='size-10 animate-pulse rounded-full bg-gray-200' />
    }

    if (isSuccess && userInfo) {
        return (
            <Avatar className='size-10 cursor-pointer' aria-label='Go to Profile' asChild>
                <Link href={'/profile' as Route}>
                    {userInfo?.avatar ? (
                        <AvatarImage alt='User Avatar' src={userInfo.avatar} />
                    ) : (
                        <ReactBlockies seed={address || '0x'} size={10} />
                    )}
                </Link>
            </Avatar>
        )
    }

    return null
}
