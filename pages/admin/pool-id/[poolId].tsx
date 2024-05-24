import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Appbar from '@/components/appbar'
import Page from '@/components/page'
import Section from '@/components/section'

import { usePrivy, useWallets } from '@privy-io/react-auth'

import CountdownTimer from '@/components/countdown'
import Divider from '@/components/divider'
import {
	fetchAllPoolDataFromDB,
	fetchAllPoolDataFromSC,
	fetchTokenSymbol,
	handleEnableDeposit,
	handleEndPool,
	handleStartPool,
} from '@/lib/api/clientAPI'
import { formatEventDateTime } from '@/lib/utils'
import editIcon from '@/public/images/edit_icon.svg'
import defaultPoolImage from '@/public/images/frog.png'
import qrCodeIcon from '@/public/images/qr_code_icon.svg'
import rightArrow from '@/public/images/right_arrow.svg'
import { Database } from '@/types/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'

import TransactionDialog from '@/components/transactionDialog'
import { useToast } from '@/components/ui/use-toast'

import PoolStatus from '@/components/poolStatus'
import ShareDialog from '@/components/shareDialog'
import { Progress } from '@/components/ui/progress'
import * as _ from 'lodash'
import Link from 'next/link'

export type PoolRow = Database['public']['Tables']['pool']['Row']
export type UserDisplayRow = Database['public']['Tables']['usersDisplay']['Row']

