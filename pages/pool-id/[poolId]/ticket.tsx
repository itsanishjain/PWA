import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

import Page from '@/components/page'
import Section from '@/components/section'
import Appbar from '@/components/appbar'

import { createBrowserClient } from '@supabase/ssr'

import QRCode from 'react-qr-code'

import * as _ from 'lodash'
import {
	TransactionReceipt,
	UnsignedTransactionRequest,
	usePrivy,
	useWallets,
} from '@privy-io/react-auth'

import { useReadContract, createConfig, http } from 'wagmi'
import { readContract, readContracts } from '@wagmi/core'
import { foundry, hardhat, mainnet, sepolia } from 'viem/chains'
import { Interface, ethers } from 'ethers'

import {
	chain,
	tokenAddress,
	contractAddress,
	provider,
	dropletIFace,
	poolIFace,
} from 'constants/constant'
import { config } from '@/constants/config'

import poolContract from '@/SC-Output/out/Pool.sol/Pool.json'
import dropletContract from '@/SC-Output/out_old/Droplet.sol/Droplet.json'

import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import DropdownChecklist from '@/components/dropdown-checklist'

import defaultPoolImage from '@/public/images/frog.png'
import qrCodeIcon from '@/public/images/qr_code_icon.svg'
import shareIcon from '@/public/images/share_icon.svg'
import editIcon from '@/public/images/edit_icon.svg'
import tripleDotsIcon from '@/public/images/tripleDots.svg'

import rightArrow from '@/public/images/right_arrow.svg'
import Divider from '@/components/divider'
import { Tables, Database } from '@/types/supabase'
import {
	formatCountdownTime,
	formatEventDateTime,
	formatTimeDiff,
} from '@/lib/utils'
import { PostgrestSingleResponse } from '@supabase/supabase-js'

import {
	fetchAllPoolDataFromDB,
	fetchAllPoolDataFromSC,
	fetchUserDisplayForAddress,
	fetchUserDisplayInfoFromServer,
	fetchParticipantsDataFromServer,
	handleRegister,
	handleRegisterServer,
	handleUnregister,
	handleUnregisterServer,
} from '@/lib/api/clientAPI'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCookie } from '@/hooks/cookie'

import frogImage from '@/public/images/frog.png'
import ParticipantRow from '@/components/participantRow'

export type PoolRow = Database['public']['Tables']['pool']['Row']
export type UserDisplayRow = Database['public']['Tables']['usersDisplay']['Row']

const TicketPage = () => {
	const router = useRouter()

	const { ready, authenticated, user, signMessage, sendTransaction, logout } =
		usePrivy()

	const { wallets } = useWallets()

	const [poolBalance, setPoolBalance] = useState<number>(0)
	const [poolParticipants, setPoolParticipants] = useState<number>(0)

	const [poolDbData, setPoolDbData] = useState<any | undefined>()
	const [poolImageUrl, setPoolImageUrl] = useState<String | undefined>()
	const [cohostDbData, setCohostDbData] = useState<any[]>([])

	const [copied, setCopied] = useState(false)

	const [pageUrl, setPageUrl] = useState('')

	const { currentJwt } = useCookie()

	const poolId = router?.query?.poolId
	const queryClient = useQueryClient()

	const { data: poolSCInfo } = useQuery({
		queryKey: ['fetchAllPoolDataFromSC', poolId?.toString() ?? ' '],
		queryFn: fetchAllPoolDataFromSC,
		enabled: !!poolId,
	})

	const { data: poolDBInfo } = useQuery({
		queryKey: ['fetchAllPoolDataFromDB', poolId?.toString() ?? ' '],
		queryFn: fetchAllPoolDataFromDB,
		enabled: !!poolId,
	})

	const poolSCStatus = poolSCInfo?.[3]

	let poolSCParticipants = poolSCInfo?.[5]
	const poolSCWinners = poolSCInfo?.[6]

	useEffect(() => {
		// Update the document title using the browser API
		if (ready && authenticated) {
			const walletAddress = user!.wallet!.address
			console.log(`Wallet Address ${walletAddress}`)
		}
		console.log('participants', poolSCParticipants)

		setPoolDbData(poolDBInfo?.poolDBInfo)

		console.log('poolDBInfo', poolDBInfo)
		setPageUrl(window?.location.href)
	}, [ready, authenticated, poolSCInfo, poolDBInfo])

	const parentRoute = useMemo(() => {
		const paths = router.asPath.split('/')
		paths.pop() // Remove the last sub-route
		return paths.join('/')
	}, [router.asPath])

	return (
		<Page>
			<Appbar backRoute={`${parentRoute}`} pageTitle='Ticket' />

			<Section>
				<div className='flex flex-col w-full '>
					<div className='relative flex flex-col pt-16 w-full min-h-screen space-y-0 pb-20 md:pb-24 justify-start'>
						<h2 className='text-center text-2xl'>{poolDbData?.pool_name}</h2>
						<div className='flex flex-1 flex-col w-full justify-center items-center'>
							<div className='rounded-3xl flex w-full cardBackground p-12 max-w-lg'>
								{!_.isEmpty(wallets) && (
									<QRCode
										size={256}
										style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
										value={wallets?.[0]?.address}
										viewBox={`0 0 256 256`}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</Section>
		</Page>
	)
}

export default TicketPage
