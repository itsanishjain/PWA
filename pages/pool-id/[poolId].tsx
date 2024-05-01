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
} from 'constants/constant'
import { config } from '@/constants/config'

import poolContract from '@/SC-Output/out/Pool.sol/Pool.json'

import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import DropdownChecklist from '@/components/dropdown-checklist'

import defaultPoolImage from '@/public/images/frog.png'
import qrCodeIcon from '@/public/images/qr_code_icon.svg'
import shareIcon from '@/public/images/share_icon.svg'
import editIcon from '@/public/images/edit_icon.svg'
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

export type PoolRow = Database['public']['Tables']['pool']['Row']

const PoolPage = () => {
	const supabaseClient = createSupabaseBrowserClient()

	const router = useRouter()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	const [poolBalance, setPoolBalance] = useState<number>(0)
	const [poolDbData, setPoolDbData] = useState<PoolRow | undefined>()
	const [poolImageUrl, setPoolImageUrl] = useState<String | undefined>()

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

	async function fetchPoolInfoFromServer() {
		const poolId = router.query.poolId

		const { data, error }: PostgrestSingleResponse<any[]> = await supabaseClient
			.from('pool') // Replace 'your_table_name' with your actual table name
			.select()
			.eq('pool_id', poolId)
		// .eq('participant_address', walletAddress)

		if (error) {
			console.error('Error reading data:', error)
			return
		}

		console.log('Pool data', JSON.stringify(data))
		if (data.length == 0) {
			console.log('No Such Pool')
			return
		}
		setPoolDbData(data[0])
		console.log('timestamp', data[0]?.event_timestamp)
		calculateTimeLeft(data[0]?.event_timestamp)

		if (data[0].pool_image_url != null && data[0].pool_image_url != undefined) {
			const { data: storageData } = supabaseClient.storage
				.from('pool')
				.getPublicUrl(data[0].pool_image_url)
			setPoolImageUrl(storageData.publicUrl)
			console.log('storageData', storageData)

			console.log('poolImageUrl', storageData.publicUrl)
		}
	}
	const getPoolDataFromSC = async () => {
		const contract = new ethers.Contract(
			contractAddress,
			poolContract.abi,
			provider,
		)
		const poolId = router.query.poolId
		const retrievedPoolBalance = await contract.getPoolBalance(poolId)
		console.log('retrievedPoolBalance', retrievedPoolBalance)

		setPoolBalance(Number(retrievedPoolBalance))
	}

	useEffect(() => {
		// Update the document title using the browser API
		if (ready && authenticated) {
			const walletAddress = user!.wallet!.address
			console.log(`Wallet Address ${walletAddress}`)
			getPoolDataFromSC()
			fetchPoolInfoFromServer()
		}

		setPageUrl(window?.location.href)
	}, [ready, authenticated])

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
				fetchPoolInfoFromServer()
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

		const iface = new Interface(poolContract.abi)
		const dataString = iface.encodeFunctionData('deposit', [
			poolId,
			poolDbData?.price,
		])

		const uiConfig = {
			title: 'Register',
			description: `You agree to pay the registration fee of ${poolDbData?.price} to join the pool`,
			buttonText: 'Sign',
		}

		const unsignedTx: UnsignedTransactionRequest = {
			to: contractAddress,
			chainId: chain.id,
			data: dataString,
		}
		try {
			const txReceipt: TransactionReceipt = await sendTransaction(
				unsignedTx,
				uiConfig,
			)
		} catch (e: any) {
			console.log(e.message)
			return
		}

		handleRegisterServer()
	}

	return (
		<Page>
			<Appbar />

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
								<div className='w-full h-full bg-black absolute bottom-0 backdrop-filter backdrop-blur-sm bg-opacity-60 flex flex-col items-center justify-center space-y-3 md:space-y-6 text-white'>
									<h4 className='text-xs md:text-2xl'>Starts in</h4>
									<h3 className='text-4xl md:text-7xl font-semibold '>
										{timeLeft != undefined && (
											<CountdownTimer initialTime={timeLeft} />
										)}
									</h3>
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
										{poolDbData?.pool_name}
									</h2>
									<p className='text-sm md:text-2xl'>{eventDate}</p>
									<p className='text-sm md:text-2xl w-full font-semibold overflow-ellipsis'>
										Hosted by {poolDbData?.co_host_addresses}
									</p>
								</div>
								<div className='text-sm md:text-3xl flex flex-col space-y-2 md:space-y-6 '>
									<div className='flex flex-rol justify-between'>
										<p>
											<span className='font-bold'>{poolBalance} </span>
											USDC Prize Pool
										</p>
										<p>135% funded</p>
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
							<p className='text-md md:text-2xl'>${poolDbData?.price} USD</p>
							<h3 className='font-semibold text-sm md:text-2xl mt-8'>Terms</h3>
							<Divider />
							<p className='text-md md:text-2xl'>{poolDbData?.link_to_rules}</p>
						</div>
						<div className='fixed bottom-5 md:bottom-6 left-1/2 transform -translate-x-1/2 max-w-screen-md w-full px-6'>
							<button
								className={`bg-black w-full h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline `}
								onClick={handleRegister}
							>
								Register
							</button>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default PoolPage
