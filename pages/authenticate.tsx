import Page from '@/components/page'
import Section from '@/components/section'
import Image from 'next/image'
import poolImage from '@/public/images/pool.png'
import { useRouter } from 'next/router'
import { usePrivy } from '@privy-io/react-auth'
import { chain } from '@/constants/constant'
import React, { useState, useEffect } from 'react'
import { fetchNonce, fetchToken, writeTest } from '@/lib/api/clientAPI'

import { useCookie } from '@/hooks/cookie'
import jwt from 'jsonwebtoken'
import Appbar from '@/components/appbar'

const Authenticate = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, login } = usePrivy()
	const { currentJwt, saveJwt, isJwtValid } = useCookie()

	const handleClick = () => {
		// Replace '/your-link' with the actual path you want to navigate to
		// router.push('/wallet-selection')
		login()
	}

	const handleBackendLogin = async () => {
		console.log('handleBackendLogin')
		let result = await fetchNonce({ address: user?.wallet?.address! })
		console.log('nonce', result)

		const message =
			'This is a simple verification process that will not incur any fees.'

		let signedMessage = ''
		try {
			signedMessage = await signMessage(message)
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
		saveJwt(tokenResult.token)
		console.log('current Jwt', currentJwt)
		// testWrite()
	}

	const testWrite = async () => {
		console.log('handleTestWrite')
		let result = await writeTest({
			address: user?.wallet?.address!,
			jwt: currentJwt,
		})
	}

	// let showAuthenticateBackendButton = false

	if (!ready) {
		// Do nothing while the PrivyProvider initializes with updated user state
		return <></>
	}

	if (ready && !authenticated) {
		// Replace this code with however you'd like to handle an unauthenticated user
		// As an example, you might redirect them to a sign-in page
		router.push('/')
	}

	if (ready && authenticated && isJwtValid) {
		// Replace this code with however you'd like to handle an authenticated user
		console.log('ready and authenticated')
		router.push('/home')
	}

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
							Almost there ...
						</h2>
						<p
							className={`text-base  text-center align-top w-full tagline-text mt-4`}
						>
							<span className={`text-base text-center align-top w-full`}>
								We just need to verify your wallet.
							</span>
						</p>

						{!isJwtValid && (
							<div className='flex justify-center items-center h-full w-full mt-4'>
								<button
									className='rounded-full gradient-background px-28 py-3'
									onClick={handleBackendLogin}
								>
									Verify
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
