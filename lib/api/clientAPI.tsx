import { createClient } from '@supabase/supabase-js'
import Cookies from 'js-cookie'
import { ErrorInfo } from 'react'
import { decode } from 'jsonwebtoken'

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
	file: any,
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

	const { data, error } = await supabaseClient.storage
		.from('profile')
		.upload(`/public/${Date.now()}-test.png`, file)

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
