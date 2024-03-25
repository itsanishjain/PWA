import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import Page from '@/components/page'
import Section from '@/components/section'
import Appbar from '@/components/appbar'

import poolWalletImage from '@/public/images/pool_wallet.png'

import {
	TransactionReceipt,
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'

// import { readContract, readContracts } from '@wagmi/core'
import { foundry, hardhat, mainnet, sepolia } from 'viem/chains'
import { createPublicClient, http } from 'viem'
// import { wagmiContractConfig } from '@/SC-Output/out/P'

import { Interface, ethers } from 'ethers'

import { contractAddress, chain, provider } from 'constants/constant'
import { config } from '@/constants/config'

import poolContract from '@/SC-Output/out/Pool.sol/Pool.json'

const CreatedPools = () => {
	const router = useRouter()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()
	let walletAddress = ''

	const [poolsData, setPoolsData] = useState([])

	// Replace this with the message you'd like your user to sign
	// Replace this with the text you'd like on your signature modal,
	// if you do not have `noPromptsOnSignature` enabled

	const getCreatedPoolsData = async (address: string) => {
		console.log('getCreatedPoolsData')
		const abi = new Interface(poolContract.abi)

		const contract = new ethers.Contract(
			contractAddress,
			poolContract.abi,
			provider,
		)

		try {
			const poolIds = await contract.getPoolsCreated(address)
			console.log('poolIds', poolIds)
			for (const poolId of poolIds) {
				let newPoolData = await contract.getPoolInfo(poolId)
				// newPoolData.push(poolId)
				let amendNewPoolData = [...newPoolData, poolId]
				console.log(`result: ${amendNewPoolData}`)
				setPoolsData((prevData) =>
					removeDuplicateRows([...prevData, amendNewPoolData]),
				)
			}
		} catch (error) {
			console.log(error)
		}
	}

	function removeDuplicateRows(array: any) {
		return array.filter((row: any, index: number) => {
			// Check if the current row is the first occurrence of the row in the array
			return (
				index ===
				array.findIndex((otherRow: any) => {
					// Convert both rows to strings for easy comparison
					return JSON.stringify(otherRow) === JSON.stringify(row)
				})
			)
		})
	}

	useEffect(() => {
		// Update the document title using the browser API
		if (ready && authenticated) {
			const walletAddress = user!.wallet!.address
			console.log(`Wallet Address ${walletAddress}`)
			getCreatedPoolsData(user?.wallet?.address!)
		}

		if (ready && !authenticated) {
			// Replace this code with however you'd like to handle an unauthenticated user
			// As an example, you might redirect them to a sign-in page
			router.push('/')
		}
	}, [ready, authenticated, user, router])

	const handleClick = (poolId: number) => {
		router.push(`/pool-id/${poolId}`)
	}
	;(BigInt.prototype as any).toJSON = function () {
		return this.toString()
	}

	return (
		<Page>
			<Appbar />

			<Section>
				<div className='flex flex-col pt-16 h-full w-full items-center'>
					{poolsData.map((item, index) => (
						<div
							key={index}
							className=' rounded  w-full h-44 shadow-sm'
							onClick={() => {
								handleClick(item[10])
							}}
						>
							<div className=' w-full h-full p-4'>
								<div>{item[0]}</div>
								<div>{item[1]}</div>
								<div>{item[2]}</div>
								<div>{item[3]}</div>
								<div>{item[4]}</div>
								<div>{item[5]}</div>
								<div>{item[6]}</div>
								<div>{item[7]}</div>
								<div>{item[8]}</div>
								<div>{item[9]}</div>
							</div>
						</div>
					))}
				</div>
			</Section>
		</Page>
	)
}

export default CreatedPools
