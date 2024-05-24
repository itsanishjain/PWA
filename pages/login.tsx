import Page from '@/components/page'
import Section from '@/components/section'
import poolImage from '@/public/images/pool.png'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Link from 'next/link'

const LoginPage = () => {
	const router = useRouter()
	const { ready, authenticated, login } = usePrivy()
	const { wallets } = useWallets()

	useEffect(() => {
		if (ready && authenticated && wallets?.length > 0) {
			router.push('/authenticate')
		}
	}, [ready, authenticated, wallets, router])

	return (
		<Page>
			<Section>
				<div className='relative flex size-full items-center justify-center'>
					<div className='flex size-96 flex-col'>
						<div className='flex w-full flex-row items-center'>
							<Image className='mx-auto' src={poolImage} alt='pool image' />
						</div>
						<h2 className='tagline-text mt-28 w-full text-center align-top text-xl font-bold text-zinc-800'>
							Pooling made simple.
						</h2>
						<h2
							className={` tagline-text w-full text-center align-top font-semibold`}
						>
							<span
								className={`gradient-text w-full text-center align-top font-semibold`}
							>
								For everyone.
							</span>
						</h2>

						<div className='mt-28 flex size-full items-center justify-center'>
							<button
								className='gradient-background rounded-full px-28 py-3'
								onClick={login}
							>
								Connect wallet
							</button>
						</div>
					</div>
					<div className=' absolute bottom-0 flex w-full flex-row justify-between text-black'>
						<Link className=' text-black' href={'/terms'}>
							Terms and Conditions
						</Link>
						<Link className='' href={'/privacy'}>
							Privacy Policy
						</Link>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default LoginPage
