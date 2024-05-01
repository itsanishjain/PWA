import Link from 'next/link'
import { useRouter } from 'next/router'
import {
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'
import {
	getTokenCookie,
	setTokenCookie,
	removeTokenCookie,
} from '@/hooks/cookie'

import { Comfortaa } from 'next/font/google'

const comfortaa = Comfortaa({ subsets: ['latin'] })

const links = [
	{ label: 'Login', href: '/login' },
	{ label: 'Story', href: '/story' },
	{ label: 'Recipes', href: '/recipes' },
]

const Appbar = () => {
	const router = useRouter()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const handleAccountClick = (e: any) => {
		router.push('/user-profile')
	}

	const handleSignOut = () => {
		logout()
		removeTokenCookie()
	}

	return (
		<div className='fixed top-0 left-0 z-20 w-full bg-zinc-900 pt-safe'>
			<header className='border-b bg-zinc-100 px-safe '>
				<div className='mx-auto flex h-20 max-w-screen-md items-center justify-between px-6'>
					<div className='flex-1 flex'></div>
					<div className='flex flex-1 items-center'>
						<Link href='/' className='text-center w-full'>
							<h1
								className={`text-center w-full h-full font-bold text-4xl ${comfortaa.className}`}
							>
								pool
							</h1>
						</Link>
					</div>
					<nav className='flex items-center space-x-6 flex-1'>
						<div className='hidden sm:block'>
							{/* <div className='flex items-center space-x-6'>
								{links.map(({ label, href }) => (
									<Link
										key={label}
										href={href}
										className={`text-sm ${
											router.pathname === href
												? 'text-indigo-500 '
												: 'text-zinc-600 hover:text-zinc-900 '
										}`}
									>
										{label}
									</Link>
								))}
							</div> */}
						</div>
						<div>
							{' '}
							<button onClick={handleAccountClick}>Account</button>
						</div>
						<div>
							{' '}
							<button onClick={handleSignOut}>Sign Out</button>
						</div>
					</nav>
				</div>
			</header>
		</div>
	)
}

export default Appbar
