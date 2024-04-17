import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { hashMessage, recoverAddress, verifyMessage } from 'ethers'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { address, jwt } = req.body
	const nonce = Math.floor(Math.random() * 1000000)
	console.log('jwt', jwt)
	const supabaseClient = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			global: {
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
			},
		},
	)

	console.log('nonce called')
	console.log('address', address)

	const { status, error } = await supabaseClient.from('test').insert({
		data: 1,
		address,
	})

	console.log('status', status)
	console.log('error', error?.message)

	if (error) {
		return res.status(500).json({})
	}
	return res.status(200).json({ nonce })
}
