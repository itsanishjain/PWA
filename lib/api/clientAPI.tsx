import {
	contractAddress,
	dropletIFace,
	poolIFace,
	provider,
	tokenAddress,
} from '@/constants/constant'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { PostgrestSingleResponse, createClient } from '@supabase/supabase-js'
import { ethers } from 'ethers'
import { decode } from 'jsonwebtoken'

import dropletContract from '@/SC-Output/out/Droplet.sol/Droplet.json'
import poolContract from '@/SC-Output/out/Pool.sol/Pool.json'
import { ConnectedWallet } from '@privy-io/react-auth'
import * as lodash from 'lodash'

export interface writeTestObject {
	address: string
	jwt: any
}

export interface addressObject {
	address: string
}

export interface backendLoginObject {
	address: string
	message: string
	signedMessage: string
	nonce: string
}

export interface FileObj {
	name: string
	type: string
	data: Blob
}

const supabaseBrowserClient = createSupabaseBrowserClient()

export async function fetchNonce(addressObject: addressObject) {
	try {
		const response = await fetch('/api/nonce', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(addressObject),
		})
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const data = await response.json()
		return data
	} catch (error) {
		throw new Error(
			`There was a problem with the fetch operation: ${JSON.stringify(error)}`,
		)
	}
}

export async function fetchToken(backendLoginObj: backendLoginObject) {
	try {
		const response = await fetch('/api/backend_login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(backendLoginObj),
		})
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const data = await response.json()
		return data
	} catch (error) {
		throw new Error(
			`There was a problem with the fetch operation: ${JSON.stringify(error)}`,
		)
	}
}

export const uploadProfileImage = async (
	fileBlob: any,
	selectedFile: any,
	jwt: string,
) => {
	// Upload image to Supabase storage
	const supabaseClient = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			global: {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			},
		},
	)

	const jwtObj = decode(jwt, { json: true })

	const { data, error } = await supabaseClient.storage
		.from('profile')
		.upload(
			`/public/${jwtObj?.sub}/${Date.now()}-${selectedFile?.name}`,
			fileBlob,
		)

	if (error) {
		throw new Error(`Error uploading file: ${error.message}`)
	}

	// Update user profile with image URL
	const { error: userError } = await supabaseClient.from('usersDisplay').upsert(
		{ avatar_url: data.path, id: jwtObj?.sub, address: jwtObj?.address },
		{
			onConflict: 'id',
		},
	)

	if (userError) {
		throw new Error(`Error updating user data: ${userError.message}`)
	}
}

export const updateUserDisplayData = async (
	displayName: string,
	company: string,
	bio: string,
	jwt: string,
) => {
	// Upload image to Supabase storage
	const supabaseClient = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			global: {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			},
		},
	)

	const jwtObj = decode(jwt, { json: true })

	// Update user profile with image URL
	const { data: userData, error: userError } = await supabaseClient
		.from('usersDisplay')
		.upsert(
			{
				display_name: displayName,
				company: company,
				bio: bio,
				id: jwtObj!.sub,
				address: jwtObj!.address?.toLowerCase(),
			},
			{
				onConflict: 'id',
			},
		)

	if (userError) {
		throw new Error(`Error updating user data: ${userError.message}`)
	}
	return { userData, userError }
}

export const fetchUpcomingPools = async () => {
	// Upload image to Supabase storage
	const supabaseClient = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	)
	const currentTimestamp = new Date().toISOString()

	const { data, error } = await supabaseClient
		.from('pool')
		.select('*')
		.filter('event_timestamp', 'gte', currentTimestamp)

	if (error) {
		throw new Error(`Error fetching pool data: ${error.message}`)
	} else {
		return data
	}
}

export const fetchPastPools = async () => {
	// Upload image to Supabase storage
	const supabaseClient = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	)
	const currentTimestamp = new Date().toISOString()

	const { data, error } = await supabaseClient
		.from('pool')
		.select('*')
		.filter('event_timestamp', 'lt', currentTimestamp)

	if (error) {
		throw new Error(`Error fetching pool data: ${error.message}`)
	} else {
		return data
	}
}

