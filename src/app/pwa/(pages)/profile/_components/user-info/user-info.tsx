'use client'

import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { Avatar, AvatarFallback } from '@/app/pwa/_components/ui/avatar'
import { ExternalLinkIcon } from 'lucide-react'
import Link from 'next/link'
import { useAccount } from 'wagmi'

interface UserItem {
    avatar: string | null
    displayName: string | null
}

interface UserInfoProps {
    initialUserInfo: UserItem | { needsRefresh: true }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UserInfo({ initialUserInfo }: UserInfoProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setTopBarTitle = useSettingsStore(state => state.setTopBarTitle)
    const account = useAccount()
    // const [error, data] = useState<UserItem>(
    //     initialUserInfo && 'needsRefresh' in initialUserInfo ? null : initialUserInfo,
    // )

    // useEffect(() => {
    //     setTopBarTitle('User Profile')
    //     return () => {
    //         setTopBarTitle(null)
    //     }
    // }, [setTopBarTitle])

    // useEffect(() => {
    //     const fetchUserInfo = async () => {
    //         const [result] = await getUserInfoAction()
    //         if (result && 'needsRefresh' in result) {
    //             // Wait for client-side refresh
    //             setTimeout(fetchUserInfo, 1000)
    //         } else {
    //             setUserInfo(result)
    //         }
    //     }

    //     if ((initialUserInfo && 'needsRefresh' in initialUserInfo) || !userInfo) {
    //         fetchUserInfo()
    //     }
    // }, [initialUserInfo, userInfo])

    // const truncatedAddress = account.address?.slice(0, 6) + '...' + account.address?.slice(-4)

    return (
        <section className='detail_card inline-flex w-full gap-[0.69rem] rounded-3xl p-6'>
            <Avatar className='size-[3.125rem] cursor-pointer' aria-label='User Avatar'>
                {/* {userInfo?.avatar && <AvatarImage alt='User Avatar' src={userInfo.avatar} />} */}
                <AvatarFallback className='bg-[#d9d9d9]/40 backdrop-blur-xl' />
            </Avatar>
            <div className='flex-1 space-y-1'>
                {/* <h1 className='font-medium'>{userInfo?.displayName || <Skeleton className='h-4 w-24' />}</h1> */}
                <h2 className='font-mono text-xs text-[#5472E9]'>
                    {/* {account.address ? truncatedAddress : <Skeleton className='h-4 w-16 bg-[#5472E9]/20' />} */}
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
