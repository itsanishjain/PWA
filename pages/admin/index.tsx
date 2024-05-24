import Page from '@/components/page'
import Section from '@/components/section'
import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/router'

import { useState } from 'react'

import Appbar from '@/components/appbar'

import PastPoolTab from '@/components/tabs/PastPoolTab'
import UpcomingPoolTab from '@/components/tabs/UpcomingPoolTab'
import { Inter } from 'next/font/google'
import styles from './styles/admin.module.css'

const inter = Inter({ subsets: ['latin'] })

const Admin = () => {
	const router = useRouter()
	const { ready, authenticated } = usePrivy()

	// Replace this with the message you'd like your user to sign

	// Replace this with the text you'd like on your signature modal,
	// if you do not have `noPromptsOnSignature` enabled
	if (ready && !authenticated) {
		// Replace this code with however you'd like to handle an unauthenticated user
		// As an example, you might redirect them to a sign-in page
		router.push('/login')
	}

	const handleCreatePool = () => {
		router.push('/create-pool')
	}

	const [selectedTab, setSelectedTab] = useState(0)
	const selectTab = (tabIndex: number) => {
		setSelectedTab(tabIndex)
	}

	return (
		<Page>
			<Appbar />

			<Section>
				<div className='mt-20 flex min-h-screen w-full justify-center'>
					<div className='flex min-h-full w-96 flex-col'>
						<div
							className={`flex h-12 flex-row rounded-full ${styles.buttonTabBackground}`}
						>
							<button
								onClick={() => selectTab(0)}
								className={`flex flex-1 items-center justify-center rounded-full bg-black font-semibold text-white ${
									selectedTab === 0
										? styles.selectedTabButton
										: styles.unselectedTabButton
								} ${inter.className}`}
							>
								Upcoming
							</button>
							<button
								onClick={() => selectTab(1)}
								className={`flex flex-1 items-center justify-center rounded-full bg-black font-semibold text-white ${
									selectedTab === 1
										? styles.selectedTabButton
										: styles.unselectedTabButton
								} ${inter.className}`}
							>
								Past
							</button>
						</div>
						{selectedTab === 0 ? <UpcomingPoolTab /> : <PastPoolTab />}

						<div className='fixed bottom-6 left-1/2 w-96 -translate-x-1/2'>
							<button
								className={`h-12 w-full rounded-full bg-black px-4 py-2 font-bold text-white focus:shadow-outline focus:outline-none ${inter.className}`}
								onClick={handleCreatePool}
							>
								+ Create a Pool
							</button>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default Admin
