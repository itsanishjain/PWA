import { fetchUserDisplayForAddress } from '@/lib/api/clientAPI'
import frogImage from '@/public/images/frog.png'
import { useQuery } from '@tanstack/react-query'
import * as _ from 'lodash'
import Image from 'next/image'
import Link from 'next/link'

export enum ParticipantStatus {
	Unregistered = 0,
	Registered = 1,
	'Checked In' = 2,
}

interface ParticipantRowProps {
	name: string
	imageUrl: string
	participantStatus: ParticipantStatus
	address: string
	routeUrl?: string
}

const ParticipantRow: React.FC<ParticipantRowProps> = ({
	name,
	participantStatus,
	address,
	routeUrl,
}) => {
	const { data: profileData } = useQuery({
		queryKey: ['loadProfileImage', address],
		queryFn: fetchUserDisplayForAddress,
		enabled: !_.isEmpty(address),
	})

	return (
		<Link
			className='bottomDivider flex flex-row space-x-4 py-4'
			href={routeUrl ?? window.location.href}
		>
			<Image
				alt='profile image'
				src={`${profileData?.profileImageUrl ?? frogImage.src}`}
				className='flex size-14 rounded-full object-cover'
				width={56}
				height={56}
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
		</Link>
	)
}

export default ParticipantRow
