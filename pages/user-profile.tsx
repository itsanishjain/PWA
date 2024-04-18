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

import React, { useState, useEffect, ChangeEvent } from 'react'

import { ethers } from 'ethers'
import Appbar from '@/components/appbar'

import { FundWalletConfig } from '@privy-io/react-auth'
import { provider } from '@/constants/constant'
import { Inter } from 'next/font/google'
import styles from './styles/user-profile.module.css'
import { updateUserDisplayData, uploadProfileImage } from '@/lib/api/clientAPI'
import { useCookie } from '@/hooks/cookie'
import { createClient } from '@supabase/supabase-js'
import { JwtPayload, decode } from 'jsonwebtoken'

const inter = Inter({ subsets: ['latin'] })

const UserProfile = () => {
	const router = useRouter()
	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	const [fileBlob, setFileBlob] = useState<any>(null)
	const [profileImageUrl, setProfileImageUrl] = useState<string>('')

	const { currentJwt } = useCookie()

	const [displayName, setDisplayName] = useState<string>('')
	const [company, setCompany] = useState<string>('')
	const [bio, setBio] = useState<string>('')

	const handleDisplayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setDisplayName(e.target.value)
	}
	const handleCompanyChange = (e: ChangeEvent<HTMLInputElement>) => {
		setCompany(e.target.value)
	}
	const handleBioChange = (e: ChangeEvent<HTMLInputElement>) => {
		setBio(e.target.value)
	}

	const handleImageChange = (e: any) => {
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

	const handleSaveButtonClicked = async (e: any) => {
		if (fileBlob != null) {
			await uploadProfileImage(fileBlob!, wallets[0].address, currentJwt!)
		}
		await updateUserDisplayData(displayName, company, bio, currentJwt!)
	}

	if (ready && !authenticated) {
		// Replace this code with however you'd like to handle an unauthenticated user
		// As an example, you might redirect them to a sign-in page
		router.push('/')
	}

	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	)

	const loadProfilePicture = async () => {
		const jwtObj: any = decode(currentJwt ?? '')

		const { data: userDisplayData, error } = await supabase
			.from('usersDisplay')
			.select('*')
			.filter('id', 'eq', jwtObj.sub)
			.single()
		setDisplayName(userDisplayData.display_name)
		setBio(userDisplayData.bio)
		setCompany(userDisplayData.company)
		const { data: storageData } = supabase.storage
			.from('profile')
			.getPublicUrl(userDisplayData.avatar_url)
		setProfileImageUrl(storageData.publicUrl)
	}
	useEffect(() => {
		loadProfilePicture()
	}, [wallets, currentJwt])

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

						<div className='flex w-full justify-center'>
							<img
								className='rounded-full m-8'
								src={profileImageUrl}
								width={200}
								height={200}
							/>
						</div>

						<div className={`border-t-4 ${styles.divider}`}></div>
						<input
							type='text'
							value={displayName}
							onChange={handleDisplayNameChange}
							placeholder='Display Name'
							className='rounded-full outline-1 outline my-2 px-4'
						/>
						<input
							type='text'
							value={bio}
							onChange={handleBioChange}
							placeholder='Company'
							className='rounded-full outline-1 outline my-2 px-4'
						/>
						<input
							type='text'
							value={company}
							onChange={handleCompanyChange}
							placeholder='Write something enticing about yourself'
							className='rounded-full outline-1 outline my-2 px-4'
						/>
						<div className='flex justify-center'>
							<button
								className='bg-blue-700 rounded-full text-white py-4 px-8 mt-4'
								onClick={handleSaveButtonClicked}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default UserProfile
