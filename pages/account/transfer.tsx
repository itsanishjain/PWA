import Page from '@/components/page'
import Section from '@/components/section'
import Image from 'next/image'
import poolImage from '@/public/images/pool.png'
import { useRouter } from 'next/router'
import {
	TransactionReceipt,
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'

import React, { useState, useEffect } from 'react'

import { ethers } from 'ethers'
import Appbar from '@/components/appbar'

import { FundWalletConfig } from '@privy-io/react-auth'

const Transfer = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()
	const [transferAmount, setTransferAmount] = useState('')
	const [recepientAddress, setRecepientAddress] = useState('')
	if (ready && !authenticated) {
		// Replace this code with however you'd like to handle an unauthenticated user
		// As an example, you might redirect them to a sign-in page
		router.push('/login')
	}

	const handleTransfer = async () => {
		const wallet = wallets[0]
		const unsignedTx = {
			to: recepientAddress,
			value: ethers.parseEther(transferAmount),
		}

		const uiConfig = {
			title: 'Send Transaction',
			description: `You are sending ${transferAmount} to ${recepientAddress}`,
			buttonText: 'Send',
		}
		try {
			const txReceipt: TransactionReceipt = await sendTransaction(
				unsignedTx,
				uiConfig,
			)
		} catch (e) {
			console.log(e)
		}
	}
	const handleTransferInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setTransferAmount(e.target.value)
	}

	const handleRecipientInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setRecepientAddress(e.target.value)
	}

	useEffect(() => {
		// Update the document title using the browser API
		if (wallets.length > 0) {
			console.log(`Wallet Length: ${wallets.length}`)
			console.log(`Wallet Address: ${wallets[0].address}`)
		}
	}, [wallets])

	return (
		<Page>
			<Appbar />
			<Section>
				<div className='flex justify-center h-full w-full items-center'>
					<div className='flex flex-col w-96 h-96'>
						<div className='flex row items-center w-full'>
							<Image className='mx-auto' src={poolImage} alt='pool image' />
						</div>
						<div className='flex flex-col space-y-8 items-center w-full mt-12 '>
							<input
								value={transferAmount}
								onChange={handleTransferInputChange}
								className='w-full outline-2 px-2 py-2'
								placeholder='transfer amount'
							/>
							<input
								value={recepientAddress}
								onChange={handleRecipientInputChange}
								className='w-full outline-2 px-2 py-2'
								placeholder='Recipient Address'
							/>
						</div>
						<div className='flex justify-between items-center h-full w-full mt-28 '>
							<button
								className='rounded-full gradient-background px-4 py-4'
								onClick={handleTransfer}
							>
								Send
							</button>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default Transfer
