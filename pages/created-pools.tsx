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

import poolContract from '@/Smart-Contracts/out/Pool.sol/Pool.json'

const CreatedPools = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	let walletAddress = ''
	// Replace this with the message you'd like your user to sign
	// Replace this with the text you'd like on your signature modal,
	// if you do not have `noPromptsOnSignature` enabled
	if (ready && !authenticated) {
		// Replace this code with however you'd like to handle an unauthenticated user
		// As an example, you might redirect them to a sign-in page
		router.push('/')
	}

	const getCreatedPoolsData = async () => {
		const provider = new ethers.JsonRpcProvider()

		const ethersPoolContract = new ethers.Contract(
			walletAddress,
			poolContract.abi,
			provider,
		)
		const result = ethersPoolContract.getPoolsCreated(walletAddress)
		console.log(`Pools ${result}`)
	}

	if (ready && authenticated) {
		walletAddress = user!.wallet!.address
		getCreatedPoolsData()
	}

	useEffect(() => {
		// Update the document title using the browser API
	}, [])

	return (
		<Page>
			<Appbar />

			<Section>
				<div className='flex flex-col pt-16 h-full w-full items-center'>
					<div>1</div>
					<div>1</div>

					<div>1</div>
				</div>
			</Section>
		</Page>
	)
}

export default CreatedPools
