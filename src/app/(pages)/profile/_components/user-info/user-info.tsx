'use client'

import { Avatar, AvatarImage } from '@/app/_components/ui/avatar'
import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useAccount } from 'wagmi'
import { getUserInfoAction } from '../../actions'
import { Skeleton } from '@/app/_components/ui/skeleton'
import { Tables } from '@/types/db'
import { useServerActionQuery } from '@/app/_client/hooks/server-action-hooks'
import { blo } from 'blo'

type UserItem = Pick<Tables<'users'>, 'avatar' | 'displayName'> | null

export default function UserInfo({ initialUserInfo }: { initialUserInfo?: UserItem }) {
    const { data: userInfo, isLoading } = useServerActionQuery(getUserInfoAction, {
        queryKey: ['getUserInfoAction'],
        initialData: initialUserInfo || undefined,
        input: undefined,
    })

    const { address } = useAccount()

    const truncatedAddress = address?.slice(0, 6) + '...' + address?.slice(-4)

    return (
        <section className='detail_card inline-flex w-full gap-[0.69rem] rounded-3xl p-6'>
            <Avatar className='size-14 cursor-pointer' aria-label='User Avatar'>
                {isLoading ? (
                    <Skeleton className='size-14 rounded-full' />
                ) : (
                    <AvatarImage alt='user avatar' src={userInfo.avatar || blo(address || '0x')} />
                )}
            </Avatar>
            <div className='flex-1 space-y-1'>
                <h1 className='font-medium'>
                    {isLoading ? <Skeleton className='h-4 w-24' /> : userInfo?.displayName || 'Anon User'}
                </h1>
                <h2 className='font-mono text-xs text-[#5472E9]'>
                    {address ? truncatedAddress : <Skeleton className='h-4 w-16 bg-[#5472E9]/20' />}
                </h2>
            </div>
            <Link href={`https://sepolia.basescan.org/address/${address}`} passHref legacyBehavior>
                <a target='_blank' rel='external noopener noreferrer nofollow' className='self-center'>
                    <ExternalLinkIcon className='size-6' />
                </a>
            </Link>
        </section>
    )
}
