import { Avatar, AvatarFallback, AvatarImage } from '@/app/pwa/_components/ui/avatar'
import route from '@/lib/utils/routes'
import Link from 'next/link'

interface UserAvatarProps {
    userAvatar: string | null
}

export default function UserAvatar({ userAvatar }: UserAvatarProps) {
    return (
        <Avatar className='size-10 cursor-pointer' aria-label='Go to Profile' asChild>
            <Link href={route['/profile']}>
                {userAvatar && <AvatarImage alt='User Avatar' src={userAvatar} />}
                <AvatarFallback className='bg-[#d9d9d9]' />
            </Link>
        </Avatar>
    )
}
