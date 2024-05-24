import { createClient } from '@supabase/supabase-js'
import { decode } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Parse the request body
	const requestData = await req.body
	const { poolId, address, jwtString } = requestData

	const walletAddressLower = address.toLowerCase()

	// Return a response
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

	let jwtAddress: string = '0x'
	try {
		const jwtObj = decode(jwtString, { json: true })
		jwtAddress = jwtObj!.address
	} catch (error) {
		res.status(500).json({ error: 'Failed to decode Jwt.' })
		throw new Error('Failed to decode Jwt.')
	}

	const { data: existingData } = await supabaseAdminClient
		.from('pool')
		.select('*')
		.match({
			pool_id: poolId,
		})

	if (
		existingData?.[0]?.['host_address'] != jwtAddress &&
		existingData?.[0]?.['co_host_addresses'].indexOf(jwtAddress) == -1
	) {
		res.status(500).json({ message: 'Error' })
		throw new Error('Unauthorized')
	}

	async function upsertData() {
		const { data: existingData } = await supabaseAdminClient
			.from('participantStatus')
			.select('*')
			.match({
				pool_id: poolId,
				participant_address: walletAddressLower,
			})

		if (existingData?.length === 0) {
			res.status(500).json({ error: 'Internal Server Error' })
		} else {
			// Update the existing row
			const { error: updateError } = await supabaseAdminClient
				.from('participantStatus')
				.update({
					participant_address: walletAddressLower,
					status: 2,
					pool_id: poolId,
				})
				.match({
					pool_id: poolId,
					participant_address: walletAddressLower,
				})

			if (updateError) {
				res.status(500).json({ error: 'Internal Server Error' })
				throw new Error(updateError.message)
			}
		}
	}

	await upsertData()
	res.status(200).json({ message: 'Success' })
}
