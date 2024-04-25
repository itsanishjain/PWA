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

import { contractAddress, provider } from 'constants/constant'
import { config } from '@/constants/config'

import poolContract from '@/SC-Output/out/Pool.sol/Pool.json'

import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import DropdownChecklist from '@/components/dropdown-checklist'

import styles from './styles/pool.module.css'
import defaultPoolImage from '@/public/images/frog.png'
import qrCodeIcon from '@/public/images/qr_code_icon.svg'
import shareIcon from '@/public/images/share_icon.svg'
import editIcon from '@/public/images/edit_icon.svg'
import rightArrow from '@/public/images/right_arrow.svg'
import Divider from '@/components/divider'

const PoolPage = () => {
	const supabaseClient = createSupabaseBrowserClient()

	const router = useRouter()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	const [poolInfo, setPoolInfo] = useState([])
	const [userPoolStatus, setUserPoolStatus] = useState()

	const [copied, setCopied] = useState(false)

	const [pageUrl, setPageUrl] = useState('')

	async function readPoolStatus() {
		const poolId = router.query.poolId

		const { data, error } = await supabaseClient
			.from('pool_table') // Replace 'your_table_name' with your actual table name
			.select()
			.eq('pool_id', poolId)
		// .eq('participant_address', walletAddress)

		if (error) {
			console.error('Error reading data:', error)
		} else {
			console.log('Pool data', JSON.stringify(data))
			console.log('User Pool Status', data[0]?.status)

			setUserPoolStatus(data[0]?.status)
		}
	}
	const getPoolData = async () => {
		const contract = new ethers.Contract(
			contractAddress,
			poolContract.abi,
			provider,
		)
		const poolId = router.query.poolId
		const retrievedPoolInfo = await contract.getPoolInfo(poolId)
		// console.log('Pool Info', JSON.stringify(retrievedPoolInfo))
		setPoolInfo(retrievedPoolInfo)
	}

	useEffect(() => {
		// Update the document title using the browser API
		if (ready && authenticated) {
			const walletAddress = user!.wallet!.address
			console.log(`Wallet Address ${walletAddress}`)
			getPoolData()
			readPoolStatus()
		}
		setPageUrl(window?.location.href)
	}, [ready, authenticated])

	const handleJoinPool = async () => {
		console.log('handleJoinPool')
		console.log(`wallet address: ${user!.wallet!.address}`)

		const poolId = router.query.poolId
		let signedMessage
		try {
			signedMessage = await signMessage(`Join Pool: ${poolId}`)
		} catch (e: any) {
			console.log('User did not sign transaction')
		}
		const formData = {
			poolId,
			signedMessage,
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
				readPoolStatus()
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

	const handleDeposit = () => {
		console.log('handleDeposit')
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

	const handleStartPool = () => {}

	return (
		<Page>
			<Appbar />

			<Section>
				<div className='flex flex-col pt-16 w-96 min-h-screen items-center pb-20 md:pb-24'>
					<div
						className={`flex flex-col rounded-3xl ${styles.cardBackground} w-full p-4 md:p-10 md:space-y-10 space-y-4`}
					>
						<div className='relative rounded-3xl overflow-hidden'>
							<img
								src={`${defaultPoolImage.src}`}
								className='bg-black w-full h-full object-contain object-center'
							></img>
							<div className='w-full h-full bg-black absolute bottom-0 backdrop-filter backdrop-blur-sm bg-opacity-60 flex flex-col items-center justify-center space-y-3 md:space-y-6 text-white'>
								<h4 className='text-xs md:text-2xl'>Starts in</h4>
								<h3 className='text-4xl md:text-7xl font-semibold '>4 hours</h3>
							</div>
							<div className='absolute top-0 md:right-4 right-2  w-10 md:w-20  h-full flex flex-col items-center space-y-3 md:space-y-5 md:py-6 py-4 text-white'>
								<button className='rounded-full w-8 h-8  md:w-14 md:h-14 md:p-3 p-2 bg-black bg-opacity-40'>
									<img className='w-full h-full flex' src={qrCodeIcon.src} />
								</button>
								<button className='rounded-full w-8 h-8  md:w-14 md:h-14 md:p-3 p-2 bg-black bg-opacity-40'>
									<img className='w-full h-full flex' src={shareIcon.src} />
								</button>
								<button className='rounded-full w-8 h-8  md:w-14 md:h-14 md:p-3 p-2 bg-black bg-opacity-40'>
									<img className='w-full h-full flex' src={editIcon.src} />
								</button>
							</div>
							<div className='absolute bottom-0 bg-black bg-opacity-40 md:text-xl text-md w-full text-center flex items-center justify-center space-x-3 text-white md:py-3 py-1'>
								<div
									className={`${styles.dotBackground} rounded-full md:w-3 md:h-3 h-1.5 w-1.5`}
								></div>
								<div className='md:text-2xl text-xs'>Upcoming</div>
							</div>
						</div>
						<div className='flex flex-col space-y-6 md:space-y-12 '>
							<div className='flex flex-col space-y-2 md:space-y-4'>
								<h2 className='font-semibold text-lg md:text-4xl'>
									The Original Pool Poker Party
								</h2>
								<p className='text-sm md:text-2xl'>Today @ 6:00 PM</p>
								<p className='text-sm md:text-2xl font-semibold'>
									Hosted by Pool, Pepe, Solana
								</p>
							</div>
							<div className='text-sm md:text-3xl flex flex-col space-y-2 md:space-y-6 '>
								<div className='flex flex-rol justify-between'>
									<p>
										<span className='font-bold'>$825 </span>
										USDC Prize Pool
									</p>
									<p>135% funded</p>
								</div>
								<div className='w-full h-full flex'>
									<div
										style={{ width: '100%' }}
										className={`flex h-3 md:h-6 rounded-full ${styles.barBackground}`}
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
						className={`flex flex-col rounded-3xl mt-2 md:mt-4 ${styles.cardBackground} w-full px-4 md:px-10 py-4 md:py-8 `}
					>
						<h3 className='font-semibold text-sm md:text-2xl'>Description</h3>
						<Divider />
						<p className='md:text-2xl text-md'>
							The most lit party of the year. Join us at Pools First Annual
							Original Pool Party. Join all your friends at this unforgettable
							night filled with laughter drinks and poolin!
						</p>
						<h3 className='font-semibold text-sm md:text-2xl mt-8'>Buy-In</h3>
						<Divider />
						<p className='text-md md:text-2xl'>$35.00 USD</p>
						<h3 className='font-semibold text-sm md:text-2xl mt-8'>Terms</h3>
						<Divider />
						<p className='text-md md:text-2xl'>ww.lu.ma/pool-party-2024</p>
					</div>
					<div className='fixed bottom-5 md:bottom-6 left-1/2 transform -translate-x-1/2 w-96 md:px-0 md:w-full'>
						<button
							className={`bg-black w-full h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline `}
							onClick={handleStartPool}
						>
							Start Pool
						</button>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default PoolPage
