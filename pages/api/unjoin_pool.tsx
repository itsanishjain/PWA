import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { hashMessage, recoverAddress, verifyMessage } from 'ethers'
import { createClient } from '@supabase/supabase-js'
import { JwtPayload, decode } from 'jsonwebtoken'

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
	// Parse the request body
	const requestData = await req.body
	const { poolId, walletAddress, jwtString } = requestData

	const walletAddressLower = walletAddress.toLowerCase()
	console.log('jwt', JSON.stringify(jwtString))

	// Return a response
	const supabaseClient = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			global: {
				headers: {
					Authorization: `Bearer ${jwtString}`,
				},
			},
		},
	)

	const supabaseRow = {
		participant_address: walletAddressLower,
		status: 0,
		pool_id: poolId,
		// Add other columns as needed
	}

	try {
		const jwtObj = decode(jwtString, { json: true })
		const jwtAddress = jwtObj!.address
		if (jwtAddress.toLowerCase() != walletAddress.toLowerCase()) {
			res.status(401).json({ error: 'Invalid Permissons' })
			return
		}
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Failed to decode Jwt.' })

		return
	}

	async function upsertData() {
		const { data: existingData, error: selectError } = await supabaseClient
			.from('participantStatus')
			.select('*')
			.match({
				pool_id: supabaseRow.pool_id,
				participant_address: supabaseRow.participant_address,
			})

		if (existingData?.length === 0) {
			console.error('Error fetching existing data:', selectError)
			// Insert a new row
			const { data: insertedData, error: insertError } = await supabaseClient
				.from('participantStatus')
				.insert([supabaseRow])

			if (insertError) {
				console.error('Error inserting data:', insertError)
			} else {
				console.log('Data inserted successfully:', insertedData)
			}
			res.status(500).json({ message: 'Success' })

			return
		} else {
			// Update the existing row
			const { data: updatedData, error: updateError } = await supabaseClient
				.from('participantStatus')
				.update({ status: supabaseRow.status })
				.match({
					pool_id: supabaseRow.pool_id,
					participant_address: supabaseRow.participant_address,
				})

			if (updateError) {
				console.error('Error updating data:', updateError)
				res.status(500).json({ message: 'Error upating data' })
			} else {
				console.log('Data updated successfully:', updatedData)
			}
		}
	}

	await upsertData()
	res.status(200).json({ message: 'Success' })
}
