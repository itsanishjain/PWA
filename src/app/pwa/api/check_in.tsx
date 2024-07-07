import 'server-only'

import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Parse the request body
    // const requestData = await req.body
    // const { poolId, address, jwtString } = requestData

    // const walletAddressLower = address.toLowerCase()
    // console.log('jwt', JSON.stringify(jwtString))

    // const { data: existingData, error: selectError } = await db
    // 	.from('pools')
    // 	.select('*')
    // 	.match({
    // 		pool_id: poolId,
    // 	})

    // if (
    // 	existingData?.[0]?.['host_address'] != jwtAddress &&
    // 	existingData?.[0]?.['co_host_addresses'].indexOf(jwtAddress) == -1
    // ) {
    // 	console.error('Not authorised to register')
    // 	res.status(500).json({ message: 'Error' })

    // 	return
    // }

    // async function upsertData() {
    // 	const { data: existingData, error: selectError } = await db
    // 		.from('pool_participants')
    // 		.select('*')
    // 		.match({
    // 			pool_id: poolId,
    // 			participant_address: walletAddressLower,
    // 		})

    // 	if (existingData?.length === 0) {
    // 		console.log('User not Registered previously', selectError)
    // 		// Insert a new row
    // 		// const { data: insertedData, error: insertError } =
    // 		// 	await supabaseAdminClient.from('participantStatus').insert({
    // 		// 		participant_address: walletAddressLower,
    // 		// 		status: 2,
    // 		// 		pool_id: poolId,
    // 		// 	})
    // 		// if (insertError) {
    // 		// 	console.log('Error inserting into participantStatus')
    // 		// 	res.status(500).json({ message: 'Error' })
    // 		// } else {
    // 		// 	console.log('Data inserted successfully:', insertedData)
    // 		// }
    // 		res.status(500).json({ error: 'Internal Server Error' })
    // 	} else {
    // 		// Update the existing row
    // 		const { data: updatedData, error: updateError } =
    // 			await db
    // 				.from('pool_participants')
    // 				.update({
    // 					participant_address: walletAddressLower,
    // 					status: 2,
    // 					pool_id: poolId,
    // 					check_in_time: new Date(),
    // 				})
    // 				.match({
    // 					pool_id: poolId,
    // 					participant_address: walletAddressLower,
    // 				})

    // 		if (updateError) {
    // 			console.error('Error updating data:', updateError)
    // 			res.status(500).json({ error: 'Internal Server Error' })
    // 		} else {
    // 			console.log('Data updated successfully:', updatedData)
    // 		}
    // 	}
    // }

    // await upsertData()
    res.status(200).json({ message: 'Success' })
}
