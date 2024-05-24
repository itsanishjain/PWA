import circleTick from '@/public/images/circle-tick.svg'
import frogImage from '@/public/images/frog.png'

import { fetchUserDisplayForAddress } from '@/lib/api/clientAPI'
import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'
import * as _ from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import { ParticipantStatus } from './participantRow'

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
	participantStatus,
	address,
	routeUrl,
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
			className='bottomDivider flex flex-row space-x-4 py-4'
			href={routeUrl ?? '/'}
		>
			<Image
				alt='profile'
				src={`${profileData?.profileImageUrl ?? frogImage.src}`}
				className=' flex size-14 rounded-full object-cover'
			/>
			<div className='flex flex-1 flex-col '>
				<h4 className='text-lg font-medium'>{name}</h4>
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
						<Image alt='circle tick' className='size-6' src={circleTick.src} />
					</div>
					<div className='paidBackground fontCheckedIn rounded-2xl px-6 py-4 font-medium'>
						{ethers.formatEther(prizeAmount ?? 0).toString()} USD
					</div>
				</div>
			) : (
				<div className='flex flex-row items-center justify-center space-x-2'>
					<div className='fontUnpaid backgroundUnpaid rounded-2xl px-6 py-4 font-medium'>
						{ethers.formatEther(prizeAmount ?? 0).toString()} USD
					</div>
				</div>
			)}
		</Link>
	)
}

export default WinnerRow
