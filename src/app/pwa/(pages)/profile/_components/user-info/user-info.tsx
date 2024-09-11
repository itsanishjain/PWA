'use client'

import { Avatar, AvatarImage } from '@/app/pwa/_components/ui/avatar'
import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { getUserInfoAction } from '../../actions'
import { Skeleton } from '@/app/pwa/_components/ui/skeleton'
import ReactBlockies from 'react-blockies'
import { Tables } from '@/types/db'
import { useServerActionQuery } from '@/app/pwa/_client/hooks/server-action-hooks'

type UserItem = Pick<Tables<'users'>, 'avatar' | 'displayName'> | null

export default function UserInfo({ initialUserInfo }: { initialUserInfo?: UserItem }) {
    const {
        data: userInfo,
        isLoading,
        isSuccess,
    } = useServerActionQuery(getUserInfoAction, {
        queryKey: ['userInfo'],
        initialData: initialUserInfo || undefined,
        input: undefined,
    })

    const account = useAccount()

    const truncatedAddress = account.address?.slice(0, 6) + '...' + account.address?.slice(-4)

    return (
        <section className='detail_card inline-flex w-full gap-[0.69rem] rounded-3xl p-6'>
            <Avatar className='size-14 cursor-pointer' aria-label='User Avatar'>
                {isLoading ? (
                    <Skeleton className='size-14 rounded-full' />
                ) : userInfo?.avatar ? (
                    <AvatarImage alt='User Avatar' src={userInfo.avatar} />
                ) : (
                    <ReactBlockies seed={account.address || '0x'} size={14} />
                )}
            </Avatar>
            <div className='flex-1 space-y-1'>
                <h1 className='font-medium'>
                    {isLoading ? <Skeleton className='h-4 w-24' /> : userInfo?.displayName || 'Anon User'}
                </h1>
                <h2 className='font-mono text-xs text-[#5472E9]'>
                    {account.address ? truncatedAddress : <Skeleton className='h-4 w-16 bg-[#5472E9]/20' />}
                </h2>
            </div>
            <Link href={`https://sepolia.basescan.org/address/${account.address}`} passHref legacyBehavior>
                <a target='_blank' rel='external noopener noreferrer nofollow' className='self-center'>
                    <ExternalLinkIcon className='size-6' />
                </a>
            </Link>
        </section>
    )
}
