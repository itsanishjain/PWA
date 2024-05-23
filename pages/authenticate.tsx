import Page from '@/components/page'
import Section from '@/components/section'
import Image from 'next/image'
import poolImage from '@/public/images/pool.png'
import { useRouter } from 'next/router'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import React, { useState, useEffect } from 'react'
import { fetchNonce, fetchToken } from '@/lib/api/clientAPI'

import { useCookie } from '@/hooks/cookie'
import jwt from 'jsonwebtoken'
import Appbar from '@/components/appbar'

const Authenticate = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, login } = usePrivy()
	const { currentJwt, saveJwt, isJwtValid } = useCookie()
	const { wallets } = useWallets()

	const handleBackendLogin = async () => {
		console.log('handleBackendLogin')
		let result = await fetchNonce({ address: user?.wallet?.address! })
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

		let tokenResult = await fetchToken({
			address: user?.wallet?.address!,
			message,
			signedMessage,
			nonce: result.nonce,
		})
		console.log('tokenResult', tokenResult)
		saveJwt(tokenResult?.token)
		console.log('current Jwt', currentJwt)
		// testWrite()
	}

	// let showAuthenticateBackendButton = false

	useEffect(() => {
		if (ready && !authenticated) {
			console.log('authenticated: ', authenticated)

			// Replace this code with however you'd like to handle an unauthenticated user
			// As an example, you might redirect them to a sign-in page
			router.push('/login')
		}

		if (ready && authenticated && isJwtValid) {
			// Replace this code with however you'd like to handle an authenticated user
			console.log('ready and authenticated')
			router.push('/')
		}
		// if (ready && authenticated) {
		// 	if (!wallets?.[0]?.isConnected) {
		// 		router.push('/login')
		// 	}
		// }
	}, [ready, authenticated, isJwtValid, wallets, router])

	return (
		<Page>
			<Appbar />

			<Section>
				<div className='flex justify-center h-full w-full items-center'>
					<div className='flex flex-col w-96 h-96'>
						<div className='flex row items-center w-full'>
							<Image className='mx-auto' src={poolImage} alt='pool image' />
						</div>
						<h2 className='text-xl font-bold text-zinc-800 tagline-text text-center align-top w-full mt-28'>
							Terms (Important*)
						</h2>
						<p
							className={`text-base  text-center align-top w-full tagline-text mt-4`}
						>
							<span className={`text-base text-center align-top w-full`}>
								By registering for events on Pool you are agreeing to the terms.
							</span>
						</p>

						{!isJwtValid && (
							<div className='fixed flex space-x-2 flex-row bottom-5 md:bottom-6 left-1/2 transform -translate-x-1/2 max-w-screen-md w-full px-6'>
								<button
									className={`bg-black flex text-center justify-center items-center flex-1 h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline `}
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
