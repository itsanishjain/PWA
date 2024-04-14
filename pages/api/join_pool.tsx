import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { hashMessage, recoverAddress, verifyMessage } from 'ethers'
import { createBrowserClient } from '@supabase/ssr'
// import { createClient } from '@/utils/supabase/client'

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
	const { poolId, signedMessage, walletAddress } = requestData

	const recoveredAddress = recoverAddress(
		hashMessage(`Join Pool: ${poolId}`),
		signedMessage,
	)
	const isSignedCorrectly = recoveredAddress == walletAddress
	// Return a response
	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_KEY!,
	)
	const supabaseRow = {
		participant_address: walletAddress,
		status: 1,
		pool_id: poolId,
		// Add other columns as needed
	}
	async function insertData() {
		const { error } = await supabase
			.from('pool_table') // Replace 'your_table_name' with your actual table name
			.insert([supabaseRow])

		if (error) {
			console.error('Error inserting data:', error)
		} else {
			console.log('Data inserted successfully')
		}
	}

	async function upsertData() {
		const { data: existingData, error: selectError } = await supabase
			.from('pool_table')
			.select('*')
			.match({
				pool_id: supabaseRow.pool_id,
				participant_address: supabaseRow.participant_address,
			})
			.single()

		if (selectError) {
			console.error('Error fetching existing data:', selectError)
			// Insert a new row
			const { data: insertedData, error: insertError } = await supabase
				.from('pool_table')
				.insert([supabaseRow])

			if (insertError) {
				console.error('Error inserting data:', insertError)
			} else {
				console.log('Data inserted successfully:', insertedData)
			}

			return
		}

		if (existingData) {
			// Update the existing row
			const { data: updatedData, error: updateError } = await supabase
				.from('pool_table')
				.update({ status: supabaseRow.status })
				.match({
					pool_id: supabaseRow.pool_id,
					participant_address: supabaseRow.participant_address,
				})

			if (updateError) {
				console.error('Error updating data:', updateError)
			} else {
				console.log('Data updated successfully:', updatedData)
			}
		}
	}

	await upsertData()
	res.status(200).json({
		isSignedCorrectly,
		message: `poolId ${poolId}, signedMessage ${signedMessage}, walletAddress ${walletAddress}`,
	})
}
