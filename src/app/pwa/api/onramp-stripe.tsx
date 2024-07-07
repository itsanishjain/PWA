import type { NextApiRequest, NextApiResponse } from 'next'
import 'server-only'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('req', req)
    try {
        await fetch('https://api.stripe.com/v1/crypto/onramp_sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY_TEST}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                destination_currency: 'usdc',
                destination_network: 'base',
            }).toString(),
        })
            .then(response => response.json())
            .then(json => {
                res.status(200).json(json)
            })
    } catch (error) {
        console.error('There was a problem with the post operation:', error)
    }
}
