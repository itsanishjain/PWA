import Appbar from '@/components/appbar'
import Page from '@/components/page'
import Section from '@/components/section'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
	fetchUserDisplayForAddress,
	handleRefundParticipant,
} from '@/lib/api/clientAPI'
import frogImage from '@/public/images/frog.png'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

const RefundUser = () => {
	const router = useRouter()
	const { ready, authenticated } = usePrivy()

	const { wallets } = useWallets()

	const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
		`${frogImage.src}`,
	)

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

	const refundParticipantMutation = useMutation({
		mutationFn: handleRefundParticipant,
		onSuccess: () => {
			toast({
				title: 'Transaction Successful',
				description: 'Refunded User',
			})
			setInputValue('0')
		},
		onError: () => {
			throw new Error('refundParticipant Error')
		},
	})

	const onRefundUserButtonClicked = () => {
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
			<Appbar backRoute={parentRoute} pageTitle='Refund Player' />
			<Section>
				<div
					className={`mt-20 flex min-h-screen w-full justify-center ${inter.className}`}
				>
					<div className='flex flex-col pb-8'>
						<div className='flex w-full justify-center'>
							{profileImageUrl && (
								<Image
									alt='profile'
									className='z-0 aspect-square w-24 rounded-full object-cover'
									src={profileImageUrl}
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
						<div className='mb-48 mt-auto flex w-full flex-row justify-between'>
							<div className='font-semibold md:text-2xl'>Refund</div>
							<div className='font-semibold md:text-2xl'>${inputValue}USD</div>
						</div>
						<div className='fixed bottom-5 left-1/2 flex w-full max-w-screen-md -translate-x-1/2 flex-row space-x-2 px-6 md:bottom-6'>
							<button
								className={`flex h-12 flex-1 items-center justify-center rounded-full bg-black px-4 py-2 text-center font-bold text-white focus:shadow-outline focus:outline-none `}
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