export const fetchUserDisplayInfoFromServer = async (addressList: string[]) => {
	const lowerAddressList = addressList.map((address) => address?.toLowerCase())
	const { data, error }: PostgrestSingleResponse<any[]> =
		await supabaseBrowserClient
			.from('usersDisplay')
			.select()
			.in('address', lowerAddressList)

	if (error) {
		throw new Error(`Error reading data: ${error.message}`)
	} else {
		return data
	}
}

// This is a similar query as above, but using Tanstack
export const fetchParticipantsDataFromServer = async ({
	queryKey,
}: {
	queryKey: [string, string, string[]]
}) => {
	const [_, poolId, addressList] = queryKey
	const lowerAddressList = addressList.map((address) => address.toLowerCase())
	const { data, error }: PostgrestSingleResponse<any[]> =
		await supabaseBrowserClient
			.from('usersDisplay')
			.select()
			.in('address', lowerAddressList)
	if (error) {
		throw new Error(`Failed fetchParticipantsDataFromServer ${error.message}`)
	}

	const {
		data: participationData,
		error: participationError,
	}: PostgrestSingleResponse<any[]> = await supabaseBrowserClient
		.from('participantStatus')
		.select()
		.match({ pool_id: poolId })
		.in('participant_address', lowerAddressList)
	if (participationError) {
		throw new Error(
			`Failed fetchParticipantsDataFromServer ${participationError.message}`,
		)
	}

	const joinedData = data.map((row1) => {
		const matchingRows = participationData.filter(
			(row2) => row2.participant_address === row1.address,
		)
		return {
			...row1,
			participationData: matchingRows,
		}
	})

	return joinedData
}

export const fetchUserDisplayForAddress = async ({
	queryKey,
}: {
	queryKey: [string, string]
}) => {
	const [_, address] = queryKey

	const lowerAddress = address.toLowerCase()

	const { data: userDisplayData, error } = await supabaseBrowserClient
		.from('usersDisplay')
		.select('*')
		.eq('address', lowerAddress)
		.single()

	if (error) {
		throw new Error('Failed fetchUserDisplayForAddress')
	}
	if (userDisplayData?.avatar_url) {
		const { data: storageData } = supabaseBrowserClient.storage
			.from('profile')
			.getPublicUrl(userDisplayData?.avatar_url)

		return { userDisplayData, profileImageUrl: storageData.publicUrl }
	}
	return { userDisplayData }
}

export const fetchAllPoolDataFromSC = async ({
	queryKey,
}: {
	queryKey: [string, string]
}) => {
	const [_, poolId] = queryKey
	const contract = new ethers.Contract(
		contractAddress,
		poolContract.abi,
		provider,
	)

	const poolSCInfo = await contract.getAllPoolInfo(poolId)

	return poolSCInfo
}

export const fetchAllPoolDataFromDB = async ({
	queryKey,
}: {
	queryKey: [string, string]
}) => {
	const [_, poolId] = queryKey
	const { data, error }: PostgrestSingleResponse<any[]> =
		await supabaseBrowserClient
			.from('pool') // Replace 'your_table_name' with your actual table name
			.select()
			.eq('pool_id', poolId)

	if (error) {
		throw new Error(`Failed fetchPoolDataFromDB ${error.message}`)
	}

	if (data.length == 0) {
		throw new Error('Pool not found')
	}

	let poolImageUrl = null
	if (!lodash.isEmpty(data[0].pool_image_url)) {
		const { data: storageData } = supabaseBrowserClient.storage
			.from('pool')
			.getPublicUrl(data[0].pool_image_url)
		poolImageUrl = storageData.publicUrl
	}

	let cohostUserDisplayData
	if (data[0]?.co_host_addresses?.length > 0) {
		const cohostDisplayData = await fetchUserDisplayInfoFromServer(
			data[0]?.co_host_addresses,
		)
		cohostUserDisplayData = cohostDisplayData
	}

	return {
		poolDBInfo: data[0],
		poolImageUrl,
		cohostUserDisplayData,
	}
}

