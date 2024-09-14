import BackButton from './_components/back-button'
import PageTitle from './_components/page-title'
import UserMenu from './_components/user-menu'

export default function TopBarLayout() {
    return (
        <header className='fixed inset-x-0 top-0 z-30 bg-white pt-safe'>
            <nav className='mx-auto grid h-24 max-w-screen-md grid-cols-[1fr_auto_1fr] items-center px-safe-or-6'>
                <BackButton />
                <div className='text-center'>
                    <PageTitle />
                </div>
                <div className='justify-self-end'>
                    <UserMenu />
                </div>
            </nav>
        </header>
    )
}
