import { createClient } from '@supabase/supabase-js'
import { hashMessage, recoverAddress } from 'ethers'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { message, signedMessage, nonce, address } = req.body

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

	const addressLower = address.toLowerCase()

	const recoveredAddress = recoverAddress(hashMessage(message), signedMessage)

	if (recoveredAddress.toLowerCase() != addressLower) {
		return res
			.status(401)
			.json({ message: 'Address does not match signature address' })
	}

	const { data } = await supabaseAdminClient
		.from('users')
		.select('*')
		.eq('address', addressLower)

	if (data == null || data[0].auth.genNonce != nonce) {
		return res
			.status(401)
			.json({ message: 'Address does not match signature address' })
	}

	let userId = data[0].id
	if (data[0].id == '' || data[0].id == null || data[0].id == undefined) {
		const { data: user, error: createUserError } =
			await supabaseAdminClient.auth.admin.createUser({
				email: `${addressLower}@email.com`,
				user_metadata: { address: addressLower },
				email_confirm: true,
			})

		if (createUserError) {
			return res.status(401).json({ message: 'Unable to create user' })
		}

		userId = user.user?.id

		const { error: updateIdError } = await supabaseAdminClient
			.from('users')
			.update({ id: userId })
			.eq('address', addressLower)

		if (updateIdError) {
			return res.status(401).json({ message: 'Unable to create user' })
		}

		// TODO: Should only update usersDisplayDataa when creating user?
	}

	const { error: updateUsersDisplayError } = await supabaseAdminClient
		.from('usersDisplay')
		.upsert({ id: userId, address: addressLower })
		.match({
			id: userId,
		})

	if (updateUsersDisplayError) {
		return res.status(401).json({ message: 'Unable to create user' })
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
		.eq('address', addressLower) // primary key
	if (updateUserError) {
		return res
			.status(401)
			.json({ message: 'Address does not match signature address' })
	}

	const token = jwt.sign(
		{
			address: addressLower, // this will be read by RLS policy
			sub: userId,
			aud: 'authenticated',
			role: 'authenticated',
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
		},
		process.env.SUPABASE_JWT!,
		// { expiresIn: jwtDuration },
	)
	res.status(200).json({ token })
}
