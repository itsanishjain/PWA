import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import Page from '@/components/page'
import Section from '@/components/section'
import Appbar from '@/components/appbar'

import { createBrowserClient } from '@supabase/ssr'

import poolWalletImage from '@/public/images/pool_wallet.png'

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

import { createClient } from '@/utils/supabase/client'
import DropdownChecklist from '@/components/dropdown-checklist'

const PoolPage = () => {
	const supabaseClient = createClient()

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

	const copyToClipboard = async () => {
		console.log('copyToClipboard')

		try {
			await navigator.clipboard.writeText(pageUrl)
			setCopied(true)
		} catch (error) {
			console.error('Failed to copy:', error)
		}
	}

	return (
		<Page>
			<Appbar />

			<Section>
				<div className='flex flex-col pt-16 w-full items-center'>
					<div className=' rounded  w-full shadow-sm p-4'>
						<div className=' w-full'>
							<div>{poolInfo[0]}</div>
							<div>{poolInfo[1]}</div>
							<div>{poolInfo[2]}</div>
							<div>{poolInfo[3]}</div>
							<div>{poolInfo[4]}</div>
							<div>{poolInfo[5]}</div>
							<div>{poolInfo[6]}</div>
						</div>
						<div className='flex flex-col items-end w-full mt-8'>
							{userPoolStatus != 1 ? (
								<button
									className='bg-green-400 rounded-md px-4 py-2'
									onClick={handleJoinPool}
								>
									Join Pool
								</button>
							) : (
								<button
									disabled={true}
									className='outline rounded-lg py-2 px-4'
								>
									Joined
								</button>
							)}
						</div>
						<div className='flex flex-col items-end w-full mt-4'>
							<button
								className='bg-pink-500 rounded-md px-4 py-2 text-white'
								onClick={handleSharePool}
							>
								Share Pool
							</button>
						</div>
						<div>
							<div
								style={{
									height: 'auto',
									margin: '0 auto',
									maxWidth: 64,
									width: '100%',
								}}
							>
								<QRCode
									size={256}
									style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
									value={pageUrl}
									viewBox={`0 0 256 256`}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className=' rounded  w-full shadow-sm p-4 mt-4 mb-12'>
					<div className='flex flex-col'>
						<h1 className='font-bold text-2xl'>Admin </h1>
						<div className='p-12 w-full flex justify-center'>
							<div className='rounded-full bg-gray-300 h-32 w-32' />
						</div>
						<h2 className='text-xl w-full text-center'>Ready Game</h2>
						<div className='mt-8 w-full flex justify-center'>
							<button className='rounded-2xl w-96 h-16 bg-blue-400'>
								Start Game
							</button>
						</div>
						<div className='mt-8 w-full flex justify-center'>
							<DropdownChecklist />
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default PoolPage
