'use client'

import { useSmartAccount } from '@/app/pwa/_client/hooks/use-smart-account'
import { Button } from '@/app/pwa/_components/ui/button'
import { Skeleton } from '@/app/pwa/_components/ui/skeleton'
import { usePrivy } from '@privy-io/react-auth'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import SkipButton from './skip-button'
import UserAvatar from './user-avatar'
import UserDropdown from './user-dropdown'

const notifyLoginError = (error: string) => {
    console.log('error', error)
    toast.error('Error, action canceled', {
        description: 'Please, try to log in again.',
        duration: 20,
    })
}

interface UserMenuProps {
    userAvatar: string | null
}

export default function UserMenu({ userAvatar }: UserMenuProps) {
    const { login, error, loading } = useSmartAccount()
    const { ready, authenticated } = usePrivy()
    const pathname = usePathname()

    if (error) {
        notifyLoginError(error)
    }

    if (loading || !ready) return <Skeleton className='h-[30px] w-[46px] px-[10px] py-[5px]' />

    if (ready && authenticated) {
        switch (pathname) {
            case '/profile':
                return <UserDropdown />
            case '/profile/new':
                return <SkipButton />
            default:
                return <UserAvatar userAvatar={userAvatar} />
        }
    }

    return (
        <Button className='h-[30px] w-[46px] rounded-mini bg-cta px-[10px] py-[5px] text-[10px]' onClick={login}>
            Login
        </Button>
    )
}
