import React, { useEffect, useState } from 'react'
import rightArrow from '@/public/images/right_arrow.svg'
import frogImage from '@/public/images/frog.png'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	fetchAllPoolDataFromSC,
	fetchUserDisplayForAddress,
} from '@/lib/api/clientAPI'
import router from 'next/router'
import * as _ from 'lodash'

interface ParticipantRowProps {
	name: string
	imageUrl: string
	participantStatus: number
	address: string
}

const ParticipantRow: React.FC<ParticipantRowProps> = ({
	name,
	imageUrl,
	participantStatus,
	address,
}) => {
	const { data: profileData } = useQuery({
		queryKey: ['loadProfileImage', address],
		queryFn: fetchUserDisplayForAddress,
		enabled: !_.isEmpty(address),
	})

	return (
		<div className='flex flex-row space-x-4 bottomDivider py-4'>
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
		</div>
	)
}

export default ParticipantRow

export enum ParticipantStatus {
	Unregistered = 0,
	Registered = 1,
	'Checked In' = 2,
}
