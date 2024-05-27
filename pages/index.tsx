import Appbar from '@/components/appbar'
import Page from '@/components/page'
import Section from '@/components/section'
import UpcomingPoolTab from '@/components/tabs/UpcomingPoolTab'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home = () => {
	const router = useRouter()
	const { ready, authenticated } = usePrivy()

	useEffect(() => {
		if (ready && !authenticated) {
			router.replace('/login')
		}
	}, [ready, authenticated, router])

	return (
		<Page>
			<Appbar />
			<Section>
				<div className='flex w-full  justify-center pt-20'>
					<div className='flex w-96 flex-col space-y-8'>
						<div>
							<h3 className='font-semibold'>Upcoming Pools</h3>
							<UpcomingPoolTab />
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default Home
