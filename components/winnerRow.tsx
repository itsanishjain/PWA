import React, { useEffect, useState } from 'react'
import rightArrow from '@/public/images/right_arrow.svg'
import frogImage from '@/public/images/frog.png'
import circleTick from '@/public/images/circle-tick.svg'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	fetchAllPoolDataFromSC,
	fetchUserDisplayForAddress,
} from '@/lib/api/clientAPI'
import router from 'next/router'
import * as _ from 'lodash'
import Link from 'next/link'
import { ParticipantStatus } from './participantRow'
import { ethers } from 'ethers'

interface WinnerRowProps {
	name?: string
	imageUrl?: string
	participantStatus: number
	address: string
	routeUrl?: string
	hasClaimed?: boolean
	prizeAmount?: string
	setWinner: boolean
}

const WinnerRow: React.FC<WinnerRowProps> = ({
	name,
	imageUrl,
	participantStatus,
	address,
	routeUrl,
	hasClaimed,
	prizeAmount,
	setWinner,
}) => {
	const { data: profileData } = useQuery({
		queryKey: ['loadProfileImage', address],
		queryFn: fetchUserDisplayForAddress,
		enabled: !_.isEmpty(address),
	})

	return (
		<Link
			className='flex flex-row space-x-4 bottomDivider py-4'
			href={routeUrl ?? '/'}
		>
			<img
				src={`${profileData?.profileImageUrl ?? frogImage.src}`}
				className=' flex rounded-full w-14 h-14 object-cover'
			></img>
			<div className='flex flex-1 flex-col '>
				<h4 className='font-medium text-lg'>{name}</h4>
				<p
					className={`${
						participantStatus == ParticipantStatus.Registered
							? 'fontRegistered'
							: ' '
					}
					${participantStatus == ParticipantStatus['Checked In'] ? 'fontCheckedIn' : ' '}
					`}
				>
					{ParticipantStatus[participantStatus]}
				</p>
			</div>
			{setWinner ? (
				<div className='flex flex-row items-center justify-center space-x-2'>
					<div>
						<img className='w-6 h-6' src={circleTick.src} />
					</div>
					<div className='rounded-2xl paidBackground px-6 py-4 fontCheckedIn font-medium'>
						{ethers.formatEther(prizeAmount ?? 0).toString()} USD
					</div>
				</div>
			) : (
				<div className='flex flex-row items-center justify-center space-x-2'>
					<div className='rounded-2xl px-6 py-4 fontUnpaid backgroundUnpaid font-medium'>
						{ethers.formatEther(prizeAmount ?? 0).toString()} USD
					</div>
				</div>
			)}
		</Link>
	)
}

export default WinnerRow
