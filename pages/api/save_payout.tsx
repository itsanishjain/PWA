import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { JwtPayload, decode } from 'jsonwebtoken'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Parse the request body
	const requestData = await req.body
	const { poolId, winnerAddress, amount, jwtString } = requestData

	const walletAddressLower = winnerAddress.toLowerCase()
	console.log('jwt', JSON.stringify(jwtString))

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
		console.error(error)
		res.status(500).json({ error: 'Failed to decode Jwt.' })
		return
	}

	async function savePayout() {
		const { data: existingData, error: selectError } = await supabaseAdminClient
			.from('pool')
			.select('*')
			.match({
				pool_id: poolId,
			})

		if (
			existingData?.[0]?.['host_address'] != jwtAddress &&
			existingData?.[0]?.['co_host_addresses'].indexOf(jwtAddress) == -1
		) {
			console.error('Not authorised to save payouts')
			res.status(500).json({ message: 'Error' })

			return
		} else {
			const { data: insertedData, error: insertError } =
				await supabaseAdminClient.from('savedPayouts').insert({
					address: walletAddressLower,
					payout_amount: amount,
					pool_id: poolId,
				})
			if (insertError) {
				console.log('Error inserting into savedPayouts')
				res.status(500).json({ message: 'Error' })
			}
		}
	}

	await savePayout()
	res.status(200).json({ message: 'Success' })
}
