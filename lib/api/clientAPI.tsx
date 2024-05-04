import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'
import { ErrorInfo } from 'react'
import { decode } from 'jsonwebtoken'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { UserDisplayRow } from '@/pages/pool-id/[poolId]'
import { QueryFunction } from '@tanstack/react-query'
import { ethers } from 'ethers'
import { contractAddress, provider } from '@/constants/constant'

import poolContract from '@/SC-Output/out/Pool.sol/Pool.json'
import dropletContract from '@/SC-Output/out_old/Droplet.sol/Droplet.json'

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

const supabaseClient = createSupabaseBrowserClient()

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
		console.error('There was a problem with the fetch operation:', error)
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
		console.error('There was a problem with the fetch operation:', error)
	}
}

export async function writeTest(address: writeTestObject) {
	const token = Cookies.get('token')

	try {
		const response = await fetch('/api/test_write', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			credentials: 'include',
			body: JSON.stringify(address),
		})
		if (!response.ok) {
			throw new Error('Network response was not ok')
		}
		const data = await response.json()
		return data
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error)
	}
}

export const uploadProfileImage = async (
	fileBlob: any,
	selectedFile: any,
	address: string,
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

	const jwtObj = decode(jwt)
	console.log('jwtObj', jwtObj)
	console.log('file name', fileBlob.name)
	console.log('selectedFile', selectedFile)

	const { data, error } = await supabaseClient.storage
		.from('profile')
		.upload(
			`/public/${jwtObj!.sub}/${Date.now()}-${selectedFile.name}`,
			fileBlob,
		)

	if (error) {
		console.error('Error uploading image:', error.message)
		return
	}
	console.log('Image uploaded successfully')

	// Update user profile with image URL

	const { data: userData, error: userError } = await supabaseClient
		.from('usersDisplay')
		.upsert(
			{ avatar_url: data.path, id: jwtObj!.sub },
			{
				onConflict: 'id',
			},
		)

	if (userError) {
		console.error('Error updating user data:', userError.message)
	}

	console.log('usersDisplay updated successfully')
}

export const updateUserDisplayData = async (
	displayName: string,
	company: string,
	bio: string,
	jwt: string,
	address: string,
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

	const jwtObj = decode(jwt)
	console.log('jwtObj', jwtObj)

	// Update user profile with image URL

	const { data: userData, error: userError } = await supabaseClient
		.from('usersDisplay')
		.upsert(
			{
				display_name: displayName,
				company: company,
				bio: bio,
				id: jwtObj!.sub,
				address: address.toLowerCase(),
			},
			{
				onConflict: 'id',
			},
		)

	if (userError) {
		console.error('Error updating user data:', userError.message)
	}

	console.log('usersDisplay Information updated successfully')
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
		console.error('Error fetching pool data:', error.message)
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
		console.error('Error fetching pool data:', error.message)
	} else {
		return data
	}
}

export const fetchUserDisplayInfoFromServer = async (addressList: string[]) => {
	console.log('addressList', addressList)
	const lowerAddressList = addressList.map((address) => address.toLowerCase())
	const { data, error }: PostgrestSingleResponse<any[]> = await supabaseClient
		.from('usersDisplay')
		.select()
		.in('address', lowerAddressList)

	if (error) {
		console.error('Error reading data:', error)
		return
	} else {
		console.log('fetchUserDisplayInfoFromServer data:', data)
		return data
	}
}

export const fetchProfileUrlForAddress = async ({
	queryKey,
}: {
	queryKey: [string, string]
}) => {
	const [_, address] = queryKey
	const lowerAddress = address.toLowerCase()
	const { data: userDisplayData, error } = await supabaseClient
		.from('usersDisplay')
		.select('*')
		.filter('address', 'eq', lowerAddress)
		.single()
	if (error) {
		console.error('Error reading data:', error)
		return { userDisplayData: '', profileImageUrl: '' }
	}
	if (userDisplayData?.avatar_url) {
		const { data: storageData } = await supabaseClient.storage
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

	console.log('retrievedAllPoolInfo', poolSCInfo)
	console.log('retrievedAllPoolInfo[0]', poolSCInfo[0])
	console.log('retrievedAllPoolInfo[1]', poolSCInfo[1])
	console.log('retrievedAllPoolInfo[2]', poolSCInfo[2])
	console.log('retrievedAllPoolInfo[3]', poolSCInfo[3])
	console.log('retrievedAllPoolInfo[4]', poolSCInfo[4])
	console.log('retrievedAllPoolInfo[5]', poolSCInfo[5])
	console.log('retrievedAllPoolInfo[6]', poolSCInfo[6])
	return poolSCInfo
}

// export const testAsyncFunction = async () => {
// 	console.log('Hello')
// 	await 'asdf'
// }
