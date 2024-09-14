'use client'

import { Avatar, AvatarImage } from '@/app/_components/ui/avatar'
import { useUserAvatar } from '@/hooks/use-user-avatar'
import Link from 'next/link'

export default function UserAvatar() {
    const { data: userAvatar, isLoading } = useUserAvatar()

    if (isLoading) {
        return <div className='size-10 animate-pulse rounded-full bg-gray-200' />
    }

    return (
        <Avatar className='size-10 cursor-pointer' aria-label='Go to Profile' asChild>
            <Link href={'/profile'}>
                <AvatarImage alt='user avatar' src={userAvatar} />
            </Link>
        </Avatar>
    )
}
