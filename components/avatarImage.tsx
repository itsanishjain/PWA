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

interface AvatarImageProps {
	address: string
}

const AvatarImage: React.FC<AvatarImageProps> = ({ address }) => {
	const { data: profileData } = useQuery({
		queryKey: ['loadProfileImage', address],
		queryFn: fetchUserDisplayForAddress,
		enabled: !_.isEmpty(address),
	})

	return (
		<img
			src={`${profileData?.profileImageUrl ?? frogImage.src}`}
			className=' flex rounded-full w-full h-full'
		></img>
	)
}

export default AvatarImage
