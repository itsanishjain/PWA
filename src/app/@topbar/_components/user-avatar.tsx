'use client'

import { Avatar, AvatarImage } from '@/app/_components/ui/avatar'
import { useUserAvatar } from '@/hooks/useUserAvatar'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { blo } from 'blo'

export default function UserAvatar() {
    const { data: userAvatar, isLoading } = useUserAvatar()
    const { address } = useAccount()

    if (isLoading) {
        return <div className='size-10 animate-pulse rounded-full bg-gray-200' />
    }

    return (
        <Avatar className='size-10 cursor-pointer' aria-label='Go to Profile' asChild>
            <Link href={'/profile'}>
                <AvatarImage alt='user avatar' src={userAvatar || blo(address || '0x')} />
            </Link>
        </Avatar>
    )
}