const AdminPoolPage = () => {
	const router = useRouter()

	const { ready, authenticated } = usePrivy()

	const { wallets } = useWallets()

	const [poolDbData, setPoolDbData] = useState<any>()
	const [poolImageUrl, setPoolImageUrl] = useState<string | null | undefined>()
	const [cohostDbData, setCohostDbData] = useState<any[]>([])
	const [transactionInProgress, setTransactionInProgress] =
		useState<boolean>(false)

	const [pageUrl, setPageUrl] = useState('')
	const [timeLeft, setTimeLeft] = useState<number>()

	const calculateTimeLeft = (startTime: string) => {
		const currentTimestamp: Date = new Date()
		const startDateObject: Date = new Date(startTime)
		const timeDiff = startDateObject.getTime() - currentTimestamp.getTime()
		setTimeLeft(timeDiff)
	}

	const { toast } = useToast()

	const poolId = router?.query?.poolId ?? 0
	const queryClient = useQueryClient()

	const { data: poolSCInfo } = useQuery({
		queryKey: ['fetchAllPoolDataFromSC', poolId.toString()],
		queryFn: fetchAllPoolDataFromSC,
		enabled: !!poolId,
	})

	const { data: poolDBInfo } = useQuery({
		queryKey: ['fetchAllPoolDataFromDB', poolId.toString()],
		queryFn: fetchAllPoolDataFromDB,
		enabled: !!poolId,
	})

	const poolSCDetail = poolSCInfo?.[1]
	const poolSCBalance = poolSCInfo
		? (BigInt(poolSCInfo?.[2][0]) / BigInt(1000000000000000000)).toString()
		: 0
	const poolSCName = poolSCInfo?.[1][2]
	const poolSCDepositPerPersonString = poolSCInfo
		? (BigInt(poolSCInfo?.[1][3]) / BigInt(1000000000000000000)).toString()
		: 0
	const poolSCStatus = poolSCInfo?.[3]
	const poolSCToken = poolSCInfo?.[4]
	const poolSCParticipants = poolSCInfo?.[5]

	const { data: tokenSymbol } = useQuery({
		queryKey: ['fetchTokenSymbol', poolSCToken],
		queryFn: fetchTokenSymbol,
		enabled: !_.isEmpty(poolSCToken),
	})

	useEffect(() => {
		setPoolDbData(poolDBInfo?.poolDBInfo)
		setCohostDbData(poolDBInfo?.cohostUserDisplayData ?? [])
		setPoolImageUrl(poolDBInfo?.poolImageUrl)

		setPageUrl(window?.location.href)
		calculateTimeLeft(poolDBInfo?.poolDBInfo?.event_timestamp)
	}, [ready, authenticated, poolSCInfo, poolDBInfo])

	const poolSCTimeStart = poolSCDetail?.[0]?.toString()
	const eventDate = formatEventDateTime(poolSCTimeStart) ?? ''

	const participantPercent =
		(poolSCParticipants?.length / poolDbData?.soft_cap) * 100

	const enableDepositMutation = useMutation({
		mutationFn: handleEnableDeposit,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId.toString()],
			})
		},
		onError: () => {
			throw new Error('enableDepositMutation Error')
		},
	})

	const startPoolMutation = useMutation({
		mutationFn: handleStartPool,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId.toString()],
			})
		},
		onError: () => {
			throw new Error('startPoolMutation Error')
		},
	})

	const endPoolMutation = useMutation({
		mutationFn: handleEndPool,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId.toString()],
			})
		},
		onError: () => {
			throw new Error('endPoolMutation Error')
		},
	})

	const onEnableDepositButtonClicked = () => {
		toast({
			title: 'Requesting Transaction',
			description: 'Enable Deposit',
		})
		enableDepositMutation.mutate({
			params: [poolId.toString(), wallets],
		})
	}

	const onStartPoolButtonClicked = () => {
		toast({
			title: 'Requesting Transaction',
			description: 'Start pool',
		})
		startPoolMutation.mutate({
			params: [poolId.toString(), wallets],
		})
	}

	const onEndPoolButtonClicked = () => {
		toast({
			title: 'Requesting Transaction',
			description: 'End pool',
		})

		endPoolMutation.mutate({
			params: [poolId.toString(), wallets],
		})
	}

	const cohostNames: string = cohostDbData
		.map((data: any) => data.display_name)
		.join(',')

	if (_.isEmpty(router.query.poolId)) {
		return <></>
	}
	return (
		<Page>
			<Appbar backRoute='/admin' />

			<Section>
				<div className='flex w-full flex-col items-center justify-center'>
					<div className='relative flex min-h-screen w-full flex-col items-center justify-center pb-20 pt-16 md:pb-24'>
						<div
							className={`cardBackground flex w-full flex-col space-y-4 rounded-3xl p-4 md:space-y-10 md:p-10`}
						>
							<div className='relative overflow-hidden rounded-3xl'>
								<Image
									alt='pool image'
									src={`${
										_.isEmpty(poolImageUrl)
											? defaultPoolImage.src
											: poolImageUrl
									}`}
									className='size-full bg-black object-contain object-center'
									fill
								/>
								<div className='absolute bottom-0 flex size-full flex-col items-center justify-center space-y-3 bg-black/60 text-white backdrop-blur-sm md:space-y-6'>
									{timeLeft != undefined && timeLeft > 0 && (
										<div>
											<h4 className='text-xs md:text-2xl'>Starts in</h4>
											<h3 className='text-4xl font-semibold md:text-7xl '>
												{<CountdownTimer timeleft={timeLeft} />}
											</h3>
										</div>
									)}
								</div>
								<div className='absolute right-2 top-0 flex  h-full w-10  flex-col items-center space-y-3 py-4 text-white md:right-4 md:w-20 md:space-y-5 md:py-6'>
									<Link
										href={`${pageUrl}/checkin-scan`}
										className='size-8 rounded-full bg-black/40 p-2 md:size-14 md:p-3'
									>
										<Image
											alt='qr code icon'
											className='flex size-full'
											src={qrCodeIcon.src}
											width={32}
											height={32}
										/>
									</Link>
									<ShareDialog />

									<button className='size-8 rounded-full bg-black/40 p-2 md:size-14 md:p-3'>
										<Image
											alt='edit icon'
											className='flex size-full'
											src={editIcon.src}
											width={32}
											height={32}
										/>
									</button>
								</div>
								<PoolStatus status={poolSCStatus} />
							</div>
							<div className='flex flex-col space-y-6 md:space-y-12 '>
								<div className='flex flex-col space-y-2 overflow-hidden md:space-y-4'>
									<h2 className='text-lg font-semibold md:text-4xl'>
										{/* {poolDbData?.pool_name} */}
										{poolSCName}
									</h2>
									<p className='text-sm md:text-2xl'>{eventDate}</p>
									<p className='w-full text-ellipsis text-sm font-semibold md:text-2xl'>
										Hosted by {cohostNames}
									</p>
								</div>
								<div className='flex flex-col space-y-2 text-sm md:space-y-6 md:text-3xl '>
									<div className='flex flex-col justify-between'>
										<p className='max-w-sm '>
											<span className='font-bold'>{poolSCBalance} </span>
											{tokenSymbol} Prize Pool
										</p>
										<p>{participantPercent.toPrecision(2)}% funded</p>
									</div>
									<Progress value={participantPercent} />
								</div>
								<div className='flex justify-between text-sm md:text-3xl'>
									<p className='flex flex-row space-x-2'>
										<span className='font-bold'>
											{poolSCParticipants?.length}
										</span>
										<span>Participants</span>
									</p>
									<Link
										className='flex flex-row items-center space-x-2 px-1 md:space-x-6 md:px-2'
										href={`${window.location.href}/participants`}
									>
										<span>View all</span>
										<span>
											<Image
												alt='right arrow'
												width={40}
												height={40}
												src={`${rightArrow.src}`}
											/>
										</span>
									</Link>
								</div>
								<Progress value={participantPercent} />
							</div>
						</div>

						<div
							className={`cardBackground mt-2 flex w-full flex-col rounded-3xl p-4 md:mt-4 md:px-10 md:py-8 `}
						>
							<h3 className='text-sm font-semibold md:text-2xl'>Description</h3>
							<Divider />
							<p className='text-base md:text-2xl'>{poolDbData?.description}</p>
							<h3 className='mt-8 text-sm font-semibold md:text-2xl'>Buy-In</h3>
							<Divider />
							<p className='text-base md:text-2xl'>
								{poolSCDepositPerPersonString} {tokenSymbol}
							</p>
							<h3 className='mt-8 text-sm font-semibold md:text-2xl'>Terms</h3>
							<Divider />
							<p className='text-base md:text-2xl'>
								{poolDbData?.link_to_rules}
							</p>
						</div>
						{poolSCStatus == 0 && (
							<div className='fixed bottom-5 left-1/2 flex w-full max-w-screen-md -translate-x-1/2 flex-row space-x-2 px-6 md:bottom-6'>
								<button
									className={`flex h-12 flex-1 items-center justify-center rounded-full bg-black px-4 py-2 text-center font-bold text-white focus:shadow-outline focus:outline-none `}
									onClick={onEnableDepositButtonClicked}
								>
									Enable Deposit
								</button>
							</div>
						)}
						{poolSCStatus == 1 && (
							<div className='fixed bottom-5 left-1/2 flex w-full max-w-screen-md -translate-x-1/2 flex-row space-x-2 px-6 md:bottom-6'>
								<button
									className={`flex h-12 flex-1 items-center justify-center rounded-full bg-black px-4 py-2 text-center font-bold text-white focus:shadow-outline focus:outline-none `}
									onClick={onStartPoolButtonClicked}
								>
									Start Pool
								</button>
							</div>
						)}
						{poolSCStatus == 2 && (
							<div className='fixed bottom-5 left-1/2 w-full max-w-screen-md -translate-x-1/2 px-6 md:bottom-6'>
								<button
									className={`h-12 w-full rounded-full bg-black px-4 py-2 font-bold text-white focus:shadow-outline focus:outline-none `}
									onClick={onEndPoolButtonClicked}
								>
									End Pool
								</button>
							</div>
						)}
					</div>
					{wallets?.[0]?.connectorType != 'embedded' && (
						<TransactionDialog
							open={transactionInProgress}
							showLoadAnimation={true}
							setOpen={setTransactionInProgress}
						/>
					)}
				</div>
			</Section>
		</Page>
	)
}

export default AdminPoolPage
