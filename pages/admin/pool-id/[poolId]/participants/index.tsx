import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import Page from '@/components/page'
import Section from '@/components/section'
import Appbar from '@/components/appbar'

import { createBrowserClient } from '@supabase/ssr'

import QRCode from 'react-qr-code'

import {
	TransactionReceipt,
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'

import { Tables, Database } from '@/types/supabase'

import {
	fetchAllPoolDataFromDB,
	fetchAllPoolDataFromSC,
	fetchParticipantsDataFromServer,
	fetchSavedPayoutsFromServer,
	fetchWinnersDetailsFromSC,
	handleRegister,
	handleRegisterServer,
	handleUnregister,
	handleUnregisterServer,
} from '@/lib/api/clientAPI'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCookie } from '@/hooks/cookie'

import frogImage from '@/public/images/frog.png'
import searchIcon from '@/public/images/search.svg'
import qrIcon from '@/public/images/qr_code_icon.svg'

import ParticipantRow from '@/components/participantRow'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import WinnerRow from '@/components/winnerRow'
import { dictionaryToArray, dictionaryToNestedArray } from '@/lib/utils'
import { ethers } from 'ethers'

const ManageParticipantsPage = () => {
	const router = useRouter()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	const [poolBalance, setPoolBalance] = useState<number>(0)
	const [poolParticipants, setPoolParticipants] = useState<number>(0)

	const [poolDbData, setPoolDbData] = useState<any | undefined>()
	const [poolImageUrl, setPoolImageUrl] = useState<String | undefined>()
	const [cohostDbData, setCohostDbData] = useState<any[]>([])

	const [winnerAddresses, setWinnerAddresses] = useState<string[] | null>([])
	const [winnerDetails, setWinnerDetails] = useState<string[][] | null>([[]])

	const [pageUrl, setPageUrl] = useState('')

	const { currentJwt } = useCookie()

	const poolId = router?.query?.poolId
	const queryClient = useQueryClient()

	const { data: poolSCInfo } = useQuery({
		queryKey: ['fetchAllPoolDataFromSC', poolId?.toString() ?? ' '],
		queryFn: fetchAllPoolDataFromSC,
		enabled: !!poolId,
	})

	const { data: poolWinnersDetails } = useQuery({
		queryKey: ['fetchWinnersDetailsFromSC', poolId?.toString() ?? ' '],
		queryFn: fetchWinnersDetailsFromSC,
		enabled: !!poolId,
	})

	const { data: poolDBInfo } = useQuery({
		queryKey: ['fetchAllPoolDataFromDB', poolId?.toString() ?? ' '],
		queryFn: fetchAllPoolDataFromDB,
		enabled: !!poolId,
	})

	const poolSCStatus = poolSCInfo?.[3]

	let poolSCParticipants = poolSCInfo?.[5]
	// const poolSCWinners = poolSCInfo?.[6] // Another way of getting winner addresses, but not details

	// const poolSCWinnersLowerCase = poolSCWinners?.map((item: any) => {
	// 	return [item?.[0]?.['0'], item?.[1]?.['0]']]
	// })
	// const winnersDetails = poolSCWinnersLowerCase.some(
	// 	(item: any) => item[0].toLowerCase() === searchString.toLowerCase(),
	// )

	const { data: participantsInfo } = useQuery({
		queryKey: [
			'fetchUserDisplayInfoFromServer',
			poolId?.toString() ?? '0',
			poolSCParticipants,
		],
		queryFn: fetchParticipantsDataFromServer,
		enabled: poolSCParticipants?.length > 0 && poolId?.toString() != undefined,
	})

	const { data: savedPayoutsInfo } = useQuery({
		queryKey: ['fetchSavedPayoutsFromServer', poolId?.toString() ?? '0'],
		queryFn: fetchSavedPayoutsFromServer,
		enabled: poolId?.toString() != undefined,
	})

	const savedPayoutsParticipantsAddress =
		savedPayoutsInfo?.map((participant) => participant?.address) ?? []
	const { data: savedPayoutsParticipantsInfo } = useQuery({
		queryKey: [
			'fetchUserDisplayInfoFromServer',
			poolId?.toString() ?? '0',
			savedPayoutsParticipantsAddress,
		],
		queryFn: fetchParticipantsDataFromServer,
		enabled:
			savedPayoutsParticipantsAddress?.length > 0 &&
			poolId?.toString() != undefined,
	})

	const checkedInParticipantsInfo = participantsInfo?.filter(
		(participant) => participant?.participationData?.[0]?.status == 2,
	)

	const winnersInfo = participantsInfo?.filter(
		(participant) =>
			winnerAddresses?.[0]?.indexOf(
				participant?.participationData?.[0]?.participant_address,
			) != -1,
	)

	const onQrButtonClicked = () => {
		console.log('QR Button Clicked')
	}
	const onPayoutButtonClicked = () => {
		console.log('Payout Button Clicked')
	}
	useEffect(() => {
		// Update the document title using the browser API
		if (ready && authenticated) {
			const walletAddress = user!.wallet!.address
			console.log(`Wallet Address ${walletAddress}`)
		}
		console.log('participants', poolSCParticipants)

		setPoolDbData(poolDBInfo?.poolDBInfo)

		console.log('participantsInfo', JSON.stringify(participantsInfo))

		console.log('poolDBInfo', poolDBInfo)
		console.log('poolSCInfo', poolSCInfo)
		setWinnerAddresses(dictionaryToArray(poolWinnersDetails?.[0]))
		setWinnerDetails(dictionaryToNestedArray(poolWinnersDetails?.[1]))
		console.log('savedPayoutsInfo', savedPayoutsInfo)
		console.log(
			'savedPayoutsParticipantsAddress',
			savedPayoutsParticipantsAddress,
		)
		console.log('savedPayoutsParticipantsInfo', savedPayoutsParticipantsInfo)
		setPageUrl(window?.location.href)
	}, [
		ready,
		authenticated,
		poolSCInfo,
		poolDBInfo,
		participantsInfo,
		poolWinnersDetails,
	])

	const parentRoute = useMemo(() => {
		const paths = router.asPath.split('/')
		paths.pop() // Remove the last sub-route
		return paths.join('/')
	}, [router.asPath])

	return (
		<Page>
			<Appbar backRoute={`${parentRoute}`} pageTitle='Manage Participants' />

			<Section>
				<div className='flex flex-col w-full '>
					<div className='relative flex flex-col pt-16 w-full min-h-screen space-y-0 pb-20 md:pb-24 justify-start'>
						<div className='relative h-10 mb-2'>
							<span className='w-4 h-full absolute left-4 flex items-center'>
								<img className='flex' src={searchIcon.src} />
							</span>
							<button
								className='w-6 h-10 absolute right-0 flex items-center'
								onClick={onQrButtonClicked}
							>
								<span className='w-full h-full flex items-center'>
									<svg
										width='14'
										height='14'
										viewBox='0 0 14 14'
										fill='black'
										xmlns='http://www.w3.org/2000/svg'
									>
										<path
											d='M1.75 6.41667H6.41667V1.75H1.75V6.41667ZM2.91667 2.91667H5.25V5.25H2.91667V2.91667ZM1.75 12.25H6.41667V7.58333H1.75V12.25ZM2.91667 8.75H5.25V11.0833H2.91667V8.75ZM7.58333 1.75V6.41667H12.25V1.75H7.58333ZM11.0833 5.25H8.75V2.91667H11.0833V5.25ZM11.0833 11.0833H12.25V12.25H11.0833V11.0833ZM7.58333 7.58333H8.75V8.75H7.58333V7.58333ZM8.75 8.75H9.91667V9.91667H8.75V8.75ZM7.58333 9.91667H8.75V11.0833H7.58333V9.91667ZM8.75 11.0833H9.91667V12.25H8.75V11.0833ZM9.91667 9.91667H11.0833V11.0833H9.91667V9.91667ZM9.91667 7.58333H11.0833V8.75H9.91667V7.58333ZM11.0833 8.75H12.25V9.91667H11.0833V8.75Z'
											fill='black'
										/>
									</svg>
								</span>
							</button>

							<Input
								placeholder='Search'
								className='rounded-full mb-2 px-10 h-10'
							/>
						</div>
						<Tabs defaultValue='registered' className='w-full'>
							<TabsList className='w-full flex justify-start p-0 space-x-0 md:space-x-8 rounded-none'>
								<TabsTrigger value='registered'>Registered</TabsTrigger>
								<TabsTrigger value='checkedIn'>Checked in</TabsTrigger>
								<TabsTrigger value='winners'>Winners</TabsTrigger>
								<TabsTrigger value='refunded'>Refunded</TabsTrigger>
							</TabsList>
							<TabsContent value='registered'>
								{participantsInfo?.map((participant) => (
									<ParticipantRow
										key={participant?.id}
										name={participant?.display_name}
										participantStatus={
											participant?.participationData?.[0]?.status
										}
										imageUrl={participant?.avatar_url}
										address={participant?.address}
										routeUrl={`${window.location.href}/${participant?.address}`}
									/>
								))}
							</TabsContent>
							<TabsContent value='checkedIn'>
								{checkedInParticipantsInfo?.map((participant) => (
									<ParticipantRow
										key={participant?.id}
										name={participant?.display_name}
										participantStatus={
											participant?.participationData?.[0]?.status
										}
										imageUrl={participant?.avatar_url}
										address={participant?.address}
										routeUrl={`${window.location.href}/${participant?.address}`}
									/>
								))}
							</TabsContent>
							<TabsContent value='winners'>
								{winnersInfo?.map((participant, index) => (
									<WinnerRow
										key={participant?.id}
										name={participant?.display_name}
										participantStatus={
											participant?.participationData?.[0]?.status
										}
										imageUrl={participant?.avatar_url}
										address={participant?.address}
										routeUrl={`${window.location.href}/${participant?.address}`}
										prizeAmount={winnerDetails?.[index]?.[0]}
										setWinner={true}
									/>
								))}
								{savedPayoutsInfo?.map((participant, index) => (
									<WinnerRow
										key={participant?.id}
										name={savedPayoutsParticipantsInfo?.[index]?.display_name}
										participantStatus={
											savedPayoutsParticipantsInfo?.[index]
												?.participationData?.[0]?.status
										}
										address={participant?.address}
										routeUrl={`${window.location.href}/${participant?.address}`}
										prizeAmount={participant?.payout_amount ?? 0}
										setWinner={false}
									/>
								))}
								<div className='fixed flex space-x-2 flex-row bottom-5 md:bottom-6 left-1/2 transform -translate-x-1/2 max-w-screen-md w-full px-6'>
									<button
										className={`bg-black flex text-center justify-center items-center flex-1 h-12 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline `}
										onClick={onPayoutButtonClicked}
									>
										Payout
									</button>
								</div>
							</TabsContent>
							<TabsContent value='refunded'>Refunded</TabsContent>
						</Tabs>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default ManageParticipantsPage