export const handleRegisterServer = async ({
	params,
}: {
	params: [string, string, string]
}) => {
	const [poolId, walletAddress, jwtString] = params

	const formData = {
		poolId,
		walletAddress,
		jwtString,
	}
	try {
		await fetch('/api/join_pool', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
	} catch (error) {
		throw new Error(`Failed handleRegisterServer ${JSON.stringify(error)}`)

		// Handle error
	}
}

export const handleUnregisterServer = async ({
	params,
}: {
	params: [string, string, string]
}) => {
	const [poolId, walletAddress, jwtString] = params

	const formData = {
		poolId,
		walletAddress,
		jwtString,
	}
	try {
		await fetch('/api/unjoin_pool', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
	} catch (error) {
		throw new Error(`Failed handleUnregisterServer ${JSON.stringify(error)}`)
	}
}

export const handleRegister = async ({
	params,
}: {
	params: [string, string, ConnectedWallet[]]
}) => {
	const [poolId, deposit, wallets] = params

	const walletAddress = wallets[0].address
	const wallet = wallets[0]
	const approveDropletDataString = dropletIFace.encodeFunctionData('approve', [
		contractAddress,
		deposit,
	])

	try {
		const provider = await wallet.getEthereumProvider()
		const signedTxn = await provider.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from: walletAddress,
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
	} catch (e: any) {
		throw new Error(`User did not sign transaction ${JSON.stringify(e)}`)
	}

	const depositDataString = poolIFace.encodeFunctionData('deposit', [
		poolId,
		deposit,
	])

	try {
		const provider = await wallet.getEthereumProvider()
		const signedTxn = await provider.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from: walletAddress,
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
	} catch (e: any) {
		throw new Error(`User did not sign transaction ${JSON.stringify(e)}`)
	}
}

export const handleUnregister = async ({
	params,
}: {
	params: [string, ConnectedWallet[]]
}) => {
	const [poolId, wallets] = params
	const wallet = wallets[0]
	const address = wallet.address
	const selfRefundDataString = poolIFace.encodeFunctionData('selfRefund', [
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
	} catch (e: any) {
		throw new Error('User did not sign transaction')
	}
}

export const fetchTokenSymbol = async ({
	queryKey,
}: {
	queryKey: [string, string]
}) => {
	const [_, poolTokenAddress] = queryKey
	const contract = new ethers.Contract(
		poolTokenAddress,
		dropletContract.abi,
		provider,
	)

	const tokenSymbol = await contract.symbol()
	return tokenSymbol
}

export const handleEnableDeposit = async ({
	params,
}: {
	params: [string, ConnectedWallet[]]
}) => {
	const [poolId, wallets] = params

	const walletAddress = wallets[0].address
	const wallet = wallets[0]
	const enableDepositDataString = poolIFace.encodeFunctionData(
		'enableDeposit',
		[poolId],
	)

	try {
		const provider = await wallet.getEthereumProvider()
		const signedTxn = await provider.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from: walletAddress,
					to: contractAddress,
					data: enableDepositDataString,
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
	} catch (e: any) {
		throw new Error('User did not sign transaction')
	}
}

export const handleStartPool = async ({
	params,
}: {
	params: [string, ConnectedWallet[]]
}) => {
	const [poolId, wallets] = params

	const walletAddress = wallets[0].address
	const wallet = wallets[0]
	const startPoolDataString = poolIFace.encodeFunctionData('startPool', [
		poolId,
	])

	try {
		const provider = await wallet.getEthereumProvider()
		const signedTxn = await provider.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from: walletAddress,
					to: contractAddress,
					data: startPoolDataString,
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
	} catch (e: any) {
		throw new Error('User did not sign transaction')
	}
}

export const handleEndPool = async ({
	params,
}: {
	params: [string, ConnectedWallet[]]
}) => {
	const [poolId, wallets] = params

	const walletAddress = wallets[0].address
	const wallet = wallets[0]
	const endPoolDataString = poolIFace.encodeFunctionData('endPool', [poolId])

	try {
		const provider = await wallet.getEthereumProvider()
		const signedTxn = await provider.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from: walletAddress,
					to: contractAddress,
					data: endPoolDataString,
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
	} catch (e: any) {
		throw new Error('User did not sign transaction')
	}
}

export const handleSetWinner = async ({
	params,
}: {
	params: [string, string, string, ConnectedWallet[]]
}) => {
	const [poolId, winnerAddress, amount, wallets] = params

	const walletAddress = wallets[0].address
	const wallet = wallets[0]
	const setWinnerDataString = poolIFace.encodeFunctionData('setWinner', [
		poolId,
		winnerAddress,
		ethers.parseEther(amount),
	])

	try {
		const provider = await wallet.getEthereumProvider()
		const signedTxn = await provider.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from: walletAddress,
					to: contractAddress,
					data: setWinnerDataString,
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
	} catch (e: any) {
		throw new Error('User did not sign transaction')
	}
}

export const handleSavePayout = async ({
	params,
}: {
	params: [string, string, string, string]
}) => {
	const [poolId, amount, winnerAddress, jwt] = params

	const dataObj = { poolId, winnerAddress, amount, jwtString: jwt }
	try {
		const response = await fetch('/api/save_payout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataObj),
		})
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const data = await response.json()
		return data
	} catch (error) {
		throw new Error(
			`There was a problem with the post operation ${JSON.stringify(error)}`,
		)
	}
}

export const handleRefundParticipant = async ({
	params,
}: {
	params: [string, string, string, ConnectedWallet[]]
}) => {
	const [poolId, winnerAddress, amount, wallets] = params

	const walletAddress = wallets[0].address
	const wallet = wallets[0]
	const setWinnerDataString = poolIFace.encodeFunctionData(
		'refundParticipant',
		[poolId, winnerAddress, ethers.parseEther(amount)],
	)

	try {
		const provider = await wallet.getEthereumProvider()
		const signedTxn = await provider.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from: walletAddress,
					to: contractAddress,
					data: setWinnerDataString,
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
	} catch (e: any) {
		throw new Error('User did not sign transaction')
	}
}

export const fetchWinnersDetailsFromSC = async ({
	queryKey,
}: {
	queryKey: [string, string]
}) => {
	const [_, poolId] = queryKey
	const contract = new ethers.Contract(
		contractAddress,
		poolContract.abi,
		provider,
	)

	const winnersDetails = await contract.getWinnersDetails(poolId)
	return winnersDetails
}

export const fetchClaimablePoolsFromSC = async ({
	queryKey,
}: {
	queryKey: [string, string]
}) => {
	const [_, address] = queryKey
	const contract = new ethers.Contract(
		contractAddress,
		poolContract.abi,
		provider,
	)

	const claimablePools = await contract.getClaimablePools(address)
	return claimablePools
}

export const fetchPoolBalanceFromSC = async ({
	queryKey,
}: {
	queryKey: [string, string]
}) => {
	const [_, poolId] = queryKey
	const contract = new ethers.Contract(
		contractAddress,
		poolContract.abi,
		provider,
	)

	const poolBalance = await contract.poolBalance(poolId)
	return poolBalance
}

export const fetchSavedPayoutsFromServer = async ({
	queryKey,
}: {
	queryKey: [string, string]
}) => {
	const [_, poolId] = queryKey
	const { data: savedPayouts, error }: PostgrestSingleResponse<any[]> =
		await supabaseBrowserClient
			.from('savedPayouts')
			.select('*')
			.match({ pool_id: poolId })
	if (error) {
		throw new Error(`Failed fetchSavedPayoutsFromServer ${error.message}`)
	}

	return savedPayouts
}

export const handleSetWinners = async ({
	params,
}: {
	params: [string, string[], string[], ConnectedWallet[]]
}) => {
	const [poolId, winnerAddresses, amounts, wallets] = params

	const walletAddress = wallets[0].address
	const wallet = wallets[0]
	const amountsArray = amounts.map(
		(amount) => amount.toString(),

		// Math.floor(parseFloat(ethers.formatEther(amount))).toString(),
	)

	const setWinnersDataString = poolIFace.encodeFunctionData('setWinners', [
		poolId,
		winnerAddresses,
		amountsArray,
	])
	try {
		const provider = await wallet.getEthereumProvider()
		const signedTxn = await provider.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from: walletAddress,
					to: contractAddress,
					data: setWinnersDataString,
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
	} catch (e: any) {
		throw new Error('User did not sign transaction')
	}
}

export const handleDeleteSavedPayouts = async ({
	params,
}: {
	params: [string, string[], string[], string]
}) => {
	const [poolId, winnerAddresses, amounts, jwt] = params

	const dataObj = { poolId, winnerAddresses, amounts, jwtString: jwt }
	try {
		const response = await fetch('/api/delete_payout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataObj),
		})
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const data = await response.json()
		return data
	} catch (error) {
		throw new Error(
			`There was a problem with the post operation ${JSON.stringify(error)}`,
		)
	}
}

export const handleDeleteParticipant = async ({
	params,
}: {
	params: [string, string, string]
}) => {
	const [poolId, address, jwt] = params

	const dataObj = { poolId, address, jwtString: jwt }
	try {
		const response = await fetch('/api/delete_participant', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataObj),
		})
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const data = await response.json()
		return data
	} catch (error) {
		throw new Error(
			`There was a problem with the post operation ${JSON.stringify(error)}`,
		)
	}
}

