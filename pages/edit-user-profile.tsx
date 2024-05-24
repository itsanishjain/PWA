import Appbar from '@/components/appbar'
import Page from '@/components/page'
import Section from '@/components/section'
import { useToast } from '@/components/ui/use-toast'
import { removeTokenCookie, useCookie } from '@/hooks/cookie'
import {
	fetchUserDisplayForAddress,
	updateUserDisplayData,
	uploadProfileImage,
} from '@/lib/api/clientAPI'
import { formatAddress } from '@/lib/utils'
import camera from '@/public/images/camera.png'
import frogImage from '@/public/images/frog.png'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useQuery } from '@tanstack/react-query'
import * as _ from 'lodash'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import styles from './styles/user-profile.module.css'

const inter = Inter({ subsets: ['latin'] })

const EditUserProfile = () => {
	const router = useRouter()
	const { ready, authenticated, logout } = usePrivy()

	const { wallets } = useWallets()

	const [fileBlob, setFileBlob] = useState<any>(null)
	const [selectedFile, setSelectedFile] = useState<any>(null)
	const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
		`${frogImage.src}`,
	)
	const [isImageReady, setIsImageReady] = useState<boolean>(true)

	const { currentJwt } = useCookie()
	const { toast } = useToast()

	const [displayName, setDisplayName] = useState<string>('')
	const [company, setCompany] = useState<string>('')
	const [bio, setBio] = useState<string>('')

	const handleDisplayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
		setDisplayName(e.target.value)
	}
	const handleCompanyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setCompany(e.target.value)
	}
	const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setBio(e.target.value)
	}

	const handleImageChange = (e: any) => {
		setIsImageReady(false)
		if (e.target.files?.length === 0) {
			// User cancelled selection
			setIsImageReady(true)
		}
		const file = e.target.files?.[0]
		if (file) {
			setProfileImageUrl(URL.createObjectURL(file))
		}
		setSelectedFile(file)
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				setFileBlob(reader.result)
				setIsImageReady(true)
			}
			reader.onerror = (e) => {
				setIsImageReady(true)
				throw new Error('Failed to read file')
			}
			reader.onabort = () => {
				setIsImageReady(true)
				throw new Error('File reading aborted')
			}
			reader.readAsArrayBuffer(file)
		}
	}

	const handleSaveButtonClicked = async (e: any) => {
		if (fileBlob != null) {
			await uploadProfileImage(fileBlob, selectedFile, currentJwt!)
		}
		const { userError } = await updateUserDisplayData(
			displayName,
			company,
			bio,
			currentJwt!,
		)

		if (userError) {
			toast({
				title: 'Error',
				description: userError,
			})
		} else {
			toast({
				title: 'Saving Details',
				description: 'You have saved the data successfully',
			})
		}
	}

	const { data: profileData } = useQuery({
		queryKey: ['loadProfileImage', wallets?.[0]?.address],
		queryFn: fetchUserDisplayForAddress,
		enabled: wallets.length > 0,
	})

	const triggerFileInput = () => {
		document.getElementById('fileInput')?.click()
	}

	const handleSignOut = async () => {
		wallets?.[0]?.disconnect()
		toast({
			title: 'Logging Out',
			description: 'Please wait...',
		})
		await logout()

		removeTokenCookie()
	}

	useEffect(() => {
		if (ready && !authenticated) {
			router.replace('/login')
		}

		if (profileData?.profileImageUrl) {
			setProfileImageUrl(profileData?.profileImageUrl)
		}
		setBio(profileData?.userDisplayData.bio ?? '')
		setDisplayName(profileData?.userDisplayData.display_name ?? '')
		setCompany(profileData?.userDisplayData.company ?? '')
	}, [profileData, ready, authenticated, router])

	return (
		<Page>
			<Appbar backRoute='/user-profile' pageTitle='Edit User Profile' />
			<Section>
				<div
					className={`mt-20 flex min-h-screen w-full justify-center ${inter.className}`}
				>
					<div className='flex w-96 flex-col pb-8'>
						<div>
							<input
								type='file'
								accept='image/*'
								id='fileInput'
								onChange={handleImageChange}
								className='hidden'
							/>
						</div>

						<div className='flex w-full flex-col items-center justify-center'>
							<button
								onClick={triggerFileInput}
								className='relative m-8 aspect-square w-40 rounded-full '
							>
								{profileImageUrl && (
									<Image
										alt='camera'
										className='center z-0 aspect-square w-40 rounded-full object-cover'
										src={profileImageUrl}
									/>
								)}
								<div
									className={`absolute left-0 top-0 size-full rounded-full ${styles.overlay} z-10 flex items-center justify-center`}
								>
									<Image
										alt='camera'
										src={camera.src}
										className='object-contain   object-center'
									/>
								</div>
							</button>
							<h3 className='font-medium'>
								{!_.isEmpty(wallets?.[0]?.address) &&
									formatAddress(wallets?.[0]?.address)}
							</h3>
						</div>

						<div className={`border-t-4 ${styles.divider}`} />
						<div className='flex flex-row'>
							<div className='flex h-10 flex-1 flex-row items-center font-semibold'>
								Display name
							</div>
							<input
								type='text'
								value={displayName}
								onChange={handleDisplayNameChange}
								placeholder='Display Name'
								className='my-2 flex flex-1 rounded-lg bg-white px-4 text-black'
							/>
						</div>
						<div className={`border-t-4 ${styles.divider}`} />
						<div className='flex flex-col'>
							<div className='h-10  font-semibold'>
								Bio
								<span className='text-xs font-medium'>(optional)</span>
							</div>
							<textarea
								value={bio}
								onChange={handleBioChange}
								placeholder='Write something enticing about yourself'
								className='h-24 rounded-lg bg-white p-2 text-black outline outline-1 outline-gray-100'
							/>
						</div>

						<div className={`border-t-4 ${styles.divider}`} />
						<div className='h-10  font-semibold'>
							Company
							<span className='text-xs font-medium'>(optional)</span>
						</div>

						<textarea
							value={company}
							onChange={handleCompanyChange}
							placeholder='Write something enticing about yourself'
							className='h-24 rounded-lg bg-white p-2 text-black outline outline-1 outline-gray-100'
						/>
						<div className='mt-8 flex justify-center'>
							{isImageReady && (
								<button
									className='mt-4 w-full rounded-full bg-black px-8 py-4 text-white'
									onClick={handleSaveButtonClicked}
								>
									Save
								</button>
							)}
						</div>
						<div className='mt-8 flex justify-center'>
							<button onClick={handleSignOut}>Sign Out</button>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default EditUserProfile
