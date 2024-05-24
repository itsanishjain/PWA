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
	const { currentJwt, saveJwt, isJwtValid } = useCookie()
	const { wallets } = useWallets()

	const handleBackendLogin = async () => {
		console.log('handleBackendLogin')
		if (!user?.wallet?.address || !wallets.length) {
			console.log('No wallet found')
			return
		}
		const result = await fetchNonce({ address: user?.wallet?.address })
		console.log('nonce', result)

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
			console.log('User did not sign transaction')
			return
		}

		const tokenResult = await fetchToken({
			address: user?.wallet?.address,
			message,
			signedMessage,
			nonce: result.nonce,
		})
		console.log('tokenResult', tokenResult)
		saveJwt(tokenResult?.token)
		console.log('current Jwt', currentJwt)
	}

	useEffect(() => {
		if (ready && !authenticated) {
			console.log('authenticated: ', authenticated)
			router.push('/login')
		}

		if (ready && authenticated && isJwtValid) {
			// Replace this code with however you'd like to handle an authenticated user
			console.log('ready and authenticated')
			router.push('/')
		}
	}, [ready, authenticated, isJwtValid, wallets, router])

	return (
		<Page>
			<Appbar />
			<Section>
				<div className='flex size-full items-center justify-center'>
					<div className='flex size-96 flex-col'>
						<div className='row flex w-full items-center'>
							<Image className='mx-auto' src={poolImage} alt='pool image' />
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
									className={`focus:shadow-outline flex h-12 flex-1 items-center justify-center rounded-full bg-black px-4 py-2 text-center font-bold text-white focus:outline-none `}
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
