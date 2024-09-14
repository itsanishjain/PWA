'use client'

import { Avatar, AvatarImage } from '@/app/_components/ui/avatar'
import { useUserAvatar } from '@/hooks/useUserAvatar'
import { Route } from 'next'
import Link from 'next/link'
import ReactBlockies from 'react-blockies'
import { useAccount } from 'wagmi'

export default function UserAvatar() {
    const { data: userAvatar, isLoading, isError } = useUserAvatar()
    const { address } = useAccount()

    if (isLoading) {
        return <div className='size-10 animate-pulse rounded-full bg-gray-200' />
    }

    if (isError || !userAvatar) {
        return (
            <Avatar className='size-10 cursor-pointer' aria-label='Go to Profile' asChild>
                <Link href={'/profile' as Route}>
                    <ReactBlockies seed={address || '0x'} size={10} />
                </Link>
            </Avatar>
        )
    }

    return (
        <Avatar className='size-10 cursor-pointer' aria-label='Go to Profile' asChild>
            <Link href={'/profile' as Route}>
                <AvatarImage alt='User Avatar' src={userAvatar} />
            </Link>
        </Avatar>
    )
}