export const handleCheckIn = async ({
	data,
	jwt,
}: {
	data: string
	jwt: string
}) => {
	// const [poolId, address, jwt] = params
	const qrDataObj: any = JSON.parse(data)
	const dataObj = {
		poolId: qrDataObj?.poolId,
		address: qrDataObj?.address,
		jwtString: jwt,
	}
	try {
		const response = await fetch('/api/check_in', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dataObj),
		})
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const data = await response.json()
		return data
	} catch (error) {
		throw new Error(
			`There was a problem with the post operation ${JSON.stringify(error)}`,
		)
	}
}

export const handleClaimWinning = async ({
	params,
}: {
	params: [string, ConnectedWallet[]]
}) => {
	const [poolId, wallets] = params

	const walletAddress = wallets[0].address
	const wallet = wallets[0]
	const claimWinningDataString = poolIFace.encodeFunctionData('claimWinning', [
		poolId,
		walletAddress,
	])

	try {
		const provider = await wallet.getEthereumProvider()
		const signedTxn = await provider.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from: walletAddress,
					to: contractAddress,
					data: claimWinningDataString,
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
	} catch (e: any) {
		throw new Error('User did not sign transaction')
	}
}

export const handleClaimWinnings = async ({
	params,
}: {
	params: [string[], ConnectedWallet[]]
}) => {
	const [poolIds, wallets] = params

	const walletAddress = wallets[0].address
	const wallet = wallets[0]
	const walletAddresses = poolIds.map((_poolId) => walletAddress)
	const claimWinningDataString = poolIFace.encodeFunctionData('claimWinnings', [
		poolIds,
		walletAddresses,
	])

	try {
		const provider = await wallet.getEthereumProvider()
		const signedTxn = await provider.request({
			method: 'eth_sendTransaction',
			params: [
				{
					from: walletAddress,
					to: contractAddress,
					data: claimWinningDataString,
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
	} catch (e: any) {
		throw new Error('User did not sign transaction')
	}
}
