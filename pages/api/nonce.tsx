import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { address } = req.body
	const nonce = Math.floor(Math.random() * 1000000)
	const addressLower = address.toLowerCase()
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

	const { error } = await supabaseAdminClient.from('users').upsert(
		{
			auth: {
				genNonce: nonce,
				lastAuth: new Date().toISOString(),
				lastAuthStatus: 'pending',
			},
			address: addressLower,
		},
		{ onConflict: 'address' },
	)

	if (error) {
		return res.status(500).json({})
	}
	return res.status(200).json({ nonce })
}
