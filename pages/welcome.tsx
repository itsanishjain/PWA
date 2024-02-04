import Page from '@/components/page'
import Section from '@/components/section'
import Image from 'next/image'
import poolImage from '@/public/images/pool.png'
import { useRouter } from 'next/router'

const Welcome = () => {
	const router = useRouter()

	const handleClick = () => {
		// Replace '/your-link' with the actual path you want to navigate to
		router.push('/wallet-selection')
	}

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
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default Welcome
