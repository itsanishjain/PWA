import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Appbar from '@/components/appbar'
import Page from '@/components/page'
import Section from '@/components/section'
import Image from 'next/image'

import { usePrivy, useWallets } from '@privy-io/react-auth'

import { ethers } from 'ethers'

import defaultPoolImage from '@/public/images/frog.png'
import tripleDotsIcon from '@/public/images/tripleDots.svg'
import userUnregisterIcon from '@/public/images/user_delete.svg'

import Divider from '@/components/divider'
import { useCookie } from '@/hooks/cookie'
import {
	fetchAllPoolDataFromDB,
	fetchAllPoolDataFromSC,
	fetchTokenSymbol,
	fetchUserDisplayForAddress,
	fetchWinnersDetailsFromSC,
	handleClaimWinning,
	handleRegister,
	handleRegisterServer,
	handleUnregister,
	handleUnregisterServer,
} from '@/lib/api/clientAPI'
import {
	dictionaryToNestedArray,
	formatEventDateTime,
	getAllIndicesMatching,
	getRowsByColumnValue,
	getValuesFromIndices,
} from '@/lib/utils'
import rightArrow from '@/public/images/right_arrow.svg'
import { Database } from '@/types/supabase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import TransactionDialog from '@/components/transactionDialog'
import circleTick from '@/public/images/circle-tick.svg'

import { useToast } from '@/components/ui/use-toast'

import PoolStatus from '@/components/poolStatus'
import ShareDialog from '@/components/shareDialog'
import { Progress } from '@/components/ui/progress'
import * as _ from 'lodash'

import AvatarImage from '@/components/avatarImage'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

export type PoolRow = Database['public']['Tables']['pool']['Row']
export type UserDisplayRow = Database['public']['Tables']['usersDisplay']['Row']

