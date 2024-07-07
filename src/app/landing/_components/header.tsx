import getAppUrl from '@/lib/utils/get-app-url'
import route from '@/lib/utils/routes'
import Link from 'next/link'

export default function Header() {
    return (
        <header className='sticky top-0'>
            <nav className='container flex items-center justify-between pt-5 lg:pt-16'>
                <Link href={route['/']} className='font-logo text-5xl font-bold text-white'>
                    pool
                </Link>
                <Link
                    href={getAppUrl('/')}
                    className='rounded-full bg-zinc-100 px-8 py-3.5 text-xl font-medium text-black'>
                    Get started
                </Link>
            </nav>
        </header>
    )
}
