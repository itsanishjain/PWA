import Page from '@/components/page'
import Section from '@/components/section'
import Image from 'next/image'
import poolImage from '@/public/images/pool.png'
import { useRouter } from 'next/router'
import { usePrivy } from '@privy-io/react-auth'
import { chain } from '@/constants/constant'
import React, { useState, useEffect } from 'react'
import { fetchNonce, fetchToken, writeTest } from '@/lib/api/clientAPI'

import { getTokenCookie, setTokenCookie } from '@/hooks/cookie'

const LoginPage = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, login } = usePrivy()

	const handleClick = () => {
		// Replace '/your-link' with the actual path you want to navigate to
		// router.push('/wallet-selection')
		login()
	}

	const handleBackendLogin = async () => {
		console.log('handleBackendLogin')
		let result = await fetchNonce({ address: user?.wallet?.address! })
		console.log('nonce', result)

		const message = 'Sign message'

		let signedMessage = ''
		try {
			signedMessage = await signMessage(message)
		} catch (e: any) {
			console.log('User did not sign transaction')
		}

		let tokenResult = await fetchToken({
			address: user?.wallet?.address!,
			message,
			signedMessage,
			nonce: result.nonce,
		})
		console.log('tokenResult', tokenResult)
		setTokenCookie(tokenResult.token)
		console.log('cookie', getTokenCookie())
		testWrite()
	}

	const testWrite = async () => {
		console.log('handleTestWrite')
		let result = await writeTest({
			address: user?.wallet?.address!,
			jwt: getTokenCookie(),
		})
	}

	const showBackend = ready && authenticated

	useEffect(() => {
		if (ready && !authenticated) {
			// Replace this code with however you'd like to handle an unauthenticated user
			// As an example, you might redirect them to a sign-in page
		}

		if (ready && authenticated) {
			// Replace this code with however you'd like to handle an authenticated user
			router.push('/authenticate')
			// console.log('ready and authenticated')
		}
	}, [ready, authenticated])

	return (
		<Page>
			<Section>
				<div className='flex justify-center h-full w-full items-center'>
					<div className='flex flex-col w-96 h-96'>
						<div className='flex row items-center w-full'>
							<Image className='mx-auto' src={poolImage} alt='pool image' />
						</div>
						<h2 className='text-xl font-bold text-zinc-800 tagline-text text-center align-top w-full mt-28'>
							Pooling made simple.
						</h2>
						<h2
							className={` font-semibold text-center align-top w-full tagline-text`}
						>
							<span
								className={`font-semibold gradient-text text-center align-top w-full`}
							>
								For everyone.
							</span>
						</h2>

						<div className='flex justify-center items-center h-full w-full mt-28'>
							<button
								className='rounded-full gradient-background px-28 py-3'
								onClick={handleClick}
							>
								Connect wallet
							</button>
						</div>
						{/* {showBackend && (
							<div className='flex justify-center items-center h-full w-full mt-28'>
								<button
									className='rounded-full gradient-background px-28 py-3'
									onClick={handleBackendLogin}
								>
									backend
								</button>
							</div>
						)} */}
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default LoginPage
function setToken(tokenCookie: string) {
	throw new Error('Function not implemented.')
}
