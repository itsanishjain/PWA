import React, { useEffect, useState } from 'react'
import rightArrow from '@/public/images/right_arrow.svg'
import frogImage from '@/public/images/frog.png'
import circleTick from '@/public/images/circle-tick.svg'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	fetchAllPoolDataFromDB,
	fetchUserDisplayForAddress,
	fetchWinnersDetailsFromSC,
} from '@/lib/api/clientAPI'
import router from 'next/router'
import * as _ from 'lodash'
import { ParticipantStatus } from './participantRow'
import { ethers } from 'ethers'
import {
	getAllIndicesMatching,
	getRowsByColumnValue,
	getValuesFromIndices,
} from '@/lib/utils'

import { useWallets } from '@privy-io/react-auth'

interface ClaimablePoolRowProps {
	poolId: string
}

const ClaimablePoolRow: React.FC<ClaimablePoolRowProps> = ({ poolId }) => {
	const { wallets } = useWallets()

	const { data: poolData } = useQuery({
		queryKey: ['fetchAllPoolDataFromDB', poolId],
		queryFn: fetchAllPoolDataFromDB,
		enabled: !_.isEmpty(poolId),
	})

	const { data: poolWinnersDetails } = useQuery({
		queryKey: ['fetchWinnersDetailsFromSC', poolId?.toString() ?? ' '],
		queryFn: fetchWinnersDetailsFromSC,
		enabled: !!poolId,
	})
	const matchingAddressIndices = getAllIndicesMatching(
		poolWinnersDetails?.[0],
		wallets?.[0]?.address,
	)
	const userWonDetails = getValuesFromIndices(
		poolWinnersDetails?.[1],
		matchingAddressIndices,
	)

	const claimableDetails = getRowsByColumnValue(userWonDetails, 3, false)
	const totalWinningAmount = userWonDetails?.reduce(
		(acc: number, curr: any) => acc + curr[0],
		BigInt(0),
	)

	return (
		<div className='flex flex-row space-x-4 py-4'>
			<img
				src={`${poolData?.poolImageUrl ?? frogImage.src}`}
				className=' flex rounded-xl w-14 h-14 object-cover'
			></img>
			<div className='flex flex-1 flex-col '>
				<h4 className='font-medium text-lg '>
					{poolData?.poolDBInfo?.['pool_name'] ?? ` Pool Id ${poolId}`}
				</h4>
				<p className={`fontCheckedIn font-semibold`}>Winner</p>
			</div>
			{
				<div className='flex flex-row items-center justify-center space-x-2'>
					<div>
						<img className='w-6 h-6' src={circleTick.src} />
					</div>
					<div className='rounded-2xl paidBackground px-6 py-4 fontCheckedIn font-medium'>
						{ethers.formatEther(totalWinningAmount ?? 0).toString()} USD
					</div>
				</div>
			}
		</div>
	)
}

export default ClaimablePoolRow