import { createClient } from '@supabase/supabase-js'
import { decode } from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Parse the request body
	const requestData = await req.body
	const { poolId, winnerAddress, amount, jwtString } = requestData

	const walletAddressLower = winnerAddress.toLowerCase()

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
			.from('savedPayouts')
			.select('*')
			.match({
				pool_id: poolId,
				address: winnerAddress,
			})

		if (existingData?.length === 0) {
			// Insert a new row
			const { error: insertError } = await supabaseAdminClient
				.from('savedPayouts')
				.insert({
					address: walletAddressLower,
					payout_amount: amount,
					pool_id: poolId,
				})
			if (insertError) {
				res.status(500).json({ message: 'Error' })
				throw new Error('Error inserting data')
			}
		} else {
			// Update the existing row
			const { error: updateError } = await supabaseAdminClient
				.from('savedPayouts')
				.update({
					address: walletAddressLower,
					payout_amount: amount,
					pool_id: poolId,
				})
				.match({
					pool_id: poolId,
					address: walletAddressLower,
				})

			if (updateError) {
				res.status(500).json({ error: 'Internal Server Error' })
				throw new Error('Error updating data')
			}
		}
	}

	async function deleteData() {
		const { error: deleteError } = await supabaseAdminClient
			.from('savedPayouts')
			.delete()
			.match({
				pool_id: poolId,
				address: winnerAddress,
			})

		if (deleteError) {
			res.status(500).json({ error: 'Internal Server Error' })
			throw new Error(deleteError.message)
		}
	}

	if (amount == 0) {
		await deleteData()
	} else {
		await upsertData()
	}
	res.status(200).json({ message: 'Success' })
}
