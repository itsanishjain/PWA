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
import styles from './styles/index.module.css'
import PoolRow from '@/components/poolRow'
import UpcomingPoolTab from '@/components/tabs/UpcomingPoolTab'
import PastPoolTab from '@/components/tabs/PastPoolTab'

const inter = Inter({ subsets: ['latin'] })

const Home = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	// Replace this with the message you'd like your user to sign

	// Replace this with the text you'd like on your signature modal,
	// if you do not have `noPromptsOnSignature` enabled
	if (ready && !authenticated) {
		// Replace this code with however you'd like to handle an unauthenticated user
		// As an example, you might redirect them to a sign-in page
		router.push('/login')
	}

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
	}, [wallets])

	return (
		<Page>
			<Appbar />

			<Section>
				<div className='flex justify-center min-h-screen w-full mt-20'>
					<div className='flex flex-col w-96 min-h-full'>
						<h3 className='font-semibold'>Upcoming Pools</h3>
						<UpcomingPoolTab />
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default Home
