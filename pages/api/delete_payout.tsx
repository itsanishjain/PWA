import { createClient } from '@supabase/supabase-js'
import { decode } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Parse the request body
	const requestData = await req.body
	const { poolId, winnerAddresses, amounts, jwtString } = requestData

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

	async function deleteData(pool_id: string, address: string, amount: number) {
		const { data: poolData } = await supabaseAdminClient
			.from('pool')
			.select('*')
			.match({
				pool_id: pool_id,
			})

		if (
			poolData?.[0]?.['host_address'] != jwtAddress &&
			poolData?.[0]?.['co_host_addresses'].indexOf(jwtAddress) == -1
		) {
			res.status(500).json({ message: 'Error' })
			throw new Error('Unauthorized')
		}

		// Use supabase to delete the data
		const { error: deleteError } = await supabaseAdminClient
			.from('savedPayouts')
			.delete()
			.match({
				pool_id: pool_id,
				address: address,
				payout_amount: amount,
			})

		if (deleteError) {
			res.status(500).json({ error: deleteError.message })
			throw new Error(deleteError.message)
		}
	}
	// Write for loop
	for (let i = 0; i < winnerAddresses.length; i++) {
		await deleteData(poolId, winnerAddresses[i].toLowerCase(), amounts[i])
	}

	res.status(200).json({ message: 'Success' })
}
