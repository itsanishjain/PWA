'use client'

import Section from '@/components/section'
import camera from '@/public/app/icons/camera-icon.png'
import Image from 'next/image'
// import styles from './styles/user-profile.module.css'

const EditUserProfile = () => {
    // const router = useRouter()
    // const { ready, authenticated, logout } = usePrivy()

    // const { wallets } = useWallets()
    // const queryClient = useQueryClient()

    // const [fileBlob, setFileBlob] = useState<File | string | ArrayBuffer | null>(null)
    // const [selectedFile, setSelectedFile] = useState<File | null>(null)
    // const [selectedFileBase64, setSelectedFileBase64] = useState<string | null>(null)

    // const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(`${frogImage.src}`)
    // const [isImageReady, setIsImageReady] = useState<boolean>(true)

    // const [displayName, setDisplayName] = useState<string>('')
    // const [company, setCompany] = useState<string>('')
    // const [bio, setBio] = useState<string>('')

    // const handleDisplayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     setDisplayName(e.target.value)
    // }
    // const handleCompanyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    //     setCompany(e.target.value)
    // }
    // const handleBioChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    //     setBio(e.target.value)
    // }

    // const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    //     setIsImageReady(false)
    //     if (e.target.files?.length === 0) {
    //         // User cancelled selection
    //         setIsImageReady(true)
    //         console.log('User cancelled image selection')
    //     }
    //     const file = e.target.files?.[0]
    //     if (file) {
    //         setProfileImageUrl(URL.createObjectURL(file))
    //         setSelectedFile(file)
    //     }

    //     if (file) {
    //         const reader = new FileReader()
    //         reader.onload = () => {
    //             setFileBlob(reader.result)
    //             console.log('File Loaded')
    //             console.log('reader.result', reader.result)
    //             setIsImageReady(true)
    //         }
    //         reader.onerror = e => {
    //             console.error('Error reading file:', e)
    //             setIsImageReady(true)
    //         }
    //         reader.onabort = () => {
    //             console.error('Aborted')
    //             setIsImageReady(true)
    //         }
    //         reader.readAsArrayBuffer(file)

    //         const base64 = await convertToBase64(file)
    //         setSelectedFileBase64(base64)
    //     }
    // }

    // const updateUserDisplayDataMutation = useMutation({
    //     mutationFn: handleUpdateUserDisplayData,
    //     onSuccess: () => {
    //         toast({
    //             title: 'Profile Updated',
    //             description: 'Profile has been updated successfully',
    //         })
    //         queryClient.invalidateQueries({
    //             queryKey: ['loadProfileImage', wallets?.[0]?.address],
    //         })
    //     },
    //     onError: error => {
    //         toast({
    //             title: 'Failed to update profile',
    //             description: `${error.message}. Try again later`,
    //         })
    //     },
    // })

    // const handleSaveButtonClicked = async (e: React.MouseEvent) => {
    //     toast('Saving Details',{
    //         description: 'Please wait',
    //     })
    //     if (fileBlob != null) {
    //         await uploadProfileImage(fileBlob, selectedFile, selectedFileBase64, currentJwt)
    //     }
    //     console.log('wallet address', wallets[0]?.address)
    //     updateUserDisplayDataMutation.mutate({
    //         params: [displayName, company, bio, currentJwt!],
    //     })
    // }

    // const { data: profileData } = useQuery({
    //     queryKey: ['loadProfileImage', wallets?.[0]?.address],
    //     queryFn: fetchUserDisplayForAddress,
    //     enabled: wallets.length > 0,
    // })

    // const triggerFileInput = () => {
    //     document.getElementById('fileInput')?.click()
    // }

    // const handleSignOut = async () => {
    //     console.log('handleSignOut')
    //     wallets?.[0]?.disconnect()

    //     toast('Logging Out', {
    //         description: 'Please wait...',
    //     })
    //     await logout()
    // }

    // useEffect(() => {
    //     if (ready && !authenticated) {
    //         router.push('/')
    //     }

    //     if (profileData?.profileImageUrl) {
    //         setProfileImageUrl(profileData?.profileImageUrl)
    //     }
    //     setBio(profileData?.userDisplayData.bio ?? '')
    //     setDisplayName(profileData?.userDisplayData.display_name ?? '')
    //     setCompany(profileData?.userDisplayData.company ?? '')
    //     console.log('displayName', profileData)
    // }, [profileData, ready, authenticated, router, wallets])

    return (
        <>
            <Section>
                <div className={`mt-20 flex min-h-screen w-full justify-center font-body`}>
                    <div className='flex w-96 flex-col pb-8'>
                        <div>
                            <input
                                title='Change Profile Image'
                                type='file'
                                accept='image/*'
                                id='fileInput'
                                // onChange={handleImageChange}
                                className='hidden'
                            />
                        </div>

                        <div className='flex w-full flex-col items-center justify-center'>
                            <button
                                title='Change Profile Image'
                                type='button'
                                // onClick={triggerFileInput}
                                className='relative m-8 aspect-square w-40 rounded-full'>
                                {/* {profileImageUrl && (
                                    <Image
                                        className='z-0 aspect-square w-40 rounded-full object-cover'
                                        src={profileImageUrl}
                                        alt='profile image'
                                        width={160}
                                        height={160}
                                    />
                                )} */}
                                <div
                                    className={`absolute left-0 top-0 z-10 flex size-full items-center justify-center rounded-full`}>
                                    <Image
                                        src={camera.src}
                                        className='object-contain object-center'
                                        alt='camera icon'
                                        fill
                                    />
                                </div>
                            </button>
                            <h3 className='font-medium'>
                                {/* {!_.isEmpty(wallets?.[0]?.address) && formatAddress(wallets?.[0]?.address)} */}
                            </h3>
                        </div>

                        <div className={`border-t-4`} />
                        <div className='flex flex-row'>
                            <div className='flex h-10 flex-1 flex-row items-center font-semibold'>Display name</div>
                            <input
                                type='text'
                                // value={displayName}
                                // onChange={handleDisplayNameChange}
                                placeholder='Display Name'
                                className='my-2 flex flex-1 rounded-lg bg-white px-4 text-black'
                            />
                        </div>
                        <div className={`border-t-4`} />
                        <div className='flex flex-col'>
                            <div className='h-10 font-semibold'>
                                Bio
                                <span className='text-xs font-medium'>(optional)</span>
                            </div>
                            <textarea
                                // value={bio}
                                // onChange={handleBioChange}
                                placeholder='Write something enticing about yourself'
                                className='h-24 rounded-lg bg-white p-2 text-black outline outline-1 outline-gray-100'
                            />
                        </div>

                        <div className={`border-t-4`} />
                        <div className='h-10 font-semibold'>
                            Company
                            <span className='text-xs font-medium'>(optional)</span>
                        </div>

                        <textarea
                            // value={company}
                            // onChange={handleCompanyChange}
                            placeholder='Write something enticing about yourself'
                            className='h-24 rounded-lg bg-white p-2 text-black outline outline-1 outline-gray-100'
                        />
                        <div className='mt-8 flex justify-center'>
                            {/* {isImageReady && (
                                <button
                                    title='Save Profile Details'
                                    type='button'
                                    className='mt-4 w-full rounded-full bg-black px-8 py-4 text-white'
                                    // onClick={handleSaveButtonClicked}
                                >
                                    Save
                                </button>
                            )} */}
                        </div>
                        <div className='mt-8 flex justify-center'>
                            <button
                                title='Sign Out'
                                type='button'
                                // onClick={handleSignOut}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    )
}

export default EditUserProfile
