import frogImage from '@/public/images/frog.png'
import rightArrow from '@/public/images/right_arrow.svg'
import React, { useEffect, useState } from 'react'

import { formatTimeDiff } from '@/lib/utils'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import * as _ from 'lodash'
import Link from 'next/link'

interface PoolRowProps {
	title: string
	poolImagePath: string
	registered: number
	capacity: number
	startTime: Date
	poolId: number
}

const PoolRow: React.FC<PoolRowProps> = ({
	title,
	poolImagePath: poolImagePath,
	registered,
	capacity,
	startTime,
	poolId,
}) => {
	const currentTimestamp: Date = new Date()
	const startDateObject: Date = new Date(startTime)
	const timeLeft = startDateObject.getTime() - currentTimestamp.getTime()
	const { days: daysLeft } = formatTimeDiff(timeLeft)

	const [poolImageUrl, setPoolImageUrl] = useState<string | undefined>()

	const supabaseClient = createSupabaseBrowserClient()

	const loadPoolImage = async () => {
		if (_.isEmpty(poolImagePath)) {
			return
		}
		const { data: storageData } = supabaseClient.storage
			.from('pool')
			.getPublicUrl(poolImagePath)
		setPoolImageUrl(storageData.publicUrl)
	}

	useEffect(() => {
		console.log('poolImagePath', poolImagePath)
		loadPoolImage()
	}, [poolImagePath])

	const trailingSlash =
		window?.location?.href[window?.location?.href.length - 1] == '/' ? '' : '/'
	return (
		<Link
			href={`${window.location.href}${trailingSlash}pool-id/${poolId}`}
			className='flex flex-row space-x-4'
		>
			<div className='relative size-20 overflow-hidden rounded-2xl bg-red-500'>
				<img
					src={`
						${_.isEmpty(poolImageUrl) ? frogImage.src : poolImageUrl}
					`}
					className='size-full bg-black object-cover object-center'
				/>
				<div className='absolute bottom-0 w-full bg-black bg-opacity-40 py-1 text-center text-xs text-white'>
					Upcoming
				</div>
			</div>
			<div className='flex grow flex-col justify-evenly py-1'>
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
				<img src={`${rightArrow.src}`} />
			</div>
		</Link>
	)
}

export default PoolRow
