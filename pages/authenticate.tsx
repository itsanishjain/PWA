import Page from '@/components/page'
import Section from '@/components/section'
import { fetchNonce, fetchToken } from '@/lib/api/clientAPI'
import poolImage from '@/public/images/pool.png'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Appbar from '@/components/appbar'
import { useCookie } from '@/hooks/cookie'

const Authenticate = () => {
	const router = useRouter()
	const { ready, authenticated, user } = usePrivy()
	const { saveJwt, isJwtValid } = useCookie()
	const { wallets } = useWallets()

	const handleBackendLogin = async () => {
		if (!user?.wallet?.address || !wallets.length) {
			return
		}
		const result = await fetchNonce({ address: user?.wallet?.address })

		const message =
			'This is a simple verification process that will not incur any fees.'

		let signedMessage = ''
		try {
			const wallet = wallets[0] // Replace this with your desired wallet
			const provider = await wallet.getEthereumProvider()
			const address = wallet.address
			signedMessage = await provider.request({
				method: 'personal_sign',
				params: [message, address],
			})
		} catch (e: any) {
			throw new Error(e.message)
		}

		const tokenResult = await fetchToken({
			address: user?.wallet?.address,
			message,
			signedMessage,
			nonce: result.nonce,
		})
		saveJwt(tokenResult?.token)
	}

	useEffect(() => {
		if (ready && !authenticated) {
			router.replace('/login')
		}

		if (ready && authenticated && isJwtValid) {
			// Replace this code with however you'd like to handle an authenticated user
			router.replace('/')
		}
	}, [ready, authenticated, isJwtValid, wallets, router])

	return (
		<Page>
			<Appbar />
			<Section>
				<div className='flex size-full items-center justify-center'>
					<div className='flex size-96 flex-col'>
						<div className='flex w-full flex-row items-center'>
							<Image
								className='mx-auto'
								src={poolImage}
								alt='pool image'
								height={384}
								width={384}
							/>
						</div>
						<h2 className='tagline-text mt-28 w-full text-center align-top text-xl font-bold text-zinc-800'>
							Terms (Important*)
						</h2>
						<p
							className={`tagline-text  mt-4 w-full text-center align-top text-base`}
						>
							<span className={`w-full text-center align-top text-base`}>
								By registering for events on Pool you are agreeing to the terms.
							</span>
						</p>

						{!isJwtValid && (
							<div className='fixed bottom-5 left-1/2 flex w-full max-w-screen-md -translate-x-1/2 flex-row space-x-2 px-6 md:bottom-6'>
								<button
									className={`flex h-12 flex-1 items-center justify-center rounded-full bg-black px-4 py-2 text-center font-bold text-white focus:shadow-outline focus:outline-none `}
									onClick={handleBackendLogin}
								>
									Continue
								</button>
							</div>
						)}
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default Authenticate
