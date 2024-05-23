import Link from 'next/link'
import { useRouter } from 'next/router'
import {
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'
import { removeTokenCookie, useCookie } from '@/hooks/cookie'

import leftArrowImage from '@/public/images/left_arrow.svg'

import { Comfortaa } from 'next/font/google'
import { useEffect, useState } from 'react'
import { JwtPayload, decode } from 'jsonwebtoken'
import frogImage from '@/public/images/frog.png'
import keyboardReturnImage from '@/public/images/keyboard_return.svg'

import { useQueryClient, useQuery } from '@tanstack/react-query'
import { fetchUserDisplayForAddress } from '@/lib/api/clientAPI'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'

const comfortaa = Comfortaa({ subsets: ['latin'] })

interface AppBarProps {
	backRoute?: string // Required color property
	pageTitle?: string // Optional size property
	rightMenu?: RightMenu
}

const Appbar = ({ backRoute, pageTitle, rightMenu }: AppBarProps) => {
	const router = useRouter()
	const { currentJwt } = useCookie()
	const { wallets, ready: walletsReady } = useWallets()
	const [pageUrl, setPageUrl] = useState('')

	const { ready, authenticated, logout } = usePrivy()

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

	useEffect(() => {
		if (ready && !authenticated) {
			router.push('/login')
		}

		if (ready && authenticated && walletsReady && wallets?.length == 0) {
			handleSignOut()
		}

		console.log('displayName', profileData)
		setPageUrl(window?.location.href)
	}, [profileData, ready, authenticated, router])

	return (
		<header className='fixed top-0 left-0 z-20 w-full pt-safe bg-white'>
			<nav className=' px-safe '>
				<div className='mx-auto flex h-20 max-w-screen-md items-center justify-between px-6'>
					<div className='flex w-16'>
						{backRoute && (
							<Link href={backRoute ?? ''}>
								<img className='h-10 w-10' src={`${leftArrowImage.src}`} />
							</Link>
						)}
					</div>
					<div className='flex flex-1 items-center'>
						{pageTitle ? (
							<h1
								className={`text-center w-full h-full font-medium md:text-3xl text-xl`}
							>
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
					<div className='flex justify-end space-x-6 w-16'>
						{rightMenu == RightMenu.ProfileImage ||
							(rightMenu == undefined && (
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
							))}
						{rightMenu == RightMenu.RefundMenu && (
							<div>
								{/* <button
									className='flex flex-col items-center'
									onClick={rightButtonCallback}
								>
									<svg
										width='20'
										height='20'
										viewBox='0 0 20 20'
										fill='white'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M5.55382 9.99995C5.55382 8.77772 4.55382 7.77772 3.3316 7.77772C2.10937 7.77772 1.10937 8.77772 1.10937 9.99995C1.10937 11.2222 2.10938 12.2222 3.3316 12.2222C4.55382 12.2222 5.55382 11.2222 5.55382 9.99995ZM7.77604 9.99995C7.77604 11.2222 8.77604 12.2222 9.99826 12.2222C11.2205 12.2222 12.2205 11.2222 12.2205 9.99995C12.2205 8.77772 11.2205 7.77772 9.99826 7.77772C8.77604 7.77772 7.77604 8.77772 7.77604 9.99995ZM14.4427 9.99995C14.4427 11.2222 15.4427 12.2222 16.6649 12.2222C17.8872 12.2222 18.8872 11.2222 18.8872 9.99994C18.8872 8.77772 17.8872 7.77772 16.6649 7.77772C15.4427 7.77772 14.4427 8.77772 14.4427 9.99995Z'
											fill='black'
										/>
									</svg>
								</button> */}
								<DropdownMenu>
									<DropdownMenuTrigger>
										<div className='w-12 h-12 p-3 rounded-full'>
											<svg
												width='20'
												height='20'
												viewBox='0 0 20 20'
												fill='white'
												xmlns='http://www.w3.org/2000/svg'
											>
												<path
													d='M5.55382 9.99995C5.55382 8.77772 4.55382 7.77772 3.3316 7.77772C2.10937 7.77772 1.10937 8.77772 1.10937 9.99995C1.10937 11.2222 2.10938 12.2222 3.3316 12.2222C4.55382 12.2222 5.55382 11.2222 5.55382 9.99995ZM7.77604 9.99995C7.77604 11.2222 8.77604 12.2222 9.99826 12.2222C11.2205 12.2222 12.2205 11.2222 12.2205 9.99995C12.2205 8.77772 11.2205 7.77772 9.99826 7.77772C8.77604 7.77772 7.77604 8.77772 7.77604 9.99995ZM14.4427 9.99995C14.4427 11.2222 15.4427 12.2222 16.6649 12.2222C17.8872 12.2222 18.8872 11.2222 18.8872 9.99994C18.8872 8.77772 17.8872 7.77772 16.6649 7.77772C15.4427 7.77772 14.4427 8.77772 14.4427 9.99995Z'
													fill='black'
												/>
											</svg>
										</div>
									</DropdownMenuTrigger>
									<DropdownMenuContent sideOffset={0}>
										<DropdownMenuItem>
											<Link href={`${pageUrl}/refund`}>
												<div className='flex flex-row space-x-2 items-center justify-center'>
													<span>
														<img
															className='flex w-full h-full'
															src={keyboardReturnImage.src}
														></img>
													</span>
													<span>Issue refund</span>
												</div>
											</Link>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
						{rightMenu == RightMenu.ManageParticipants && (
							<div>
								<button className='flex flex-col items-center'>
									<img
										src={`${profileData?.profileImageUrl ?? frogImage.src}`}
										className='rounded-full w-9 h-9 object-cover'
									></img>
								</button>
							</div>
						)}
					</div>
				</div>
			</nav>
		</header>
	)
}

export default Appbar

export enum RightMenu {
	ProfileImage = 0,
	RefundMenu = 1,
	ManageParticipants = 2,
}
