import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { hashMessage, recoverAddress, verifyMessage } from 'ethers'
import { createBrowserClient } from '@supabase/ssr'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { createClient } from '@supabase/supabase-js'

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

	console.log('nonce called')
	console.log('address', addressLower)

	const { status, error } = await supabaseAdminClient.from('users').upsert(
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

	console.log('status', status)
	console.log('error', error?.message)

	if (error) {
		return res.status(500).json({})
	}
	return res.status(200).json({ nonce })
}
