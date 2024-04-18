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

import { FundWalletConfig } from '@privy-io/react-auth'
import { provider } from '@/constants/constant'
import { Inter } from 'next/font/google'
import styles from './styles/user-profile.module.css'
import { uploadProfileImage } from '@/lib/api/clientAPI'
import { useCookie } from '@/hooks/cookie'

const inter = Inter({ subsets: ['latin'] })

const UserProfile = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	const [balance, setBalance] = useState(BigInt(0))

	const [image, setImage] = useState(null)
	const [fileBlob, setFileBlob] = useState(null)

	const { currentJwt } = useCookie()

	const handleImageChange = (e: any) => {
		setImage(e.target.files?.[0])
		const selectedFile = e.target.files?.[0]
		if (selectedFile) {
			const reader = new FileReader()
			reader.onload = () => {
				setFileBlob(reader.result)
				console.log('File Loaded')
				console.log('reader.result', reader.result)
			}
			reader.onerror = (e) => {
				console.error('Error reading file:', e)
			}
			reader.readAsArrayBuffer(selectedFile)
		}
	}

	const handleUploadImage = async (e: any) => {
		if (fileBlob == null) {
			console.log('file is null')
			return
		}
		uploadProfileImage(fileBlob!, wallets[0].address, currentJwt!)
	}
	const handleSaveButton = (e: any) => {}
	if (ready && !authenticated) {
		// Replace this code with however you'd like to handle an unauthenticated user
		// As an example, you might redirect them to a sign-in page
		router.push('/')
	}

	const getWalletBalance = async () => {
		const walletBalance = await provider.getBalance(wallets[0]?.address)
		setBalance(walletBalance)
	}

	const handleFundAccount = async () => {
		const wallet = wallets[0]
		await wallet.fund({ config: {}, provider: 'moonpay' })
	}

	useEffect(() => {
		// Update the document title using the browser API
		if (wallets.length > 0) {
			console.log(`Wallet Length: ${wallets.length}`)
			console.log(`Wallet Address: ${wallets[0].address}`)
			getWalletBalance()
		}
	}, [wallets])

	return (
		<Page>
			<Appbar />
			<Section>
				<div
					className={`flex justify-center h-full w-full mt-20 ${inter.className}`}
				>
					<div className='flex flex-col w-96 h-96'>
						<h1 className='w-full text-center mt-12 font-bold text-2xl'>
							User Profile
						</h1>
						<div>
							<input
								type='file'
								accept='image/*'
								onChange={handleImageChange}
								style={{ display: '' }}
							/>
						</div>
						<div>
							<button
								className='bg-blue-700 text-white py-4 px-8 mt-4'
								onClick={handleUploadImage}
							>
								Save
							</button>
						</div>
						<div className={`border-t-4 ${styles.divider}`}></div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default UserProfile