const PoolPage = () => {
	const router = useRouter()

	const { ready, authenticated } = usePrivy()

	const { wallets } = useWallets()

	const [, setWinnerAddresses] = useState<string[]>([])
	const [, setWinnerDetails] = useState<string[][] | null>([[]])

	const [poolDbData, setPoolDbData] = useState<any>()
	const [poolImageUrl, setPoolImageUrl] = useState<string | null | undefined>()
	const [cohostDbData, setCohostDbData] = useState<any[]>([])
	const [transactionInProgress, setTransactionInProgress] =
		useState<boolean>(false)

	const [, setPageUrl] = useState('')

	const { currentJwt } = useCookie()

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

	const poolSCAdmin = poolSCInfo?.[0]
	const poolSCDetail = poolSCInfo?.[1]

	const poolSCBalance = poolSCInfo
		? (
				BigInt(poolSCInfo?.[2][0]) / BigInt('1_000_000_000_000_000_000')
			).toString()
		: 0
	const poolSCName = poolSCInfo?.[1][2]
	const poolSCDepositPerPerson = poolSCInfo ? BigInt(poolSCInfo?.[1][3]) : 0
	const poolSCDepositPerPersonString = poolSCInfo
		? (
				BigInt(poolSCInfo?.[1][3]) / BigInt('1_000_000_000_000_000_000')
			).toString()
		: 0
	const poolSCStatus = poolSCInfo?.[3]
	const poolSCToken = poolSCInfo?.[4]
	const poolSCParticipants = poolSCInfo?.[5]

	const isRegisteredOnSC =
		poolSCParticipants?.indexOf(wallets[0]?.address) !== -1

	const { data: tokenSymbol } = useQuery({
		queryKey: ['fetchTokenSymbol', poolSCToken],
		queryFn: fetchTokenSymbol,
		enabled: !_.isEmpty(poolSCToken),
	})

	const { data: poolWinnersDetails } = useQuery({
		queryKey: ['fetchWinnersDetailsFromSC', poolId?.toString() ?? ' '],
		queryFn: fetchWinnersDetailsFromSC,
		enabled: !!poolId,
	})

	const matchingAddressIndices = getAllIndicesMatching(
		poolWinnersDetails?.[0],
		wallets[0]?.address,
	)
	const userWonDetails = getValuesFromIndices(
		poolWinnersDetails?.[1],
		matchingAddressIndices,
	)

	const claimableDetails = getRowsByColumnValue(userWonDetails, 3, false)
	const totalWinningAmount = userWonDetails?.reduce(
		(acc: number, curr: any) => acc + curr[0],
		BigInt(0),
	)

	const { data: adminData } = useQuery({
		queryKey: ['loadProfileImage', poolSCAdmin?.[0]?.toString() ?? ' '],
		queryFn: fetchUserDisplayForAddress,
		enabled: !_.isEmpty(poolSCAdmin?.[0]?.toString()),
	})

	useEffect(() => {
		setPoolDbData(poolDBInfo?.poolDBInfo)
		setCohostDbData(poolDBInfo?.cohostUserDisplayData ?? [])
		setPoolImageUrl(poolDBInfo?.poolImageUrl)
		setWinnerAddresses(poolWinnersDetails?.[0])

		setWinnerDetails(dictionaryToNestedArray(poolWinnersDetails?.[1]))

		setPageUrl(window?.location.href)
	}, [ready, authenticated, poolSCInfo, poolDBInfo, poolWinnersDetails])

	const poolSCTimeStart = poolSCDetail?.[0]?.toString()
	const eventDate = formatEventDateTime(poolSCTimeStart) ?? '0'

	const registerServerMutation = useMutation({
		mutationFn: handleRegisterServer,
		onSuccess: () => {
			toast({
				title: 'Registration Suceessful',
				description: 'You have joined the pool.',
			})
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromDB', poolId.toString()],
			})
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId?.toString()],
			})
		},
	})

	const registerMutation = useMutation({
		mutationFn: handleRegister,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId.toString()],
			})
			registerServerMutation.mutate({
				params: [poolId.toString(), wallets[0]?.address, currentJwt ?? ' '],
			})
		},
		onError: () => {
			throw new Error('registerMutation Error')
		},
	})

	const unregisterServerMutation = useMutation({
		mutationFn: handleUnregisterServer,
		onSuccess: () => {
			toast({
				title: 'Withdrawal Suceessful',
				description: 'You have successfully withdrawn from the pool.',
			})
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromDB', poolId.toString()],
			})
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId?.toString()],
			})
		},
	})

	const unregisterMutation = useMutation({
		mutationFn: handleUnregister,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId.toString()],
			})
			unregisterServerMutation.mutate({
				params: [poolId.toString(), wallets[0]?.address, currentJwt ?? ' '],
			})
		},
	})

	const claimMutation = useMutation({
		mutationFn: handleClaimWinning,
		onSuccess: () => {
			toast({
				title: 'Transaction Suceess',
				description: 'You have claimed your winnings.',
			})

			queryClient.invalidateQueries({
				queryKey: ['fetchWinnersDetailsFromSC', poolId?.toString() ?? ' '],
			})
		},
		onError: () => {
			throw new Error('claimMutation Error')
		},
	})

	const participantPercent =
		(poolSCParticipants?.length / poolDbData?.soft_cap) * 100

	const viewTicketClicked = () => {
		const currentRoute = router.asPath
		router.push(`${currentRoute}/ticket`)
	}

	const onRegisterButtonClicked = (e: any) => {
		toast({
			title: 'Requesting Transaction/s',
			description: 'Approve spending of token, followed by depositing token.',
		})
		registerMutation.mutate({
			params: [poolId.toString(), poolSCDepositPerPerson.toString(), wallets],
		})
	}

	const onUnregisterButtonClicked = (e: any) => {
		toast({
			title: 'Requesting Transaction',
			description: 'Withdrawing from pool',
		})

		unregisterMutation.mutate({
			params: [poolId.toString(), wallets],
		})
	}

	const onClaimButtonClicked = (e: any) => {
		toast({
			title: 'Requesting Transaction/s',
			description: 'Approve claiming prize',
		})
		claimMutation.mutate({
			params: [poolId.toString(), wallets],
		})
	}

	if (_.isEmpty(router.query.poolId)) {
		return <></>
	}
	return (
		<Page>
			<Appbar backRoute='/' />

			<Section>
				<div className='flex w-full flex-col items-center justify-center'>
					<div className='relative flex min-h-screen w-full flex-col items-center justify-center pb-20 pt-16 md:pb-24'>
						<div
							className={`cardBackground flex w-full flex-col space-y-4 rounded-3xl p-4 md:space-y-10 md:p-10`}
						>
							<div className='relative overflow-hidden rounded-3xl'>
								<Image
									alt='pool'
									src={`${
										_.isEmpty(poolImageUrl)
											? defaultPoolImage.src
											: poolImageUrl
									}`}
									className='size-full bg-black object-contain object-center'
								/>
								<div className='absolute right-2 top-0 flex  h-full w-10  flex-col items-center space-y-3 py-4 text-white md:right-4 md:w-20 md:space-y-5 md:py-6'>
									<ShareDialog />
								</div>
								<PoolStatus status={poolSCStatus} />
							</div>
							<div className='flex flex-col space-y-6 md:space-y-12 '>
								<div className='flex flex-col space-y-2 overflow-hidden md:space-y-4'>
									<h2 className='text-lg font-semibold md:text-4xl'>
										{poolSCName}
									</h2>
									<p className='text-sm md:text-2xl'>{eventDate}</p>
									<div className='w-full text-ellipsis text-sm font-semibold md:text-2xl'>
										Hosted by
										<ul className='mt-4 flex flex-col space-y-2'>
											<li className='flex flex-row items-center space-x-4 font-medium'>
												<div className='size-12'>
													<AvatarImage address={poolSCAdmin?.[0]?.toString()} />
												</div>
												<span>{adminData?.userDisplayData?.display_name}</span>
											</li>
											{cohostDbData?.map((data: any) => {
												return (
													<li
														className='flex flex-row items-center space-x-4 font-medium'
														key={data?.address}
													>
														<div className='size-12'>
															<AvatarImage address={data?.address} />
														</div>
														<span>{data?.display_name}</span>
													</li>
												)
											})}
										</ul>
									</div>
								</div>
								<div className='flex flex-col space-y-2 text-sm md:space-y-6 md:text-3xl '>
									<div className='flex flex-row justify-between'>
										<p className='max-w-sm '>
											<span className='font-bold'>{poolSCBalance} </span>
											{tokenSymbol} Prize Pool
										</p>
										<p>{participantPercent.toPrecision(2)}% funded</p>
									</div>
									<Progress value={participantPercent} />
								</div>
								<div className='flex flex-col space-y-4 text-sm md:text-3xl'>
									<p className='flex flex-row space-x-2'>
										<span>Participants</span>
									</p>

									<Link
										href={`${router?.asPath}/participants`}
										className='flex flex-row justify-between'
									>
										<div>
											{poolSCParticipants?.length ?? 0 <= 5 ? (
												<div className='relative flex h-12 w-full flex-row md:h-14'>
													{poolSCParticipants?.map(
														(address: any, index: number) => {
															return (
																<div
																	className={`absolute size-12 rounded-full bg-white p-0.5 md:size-14`}
																	style={{
																		zIndex: index + 1,
																		left: index * 36,
																	}}
																	key={address}
																>
																	<AvatarImage address={address} />
																</div>
															)
														},
													)}
												</div>
											) : (
												<div className='relative flex h-12 w-full flex-row'>
													{poolSCParticipants?.map(
														(address: string, index: number) => {
															if (index >= 4) {
																return <></>
															}
															return (
																<div
																	className={`absolute size-12 rounded-full bg-white p-0.5 md:size-14 `}
																	style={{
																		zIndex: index + 1,
																		left: index * 36,
																	}}
																	key={address}
																>
																	<AvatarImage address={address} />
																</div>
															)
														},
													)}
													<div
														className={`absolute size-12 rounded-full bg-white p-0.5 md:size-14`}
														style={{ zIndex: 5, left: 4 * 36 }}
													>
														<div className='numParticipantBackground text-white'>{`+ ${
															poolSCParticipants?.length - 4
														}`}</div>
													</div>
												</div>
											)}
										</div>
										<div className='flex flex-row items-center'>
											<span>
												<Image alt='right arrow' src={`${rightArrow.src}`} />
											</span>
											{/* </button> */}
										</div>
									</Link>
								</div>
							</div>
						</div>
						{userWonDetails?.length > 0 && (
							<div
								className={`cardBackground mt-2 flex w-full flex-col space-y-4 rounded-3xl p-4 md:mt-4 md:px-10 md:py-8`}
							>
								<div className='flex flex-row items-center justify-between'>
									<div className=' flex flex-row space-x-2'>
										<span className='flex items-center'>
											<Image
												alt='circle tick'
												className='size-5'
												src={circleTick.src}
											/>
										</span>
										<span className='font-semibold'>Winner</span>
									</div>
									<div>
										${ethers.formatEther(totalWinningAmount?.toString())}
									</div>
								</div>

								{claimableDetails?.length > 0 && (
									<button
										className='barForeground rounded-full py-3 font-medium text-white'
										onClick={onClaimButtonClicked}
									>
										Claim
									</button>
								)}
							</div>
						)}

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
						{isRegisteredOnSC ? (
							<div className='fixed bottom-5 left-1/2 z-50 flex w-full max-w-screen-md -translate-x-1/2 flex-row space-x-2 px-6 md:bottom-6'>
								<button
									className={`focus:shadow-outline flex h-12 flex-1 items-center justify-center rounded-full bg-black px-4 py-2 text-center font-bold text-white focus:outline-none `}
									onClick={viewTicketClicked}
								>
									View My Ticket
								</button>

								<DropdownMenu>
									<DropdownMenuTrigger>
										<div className='size-12 rounded-full bg-black p-3'>
											<Image
												alt='triple dots menu'
												className='flex size-full'
												src={tripleDotsIcon.src}
											/>
										</div>
									</DropdownMenuTrigger>
									<DropdownMenuContent sideOffset={16}>
										<DropdownMenuItem onClick={onUnregisterButtonClicked}>
											<div className='flex flex-row space-x-2'>
												<span>
													<Image
														alt='user unregister'
														className='flex size-full'
														src={userUnregisterIcon.src}
													/>
												</span>
												<span>Unregister from Pool</span>
											</div>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						) : (
							poolSCStatus == 1 && (
								<div className='fixed bottom-5 left-1/2 z-50 w-full max-w-screen-md -translate-x-1/2 px-6 md:bottom-6'>
									<button
										className={`focus:shadow-outline h-12 w-full rounded-full bg-black px-4 py-2 font-bold text-white focus:outline-none `}
										onClick={onRegisterButtonClicked}
									>
										Register
									</button>
								</div>
							)
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

export default PoolPage
