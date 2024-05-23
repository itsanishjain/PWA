import Page from '@/components/page'
import Section from '@/components/section'
import frogImage from '@/public/images/frog.png'
import { useRouter } from 'next/router'
import {
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'

import React, { useState, useEffect, ChangeEvent, useMemo, useRef } from 'react'

import Appbar, { RightMenu } from '@/components/appbar'

import { Inter } from 'next/font/google'

import {
	fetchUserDisplayForAddress,
	handleDeleteParticipant,
	handleRefundParticipant,
} from '@/lib/api/clientAPI'
import { removeTokenCookie, useCookie } from '@/hooks/cookie'
import { JwtPayload, decode } from 'jsonwebtoken'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import * as _ from 'lodash'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import styles from './styles/admin.module.css'
import { ethers } from 'ethers'

const inter = Inter({ subsets: ['latin'] })

const RefundUser = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
		`${frogImage.src}`,
	)

	const { currentJwt } = useCookie()
	const { toast } = useToast()

	const [displayName, setDisplayName] = useState<string>('')

	const address = wallets?.[0]?.address ?? '0x'
	const { data: profileData } = useQuery({
		queryKey: ['loadProfileImage', wallets?.[0]?.address],
		queryFn: fetchUserDisplayForAddress,
		enabled: wallets.length > 0,
	})
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [inputValue, setInputValue] = useState<string>('0')

	const parentRoute = useMemo(() => {
		const paths = router.asPath.split('/')
		paths.pop() // Remove the last sub-route
		return paths.join('/')
	}, [router.asPath])

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value)
	}

	const poolId = router?.query?.poolId! ?? 0
	const participantAddress = router?.query?.address! ?? '0x'

	const queryClient = useQueryClient()

	// Remove deleteParticipantMutation because might not want to delete participant
	// const deleteParticipantMutation = useMutation({
	// 	mutationFn: handleDeleteParticipant,
	// 	onSuccess: () => {
	// 		console.log('Delete Participant')
	// 		toast({
	// 			title: 'Transaction Successful',
	// 			description: 'Deleted Participant',
	// 		})
	// 	},
	// 	onError: () => {
	// 		console.log('setWinner Error')
	// 	},
	// })

	const refundParticipantMutation = useMutation({
		mutationFn: handleRefundParticipant,
		onSuccess: () => {
			console.log('refundParticipant Success')
			toast({
				title: 'Transaction Successful',
				description: 'Refunded User',
			})
			setInputValue('0')
			// deleteParticipantMutation.mutate({
			// 	params: [
			// 		poolId?.toString() ?? '0',
			// 		participantAddress.toString(), // Fix: Convert participantAddress to string
			// 		currentJwt ?? '',
			// 	],
			// })
		},
		onError: () => {
			console.log('refundParticipant Error')
		},
	})

	const onRefundUserButtonClicked = (e: any) => {
		toast({
			title: 'Requesting Transaction',
			description: 'Refund User',
		})

		refundParticipantMutation.mutate({
			params: [
				poolId.toString(),
				participantAddress.toString(),
				inputValue,
				wallets,
			],
		})
	}

	useEffect(() => {
		if (ready && !authenticated) {
			// Replace this code with however you'd like to handle an unauthenticated user
			// As an example, you might redirect them to a sign-in page
			router.push('/login')
		}

		if (wallets.length > 0) {
			console.log(`Wallet Length: ${wallets.length}`)
			// console.log(`Wallet Address: ${wallets[0].address}`)
		}
		for (var i = 0; i < wallets.length; i++) {
			console.log(`Wallet ${i} Address: ${wallets[i].address}`)
		}

		if (profileData?.profileImageUrl) {
			setProfileImageUrl(profileData?.profileImageUrl)
		}
		setDisplayName(profileData?.userDisplayData.display_name ?? '')
		console.log('displayName', profileData)
		if (inputRef?.current) {
			inputRef.current.focus()
		}
	}, [profileData, ready, authenticated, router, inputRef, inputValue])

	return (
		<Page>
			<Appbar backRoute={parentRoute} pageTitle='Refund Player' />
			<Section>
				<div
					className={`flex justify-center w-full mt-20 min-h-screen ${inter.className}`}
				>
					<div className='flex flex-col pb-8'>
						<div className='flex w-full justify-center'>
							<img
								className='rounded-full w-24 aspect-square center object-cover z-0'
								src={profileImageUrl}
							/>
						</div>

						<div className='flex flex-row'>
							<h3 className='h-10 flex flex-row items-center justify-center flex-1 font-semibold'>
								{displayName}
							</h3>
						</div>
						<div className='flex flex-row justify-center'>
							<p>Checked in</p>
						</div>
						<div className='flex flex-row justify-center h-16 mt-2 '>
							<div className='flex relative justify-center '>
								<Input
									className='border-none text-center text-6xl font-bold h-16 w-auto'
									placeholder='$0'
									autoFocus={true}
									value={inputValue}
									type='number'
									onChange={handleInputChange}
									ref={inputRef}
									inputMode='numeric'
								/>
							</div>
						</div>
						<div className='flex flex-row w-full justify-between mt-auto mb-48'>
							<div className='font-semibold md:text-2xl'>Refund</div>
							<div className='font-semibold md:text-2xl'>${inputValue}USD</div>
						</div>
						<div className='fixed flex space-x-2 flex-row bottom-5 md:bottom-6 left-1/2 transform -translate-x-1/2 max-w-screen-md w-full px-6'>
							<button
								className={`bg-black flex text-center justify-center items-center flex-1 h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline `}
								onClick={onRefundUserButtonClicked}
							>
								Refund
							</button>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default RefundUser
