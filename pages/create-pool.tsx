import Page from '@/components/page'
import Section from '@/components/section'
import Image from 'next/image'
import poolWalletImage from '@/public/images/pool_wallet.png'
import { useRouter } from 'next/router'
import {
	TransactionReceipt,
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'

import React, { useState, useEffect } from 'react'
import {
	localChain,
	localnetTokenAddress,
	localnetContractAddress,
} from 'constants/constant'

import { ethers } from 'ethers'
import Appbar from '@/components/appbar'

const CreatePool = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	// Replace this with the message you'd like your user to sign
	// Replace this with the text you'd like on your signature modal,
	// if you do not have `noPromptsOnSignature` enabled
	if (ready && !authenticated) {
		// Replace this code with however you'd like to handle an unauthenticated user
		// As an example, you might redirect them to a sign-in page
		router.push('/')
	}

	const handleCreatePool = async () => {
		const abiCoder = new ethers.AbiCoder()
		let dataString = abiCoder.encode(
			['address', 'string'],
			[tokenAddressInputValue, poolNameInputValue],
		)
		const uiConfig = {
			title: 'Create Pool',
			description: 'This will allow you to create a pool',
			buttonText: 'Sign',
		}
		// const signature = await signMessage(message, uiConfig)

		const unsignedTx: UnsignedTransactionRequest = {
			to: localnetContractAddress,
			chainId: localChain.id,
			data: dataString,
		}

		const txReceipt: TransactionReceipt = await sendTransaction(
			unsignedTx,
			uiConfig,
		)

		setPoolNameInputValue('')
		router.push('/created-pools')
	}
	const handleJoinPool = () => {}
	const handleSharePool = () => {}
	const handleSignOut = () => {
		logout()
	}

	useEffect(() => {
		// Update the document title using the browser API
		if (wallets.length > 0) {
			console.log(`Wallet Length: ${wallets.length}`)
			console.log(`Wallet Address: ${wallets[0].address}`)
		}
	}, [])

	const [tokenAddressInputValue, setTokenAddressInputValue] =
		useState(localnetTokenAddress)
	const [poolNameInputValue, setPoolNameInputValue] = useState('')

	return (
		<Page>
			<Appbar />

			<Section>
				<div className='flex justify-center h-full w-full items-center'>
					<div className='flex flex-col w-96 h-96'>
						<div className='flex row items-center w-full'>
							<Image
								className='mx-auto'
								src={poolWalletImage}
								alt='pool image'
							/>
						</div>

						<form className='flex justify-center gap-2 items-center flex-col mt-16 h-full w-full '>
							<div className='w-full'>
								<label>Pool Name</label>
								<input
									className='shadow appearance-none border rounded w-full row py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
									id='poolName'
									type='text'
									placeholder='Pool Name'
									value={poolNameInputValue}
									onChange={(event) => {
										setPoolNameInputValue(event.target.value)
									}}
								/>
							</div>
							<div className='w-full'>
								<label>Token Address</label>
								<input
									className='shadow appearance-none border rounded w-full flex row py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
									id='tokenAddress'
									type='text'
									placeholder='Token Address'
									value={tokenAddressInputValue}
									onChange={(event) => {
										setTokenAddressInputValue(event.target.value)
									}}
								/>
							</div>
						</form>
						<button
							className='rounded-lg py-2  gradient-background mt-12'
							onClick={handleCreatePool}
						>
							Confirm
						</button>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default CreatePool
