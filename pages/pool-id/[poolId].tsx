import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import Page from '@/components/page'
import Section from '@/components/section'
import Appbar from '@/components/appbar'

import { createBrowserClient } from '@supabase/ssr'

import QRCode from 'react-qr-code'

import {
	TransactionReceipt,
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'

import { useReadContract, createConfig, http } from 'wagmi'
import { readContract, readContracts } from '@wagmi/core'
import { foundry, hardhat, mainnet, sepolia } from 'viem/chains'
import { Interface, ethers } from 'ethers'

import {
	chain,
	tokenAddress,
	contractAddress,
	provider,
	dropletIFace,
	poolIFace,
} from 'constants/constant'
import { config } from '@/constants/config'

import poolContract from '@/SC-Output/out/Pool.sol/Pool.json'
import dropletContract from '@/SC-Output/out_old/Droplet.sol/Droplet.json'

import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import DropdownChecklist from '@/components/dropdown-checklist'

import defaultPoolImage from '@/public/images/frog.png'
import qrCodeIcon from '@/public/images/qr_code_icon.svg'
import shareIcon from '@/public/images/share_icon.svg'
import editIcon from '@/public/images/edit_icon.svg'
import tripleDotsIcon from '@/public/images/tripleDots.svg'

import rightArrow from '@/public/images/right_arrow.svg'
import Divider from '@/components/divider'
import { Tables, Database } from '@/types/supabase'
import {
	formatCountdownTime,
	formatEventDateTime,
	formatTimeDiff,
} from '@/lib/utils'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import CountdownTimer from '@/components/countdown'
import {
	fetchAllPoolDataFromSC,
	fetchPoolDataFromDB,
	fetchUserDisplayForAddress,
	fetchUserDisplayInfoFromServer,
} from '@/lib/api/clientAPI'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export type PoolRow = Database['public']['Tables']['pool']['Row']
export type UserDisplayRow = Database['public']['Tables']['usersDisplay']['Row']

const PoolPage = () => {
	const supabaseClient = createSupabaseBrowserClient()

	const router = useRouter()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	const [poolBalance, setPoolBalance] = useState<number>(0)
	const [poolParticipants, setPoolParticipants] = useState<number>(0)

	const [poolDbData, setPoolDbData] = useState<any | undefined>()
	const [poolImageUrl, setPoolImageUrl] = useState<String | undefined>()
	const [cohostDbData, setCohostDbData] = useState<any>([])

	const [copied, setCopied] = useState(false)

	const [pageUrl, setPageUrl] = useState('')
	const [timeLeft, setTimeLeft] = useState<number>()

	const calculateTimeLeft = (startTime: string) => {
		const currentTimestamp: Date = new Date()
		const startDateObject: Date = new Date(startTime)
		const timeDiff = startDateObject.getTime() - currentTimestamp.getTime()
		const { days, minutes, seconds } = formatTimeDiff(timeDiff)
		console.log('days', days)
		console.log('minutes', minutes)
		console.log('seconds', seconds)
		console.log('timeLeft', Math.floor(timeDiff / 1000))

		setTimeLeft(timeDiff)
	}

	const poolId = router.query.poolId ?? '0'
	const queryClient = useQueryClient()

	const { data: poolSCInfo } = useQuery({
		queryKey: ['fetchAllPoolDataFromSC', poolId?.toString()],
		queryFn: fetchAllPoolDataFromSC,
		enabled: !!poolId,
	})

	const { data: poolDBInfo } = useQuery({
		queryKey: ['fetchPoolDataFromDB', poolId?.toString()],
		queryFn: fetchPoolDataFromDB,
		enabled: !!poolId,
	})

	const poolSCAdmin = poolSCInfo?.[0]
	const poolSCDetail = poolSCInfo?.[1]
	let poolSCBalance = poolSCInfo
		? (BigInt(poolSCInfo?.[2][0]) / BigInt(1000000000000000000)).toString()
		: 0
	const poolSCName = poolSCInfo?.[1][2]
	const poolSCDepositPerPerson = poolSCInfo ? BigInt(poolSCInfo?.[1][3]) : 0
	const poolSCDepositPerPersonString = poolSCInfo
		? (BigInt(poolSCInfo?.[1][3]) / BigInt(1000000000000000000)).toString()
		: 0
	const poolSCStatus = poolSCInfo?.[3]
	const poolSCToken = poolSCInfo?.[4]
	let poolSCParticipants = poolSCInfo?.[5]
	const poolSCWinners = poolSCInfo?.[6]
	const isRegisteredOnSC =
		poolSCParticipants?.indexOf(wallets[0]?.address) !== -1

	useEffect(() => {
		// Update the document title using the browser API
		if (ready && authenticated) {
			const walletAddress = user!.wallet!.address
			console.log(`Wallet Address ${walletAddress}`)
		}
		console.log('participants', poolSCParticipants)

		setPoolDbData(poolDBInfo?.poolDBInfo)
		setCohostDbData(poolDBInfo?.cohostUserDisplayData)
		setPoolImageUrl(poolDBInfo?.poolImageUrl)

		console.log('poolDBInfo', poolDBInfo)
		setPageUrl(window?.location.href)
	}, [ready, authenticated, poolSCInfo, poolDBInfo])

	const handleRegisterServer = async () => {
		console.log('handleJoinPool')
		console.log(`wallet address: ${user!.wallet!.address}`)

		const poolId = router.query.poolId

		const formData = {
			poolId,
			walletAddress: user!.wallet!.address,
		}
		try {
			const response = await fetch('/api/join_pool', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			})

			if (response.ok) {
				console.log('Join success')
				const msg = await response.json()
				console.log(msg)
				// Handle success
				// fetchPoolDataFromDB()
			} else {
				console.error('Error sending data')
				// Handle error
			}
		} catch (error) {
			console.error('Error:', error)
			// Handle error
		}
	}

	const handleSharePool = () => {
		console.log('handleSharePool')
		copyToClipboard()
	}

	const copyToClipboard = async () => {
		console.log('copyToClipboard')

		try {
			await navigator.clipboard.writeText(pageUrl)
			setCopied(true)
		} catch (error) {
			console.error('Failed to copy:', error)
		}
	}

	const eventDate = formatEventDateTime(poolDbData?.event_timestamp!) ?? ''

	const handleRegister = async () => {
		const poolId = router.query.poolId

		let approveDropletDataString = dropletIFace.encodeFunctionData('approve', [
			contractAddress,
			poolSCDepositPerPerson,
		])
		const wallet = wallets[0] // Replace this with your desired wallet
		const address = wallet.address

		try {
			const provider = await wallet.getEthereumProvider()
			const signedTxn = await provider.request({
				method: 'eth_sendTransaction',
				params: [
					{
						from: address,
						to: tokenAddress,
						data: approveDropletDataString,
					},
				],
			})
			let transactionReceipt = null
			while (transactionReceipt === null) {
				transactionReceipt = await provider.request({
					method: 'eth_getTransactionReceipt',
					params: [signedTxn],
				})
				await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
			}
			console.log('Transaction confirmed!', transactionReceipt)
		} catch (e: any) {
			console.log('User did not sign transaction')
			return
		}

		let depositDataString = poolIFace.encodeFunctionData('deposit', [
			poolId,
			poolSCDepositPerPerson,
		])

		try {
			const provider = await wallet.getEthereumProvider()
			const signedTxn = await provider.request({
				method: 'eth_sendTransaction',
				params: [
					{
						from: address,
						to: contractAddress,
						data: depositDataString,
					},
				],
			})
			let transactionReceipt = null
			while (transactionReceipt === null) {
				transactionReceipt = await provider.request({
					method: 'eth_getTransactionReceipt',
					params: [signedTxn],
				})
				await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
			}
			console.log('Transaction confirmed!', transactionReceipt)
		} catch (e: any) {
			console.log('User did not sign transaction')
			return
		}

		handleRegisterServer()
	}

	const handleUnregisterServer = () => {}
	const handleUnregister = async () => {
		const wallet = wallets[0] // Replace this with your desired wallet
		const address = wallet.address

		let selfRefundDataString = poolIFace.encodeFunctionData('selfRefund', [
			poolId,
		])

		try {
			const provider = await wallet.getEthereumProvider()
			const signedTxn = await provider.request({
				method: 'eth_sendTransaction',
				params: [
					{
						from: address,
						to: contractAddress,
						data: selfRefundDataString,
					},
				],
			})
			let transactionReceipt = null
			while (transactionReceipt === null) {
				transactionReceipt = await provider.request({
					method: 'eth_getTransactionReceipt',
					params: [signedTxn],
				})
				await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds before checking again
			}
			console.log('Transaction confirmed!', transactionReceipt)
		} catch (e: any) {
			console.log('User did not sign transaction')
			return
		}

		handleUnregisterServer()
	}

	const unregisterMutation = useMutation({
		mutationFn: handleUnregister,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId?.toString() ?? ' '],
			})
		},
	})

	const registerMutation = useMutation({
		mutationFn: handleRegister,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['fetchAllPoolDataFromSC', poolId?.toString() ?? ' '],
			})
		},
	})

	// const percentFunded = poolDbData?.price
	// 	? poolBalance / (poolDbData?.soft_cap * poolDbData?.price)
	// 	: poolParticipants / poolDbData?.soft_cap

	const cohostNames: string = cohostDbData
		.map((data: any) => data.display_name)
		.join(',')

	return (
		<Page>
			<Appbar backRoute='/' />

			<Section>
				<div className='flex flex-col w-full justify-center items-center'>
					<div className='relative flex flex-col pt-16 w-full min-h-screen justify-center items-center pb-20 md:pb-24'>
						<div
							className={`flex flex-col rounded-3xl cardBackground w-full p-4 md:p-10 md:space-y-10 space-y-4`}
						>
							<div className='relative rounded-3xl overflow-hidden'>
								<img
									src={`${poolImageUrl ?? defaultPoolImage.src}`}
									className='bg-black w-full h-full object-contain object-center'
								></img>
								<div className='absolute top-0 md:right-4 right-2  w-10 md:w-20  h-full flex flex-col items-center space-y-3 md:space-y-5 md:py-6 py-4 text-white'>
									<button
										onClick={handleSharePool}
										className='rounded-full w-8 h-8  md:w-14 md:h-14 md:p-3 p-2 bg-black bg-opacity-40'
									>
										<img className='w-full h-full flex' src={shareIcon.src} />
									</button>
								</div>
								<div className='absolute bottom-0 bg-black bg-opacity-40 md:text-xl text-md w-full text-center flex items-center justify-center space-x-3 text-white md:py-3 py-1'>
									<div
										className={`dotBackground rounded-full md:w-3 md:h-3 h-1.5 w-1.5`}
									></div>
									<div className='md:text-2xl text-xs'>Upcoming</div>
								</div>
							</div>
							<div className='flex flex-col space-y-6 md:space-y-12 '>
								<div className='flex flex-col space-y-2 md:space-y-4 overflow-hidden'>
									<h2 className='font-semibold text-lg md:text-4xl'>
										{/* {poolDbData?.pool_name} */}
										{poolSCName}
									</h2>
									<p className='text-sm md:text-2xl'>{eventDate}</p>
									<p className='text-sm md:text-2xl w-full font-semibold overflow-ellipsis'>
										Hosted by {cohostNames}
									</p>
								</div>
								<div className='text-sm md:text-3xl flex flex-col space-y-2 md:space-y-6 '>
									<div className='flex flex-rol justify-between'>
										<p className='max-w-sm '>
											<span className='font-bold'>{poolSCBalance} </span>
											USDC Prize Pool
										</p>
										<p>{135}% funded</p>
									</div>
									<div className='w-full h-full flex'>
										<div
											style={{ width: '100%' }}
											className={`flex h-3 md:h-6 rounded-full barBackground`}
										></div>
									</div>
								</div>
								<div className='flex text-sm md:text-3xl justify-between'>
									<span className='font-bold'>Participants </span>
									<button className='flex flex-row items-center space-x-2 md:space-x-6 px-1 md:px-2'>
										<span>View all</span>
										<span>
											<img src={`${rightArrow.src}`}></img>
										</span>
									</button>
								</div>
							</div>
						</div>

						<div
							className={`flex flex-col rounded-3xl mt-2 md:mt-4 cardBackground w-full px-4 md:px-10 py-4 md:py-8 `}
						>
							<h3 className='font-semibold text-sm md:text-2xl'>Description</h3>
							<Divider />
							<p className='md:text-2xl text-md'>{poolDbData?.description}</p>
							<h3 className='font-semibold text-sm md:text-2xl mt-8'>Buy-In</h3>
							<Divider />
							<p className='text-md md:text-2xl'>
								${poolSCDepositPerPersonString} USD
							</p>
							<h3 className='font-semibold text-sm md:text-2xl mt-8'>Terms</h3>
							<Divider />
							<p className='text-md md:text-2xl'>{poolDbData?.link_to_rules}</p>
						</div>
						{isRegisteredOnSC ? (
							<div className='fixed flex space-x-2 flex-row bottom-5 md:bottom-6 left-1/2 transform -translate-x-1/2 max-w-screen-md w-full px-6'>
								<button
									className={`bg-black flex text-center justify-center items-center flex-1 h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline `}
									onClick={handleRegister} //TODO: Change function
								>
									View My Ticket
								</button>
								<button
									className={`bg-black flex w-12 h-12 items-center text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline `}
									onClick={() => unregisterMutation.mutate()}
								>
									<img
										className='flex w-full h-full'
										src={tripleDotsIcon.src}
									></img>
								</button>
							</div>
						) : (
							<div className='fixed bottom-5 md:bottom-6 left-1/2 transform -translate-x-1/2 max-w-screen-md w-full px-6'>
								<button
									className={`bg-black w-full h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline `}
									onClick={() => registerMutation.mutate()}
								>
									Register
								</button>
							</div>
						)}
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default PoolPage
