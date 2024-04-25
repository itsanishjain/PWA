import React, { useEffect, useState } from 'react'
import rightArrow from '@/public/images/right_arrow.svg'
import PoolRow from '../poolRow'
import { createSupabaseBrowserClient } from '@/utils/supabase/client'
import { fetchUpcomingPools } from '@/lib/api/clientAPI'
import router from 'next/router'

interface poolData {
	co_host_addresses: null | string
	created_at: string
	created_by: string
	description: string
	event_timestamp: Date
	host_address: string
	link_to_rules: string
	pool_id: number
	pool_image_url: string
	pool_name: string
	price: number
	soft_cap: number
}

const supabase = createSupabaseBrowserClient()

const handlePoolRowClicked = (poolId: number) => {
	const currentRoute = router.pathname
	router.push(`${currentRoute}/pool-id/${poolId}`)
}

const UpcomingPoolTab: React.FC = () => {
	const [poolsData, setPoolsData] = useState<poolData[] | undefined>([])

	const fetchPoolsData = async () => {
		const retrievedPoolsData = await fetchUpcomingPools()
		console.log('poolData', retrievedPoolsData)
		setPoolsData(retrievedPoolsData)
	}

	useEffect(() => {
		fetchPoolsData()
	}, [])

	return (
		<div className='flex flex-col flex-grow mt-8 mb-24 w-full h-full space-y-4'>
			{poolsData?.map((pool) => {
				return (
					<PoolRow
						key={pool.pool_id}
						title={pool.pool_name}
						poolImageUrl={pool.pool_image_url}
						registered={0}
						capacity={pool.soft_cap}
						startTime={pool.event_timestamp}
						poolId={pool.pool_id}
						handlePoolRowClicked={handlePoolRowClicked}
					/>
				)
			})}
		</div>
	)
}

export default UpcomingPoolTab
