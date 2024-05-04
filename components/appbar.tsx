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
	useCookie,
} from '@/hooks/cookie'

import leftArrowImage from '@/public/images/left_arrow.svg'

import { Comfortaa } from 'next/font/google'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { JwtPayload, decode } from 'jsonwebtoken'
import frogImage from '@/public/images/frog.png'
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { fetchUserDisplayForAddress } from '@/lib/api/clientAPI'

const comfortaa = Comfortaa({ subsets: ['latin'] })

const links = [
	{ label: 'Login', href: '/login' },
	{ label: 'Story', href: '/story' },
	{ label: 'Recipes', href: '/recipes' },
]

interface AppBarProps {
	backRoute?: string // Required color property
	pageTitle?: string // Optional size property
}

const Appbar = ({ backRoute, pageTitle }: AppBarProps) => {
	const router = useRouter()
	const { currentJwt } = useCookie()
	const { wallets } = useWallets()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const handleAccountClick = (e: any) => {
		router.push('/user-profile')
	}

	const handleSignOut = () => {
		logout()
		removeTokenCookie()
	}
	const [profileImageUrl, setProfileImageUrl] = useState<string>(
		`${frogImage.src}`,
	)

	const address = wallets?.[0]?.address ?? '0x'
	const { data: profileData } = useQuery({
		queryKey: ['loadProfileImage', wallets?.[0]?.address],
		queryFn: fetchUserDisplayForAddress,
		enabled: wallets.length > 0,
	})

	return (
		<header className='fixed top-0 left-0 z-20 w-full pt-safe bg-white'>
			<nav className=' px-safe '>
				<div className='mx-auto flex h-20 max-w-screen-md items-center justify-between px-6'>
					<div className='flex-1 flex'>
						{backRoute && (
							<Link href={backRoute ?? ''}>
								<img className='h-10 w-10' src={`${leftArrowImage.src}`} />
							</Link>
						)}
					</div>
					<div className='flex flex-1 items-center'>
						{pageTitle ? (
							<h1 className={`text-center w-full h-full font-medium text-3xl`}>
								{pageTitle}
							</h1>
						) : (
							<Link href='/' className='text-center w-full'>
								<h1
									className={`text-center w-full h-full font-bold text-5xl ${comfortaa.className}`}
								>
									pool
								</h1>
							</Link>
						)}
					</div>
					<div className='flex justify-end space-x-6 flex-1'>
						<div>
							<button
								className='flex flex-col items-center'
								onClick={handleAccountClick}
							>
								<img
									src={`${profileData?.profileImageUrl ?? frogImage.src}`}
									className='rounded-full w-9 h-9 object-cover'
								></img>
							</button>
						</div>
					</div>
				</div>
			</nav>
		</header>
	)
}

export default Appbar
