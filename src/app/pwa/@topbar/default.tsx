import dynamic from 'next/dynamic'
import PoolTopLogo from '../_components/icons/pool-top-logo'
import { getUserInfoAction } from '../(pages)/profile/actions'

const PageTitle = dynamic(() => import('./_components/page-title'), {
    ssr: true,
    loading: () => (
        <div className='animate-pulse'>
            <PoolTopLogo />
        </div>
    ),
})

const BackButton = dynamic(() => import('./_components/back-button'), {
    ssr: true,
})

const UserMenu = dynamic(() => import('./_components/user-menu'), {
    ssr: true,
})

export default async function TopBarLayout(): Promise<JSX.Element> {
    const [userInfo, error] = await getUserInfoAction()

    if (error) {
        console.error(error)
    }

    return (
        <header className='fixed left-0 top-0 z-30 w-full'>
            <nav className='mx-auto flex h-24 max-w-screen-md items-center justify-between bg-white pt-safe px-safe-or-6'>
                <div className='flex w-1/4 justify-start'>
                    <BackButton />
                </div>
                <div className='relative flex w-1/2 justify-center'>
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap'>
                        <PageTitle />
                    </div>
                </div>
                <div className='flex w-1/4 justify-end'>
                    <UserMenu userAvatar={userInfo?.avatar || null} />
                </div>
            </nav>
        </header>
    )
}
