import Page from '@/components/page'
import Section from '@/components/section'
import Image from 'next/image'
import poolImage from '@/public/images/pool.png'
import { useRouter } from 'next/router'
import {
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'

import React, { useState, useEffect } from 'react'

import { ethers } from 'ethers'
import Appbar from '@/components/appbar'

import { Inter } from 'next/font/google'
import styles from './styles/admin.module.css'
import PoolRow from '@/components/poolRow'
import UpcomingPoolTab from '@/components/tabs/UpcomingPoolTab'
import PastPoolTab from '@/components/tabs/PastPoolTab'

const inter = Inter({ subsets: ['latin'] })

const Admin = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	const handleCreatePool = async () => {
		router.push('/create-pool')
	}

	const [selectedTab, setSelectedTab] = useState(0)
	const selectTab = (tabIndex: number) => {
		setSelectedTab(tabIndex)
	}

	useEffect(() => {
		// Update the document title using the browser API
		if (wallets.length > 0) {
			console.log(`Wallet Length: ${wallets.length}`)
			console.log(`Wallet Address: ${wallets[0].address}`)
		}
		if (ready && !authenticated) {
			router.push('/login')
		}
	}, [wallets, ready, authenticated, router])

	return (
		<Page>
			<Appbar />

			<Section>
				<div className='flex justify-center min-h-screen w-full mt-20'>
					<div className='flex flex-col w-96 min-h-full'>
						<div
							className={`flex flex-row h-12 rounded-full ${styles.buttonTabBackground}`}
						>
							<button
								onClick={() => selectTab(0)}
								className={`flex flex-1 font-semibold rounded-full bg-black text-white justify-center items-center ${
									selectedTab === 0
										? styles.selectedTabButton
										: styles.unselectedTabButton
								} ${inter.className}`}
							>
								Upcoming
							</button>
							<button
								onClick={() => selectTab(1)}
								className={`flex flex-1 font-semibold rounded-full bg-black text-white justify-center items-center ${
									selectedTab === 1
										? styles.selectedTabButton
										: styles.unselectedTabButton
								} ${inter.className}`}
							>
								Past
							</button>
						</div>
						{selectedTab === 0 ? <UpcomingPoolTab /> : <PastPoolTab />}

						<div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 w-96'>
							<button
								className={`bg-black w-full h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ${inter.className}`}
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
