import Appbar, { RightMenu } from '@/components/appbar'
import Page from '@/components/page'
import Section from '@/components/section'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useCookie } from '@/hooks/cookie'
import {
	fetchUserDisplayForAddress,
	handleSavePayout,
	handleSetWinner,
} from '@/lib/api/clientAPI'
import frogImage from '@/public/images/frog.png'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

const UserProfile = () => {
	const router = useRouter()
	const { ready, authenticated } = usePrivy()

	const { wallets } = useWallets()

	const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
		`${frogImage.src}`,
	)

	const { currentJwt } = useCookie()
	const { toast } = useToast()

	const [displayName, setDisplayName] = useState<string>('')

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

	const poolId = router?.query?.poolId ?? 0
	const participantAddress = router?.query?.address ?? '0x'

	const queryClient = useQueryClient()

	const setWinnerMutation = useMutation({
		mutationFn: handleSetWinner,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId.toString()],
			})
		},
		onError: () => {
			throw new Error('setWinner Error')
		},
	})

	const savePayoutMutation = useMutation({
		mutationFn: handleSavePayout,
		onSuccess: () => {
			toast({
				title: 'Success',
				description: 'Saved Payout',
			})
			setInputValue('0')
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId.toString()],
			})
		},
		onError: () => {
			throw new Error('savePayout Error')
		},
	})

	const onPayoutButtonClicked = () => {
		toast({
			title: 'Requesting Transaction',
			description: 'Set Winner',
		})

		setWinnerMutation.mutate({
			params: [
				poolId.toString(),
				participantAddress.toString(),
				inputValue,
				wallets,
			],
		})
	}

	const onSavePayoutButtonClicked = () => {
		toast({
			title: 'Saving Payout',
			description: 'Saving payout',
		})

		savePayoutMutation.mutate({
			params: [
				poolId.toString(),
				ethers.parseEther(inputValue).toString(),
				participantAddress.toString(),
				currentJwt!,
			],
		})
	}

	useEffect(() => {
		if (ready && !authenticated) {
			router.push('/login')
		}

		if (profileData?.profileImageUrl) {
			setProfileImageUrl(profileData?.profileImageUrl)
		}
		setDisplayName(profileData?.userDisplayData.display_name ?? '')
		if (inputRef?.current) {
			inputRef.current.focus()
		}
	}, [profileData, ready, authenticated, router, inputRef, inputValue])

	return (
		<Page>
			<Appbar
				backRoute={parentRoute}
				pageTitle='User Profile'
				rightMenu={RightMenu.RefundMenu}
			/>
			<Section>
				<div
					className={`mt-20 flex min-h-screen w-full justify-center ${inter.className}`}
				>
					<div className='flex w-96 flex-col pb-8'>
						<div className='flex w-full justify-center'>
							{profileImageUrl && (
								<Image
									alt='profile'
									className='z-0 aspect-square w-24 rounded-full object-cover'
									src={profileImageUrl}
									width={96}
									height={96}
								/>
							)}
						</div>

						<div className='flex flex-row'>
							<h3 className='flex h-10 flex-1 flex-row items-center justify-center font-semibold'>
								{displayName}
							</h3>
						</div>
						<div className='flex flex-row justify-center'>
							<p>Checked in</p>
						</div>
						<div className='mt-2 flex h-16 flex-row justify-center '>
							<div className='relative flex justify-center '>
								<Input
									className='h-16 w-auto border-none text-center text-6xl font-bold'
									placeholder=''
									autoFocus={true}
									value={inputValue}
									type='number'
									onChange={handleInputChange}
									ref={inputRef}
									inputMode='numeric'
								/>
							</div>
						</div>
						<div className='mt-8 flex w-full flex-col items-center justify-center space-y-2'>
							<button
								className='h-10 w-48 rounded-full bg-black font-medium text-white'
								onClick={onSavePayoutButtonClicked}
							>
								Save
							</button>
							<button
								className='h-10 w-48 rounded-full bg-black font-medium text-white'
								onClick={onPayoutButtonClicked}
							>
								Payout
							</button>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default UserProfile
