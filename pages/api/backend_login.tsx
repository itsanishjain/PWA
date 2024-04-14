import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { hashMessage, recoverAddress, verifyMessage } from 'ethers'
import { createBrowserClient } from '@supabase/ssr'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { jwtDuration } from '@/constants/constant'

type ResponseData = {
	message: string
}

interface RequestData {
	name: string
	email: string
	// Add other properties as needed
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { message, signedMessage, nonce, address } = req.body
	const supabaseClient = createSupabaseBrowserClient()

	const supabaseAdminClient = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_KEY!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		},
	)

	console.log('message', message)
	console.log('signedMessage', signedMessage)
	console.log('nonce', nonce)
	console.log('address', address)

	const recoveredAddress = recoverAddress(hashMessage(message), signedMessage)
	console.log('recoveredAddress', recoveredAddress)

	if (recoveredAddress != address) {
		return res
			.status(401)
			.json({ message: 'Address does not match signature address' })
	}

	const { data, error } = await supabaseAdminClient
		.from('users')
		.select('*')
		.eq('address', address)

	console.log('data', data)

	if (data == null || data![0].auth.genNonce != nonce) {
		return res
			.status(401)
			.json({ message: 'Address does not match signature address' })
	}

	let userId = data![0].id
	console.log('Retrieved userId', userId)
	if (data![0].id == '' || data![0].id == null || data![0].id == undefined) {
		const { data: user, error: createUserError } =
			await supabaseAdminClient.auth.admin.createUser({
				email: `${address}@email.com`,
				user_metadata: { address: address },
				email_confirm: true,
			})

		if (createUserError) {
			console.log('createUserError', createUserError.message)
			return res.status(401).json({ message: 'Unable to create user' })
		}

		userId = user.user?.id
		console.log('New Auth User', user)

		const { data, error: updateIdError } = await supabaseAdminClient
			.from('users')
			.update({ id: userId })
			.eq('address', address)

		if (updateIdError) {
			console.log('updateIdError', updateIdError.message)
			return res.status(401).json({ message: 'Unable to create user' })
		}
	}

	// 5. insert response into public.users table with id

	const newNonce = Math.floor(Math.random() * 1000000)

	const { error: updateUserError } = await supabaseAdminClient
		.from('users')
		.update({
			auth: {
				genNonce: newNonce, // update the nonce, so it can't be reused
				lastAuth: new Date().toISOString(),
				lastAuthStatus: 'success',
			},
			id: userId, // same uuid as auth.users table
		})
		.eq('address', address) // primary key
	if (updateUserError) {
		console.log('updateUserError', updateUserError.message)
		return res
			.status(401)
			.json({ message: 'Address does not match signature address' })
	}
	const token = jwt.sign(
		{
			address: address, // this will be read by RLS policy
			sub: userId,
			aud: 'authenticated',
		},
		process.env.SUPABASE_JWT!,
		{ expiresIn: jwtDuration },
	)
	console.log('Sending Token')
	res.status(200).json({ token })
}
