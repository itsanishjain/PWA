import dynamic from 'next/dynamic'
import { getUserAvatarAction } from './actions'

const PageTitle = dynamic(() => import('./_components/page-title'), {
    ssr: false,
})

const BackButton = dynamic(() => import('./_components/back-button'), {
    // ssr: false,
})

const UserMenu = dynamic(() => import('./_components/user-menu'), {
    // ssr: false,
})

export default async function TopBarLayout(): Promise<JSX.Element> {
    const userAvatar = await getUserAvatarAction()

    return (
        <header className='fixed left-0 top-0 z-30 w-dvw'>
            <nav className='mx-auto flex h-24 max-w-screen-md items-center justify-between bg-white pt-5 px-safe-or-6'>
                <div className='flex w-1/4 justify-start'>
                    <BackButton />
                </div>
                <div className='relative flex w-1/2 justify-center'>
                    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap'>
                        <PageTitle />
                    </div>
                </div>
                <div className='flex w-1/4 justify-end'>
                    <UserMenu userAvatar={userAvatar} />
                </div>
            </nav>
        </header>
    )
}
