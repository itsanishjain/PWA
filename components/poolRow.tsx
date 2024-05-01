import React, { useEffect, useState } from 'react'
import rightArrow from '@/public/images/right_arrow.svg'
import frogImage from '@/public/images/frog.png'

import { formatTimeDiff } from '@/lib/utils'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'

interface PoolRowProps {
	title: string
	poolImagePath: string
	registered: number
	capacity: number
	startTime: Date
	poolId: number
	handlePoolRowClicked: (poolId: number) => void
}

const PoolRow: React.FC<PoolRowProps> = ({
	title,
	poolImagePath: poolImagePath,
	registered,
	capacity,
	startTime,
	poolId,
	handlePoolRowClicked,
}) => {
	const currentTimestamp: Date = new Date()
	const startDateObject: Date = new Date(startTime)
	const timeLeft = startDateObject.getTime() - currentTimestamp.getTime()
	const { days: daysLeft } = formatTimeDiff(timeLeft)

	const [poolImageUrl, setPoolImageUrl] = useState<String | undefined>()

	const supabaseClient = createSupabaseBrowserClient()

	const loadPoolImage = async () => {
		if (poolImagePath == undefined || poolImagePath == null) {
			return
		}
		const { data: storageData } = supabaseClient.storage
			.from('pool')
			.getPublicUrl(poolImagePath)
		setPoolImageUrl(storageData.publicUrl)
	}

	useEffect(() => {
		loadPoolImage()
	}, [])

	return (
		<div className='flex flex-row space-x-4'>
			<div className='relative w-20 h-20 rounded-2xl overflow-hidden bg-red-500'>
				<img
					src={`${poolImageUrl ?? frogImage.src}`}
					className='bg-black w-full h-full object-cover object-center'
				></img>
				<div className='absolute bottom-0 bg-black bg-opacity-40 text-xs w-full text-center text-white py-1'>
					Upcoming
				</div>
			</div>
			<div
				className='flex flex-grow flex-col justify-evenly py-1'
				onClick={() => handlePoolRowClicked(poolId)}
			>
				<h3 className='font-semibold'>{title}</h3>
				<p className='text-sm'>
					{registered}/{capacity} registered
				</p>
				{daysLeft >= 0 ? (
					<p className='text-sm'>Starts in {daysLeft} d</p>
				) : (
					<p className='text-sm'>Ended</p>
				)}
			</div>
			<div className=' flex flex-col items-center justify-center'>
				<img src={`${rightArrow.src}`}></img>
			</div>
		</div>
	)
}

export default PoolRow
