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

import { useReadContract, createConfig, http } from 'wagmi'
import { readContract, readContracts } from '@wagmi/core'
import { foundry, hardhat, mainnet, sepolia } from 'viem/chains'
import { Interface, ethers } from 'ethers'

import {
	localChain,
	localnetTokenAddress,
	localnetContractAddress,
} from 'constants/constant'
import { config } from '@/constants/config'

import poolContract from '@/Smart-Contracts/out/Pool.sol/Pool.json'

const PoolPage = () => {
	const router = useRouter()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()
	let walletAddress = ''

	const [poolInfo, setPoolInfo] = useState([])

	// Replace this with the message you'd like your user to sign
	// Replace this with the text you'd like on your signature modal,
	// if you do not have `noPromptsOnSignature` enabled

	const getPoolData = async () => {
		const abi = new Interface(poolContract.abi)
		const provider = new ethers.JsonRpcProvider()
		const contract = new ethers.Contract(
			localnetContractAddress,
			poolContract.abi,
			provider,
		)
		const poolId = router.query.poolId
		const retrievedPoolInfo = await contract.getPoolInfo(poolId)

		setPoolInfo(retrievedPoolInfo)
	}

	useEffect(() => {
		// Update the document title using the browser API
		if (ready && authenticated) {
			walletAddress = user!.wallet!.address
			console.log(`Wallet Address ${walletAddress}`)
			getPoolData()
		}
	}, [ready, authenticated])

	const handleJoinPool = () => {
		// poolId
	}

	const handleSharePool = () => {}
	return (
		<Page>
			<Appbar />

			<Section>
				<div className='flex flex-col pt-16 h-full w-full items-center'>
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
							<button
								className='bg-green-400 rounded-md px-4 py-2'
								onClick={() => handleJoinPool}
							>
								Join Pool
							</button>
						</div>
						<div className='flex flex-col items-end w-full mt-4'>
							<button
								className='bg-pink-500 rounded-md px-4 py-2'
								onClick={() => handleSharePool}
							>
								Share Pool
							</button>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default PoolPage
