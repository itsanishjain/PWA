import { fetchPastPools } from '@/lib/api/clientAPI'
import { poolData } from '@/types/types'
import React, { useEffect, useState } from 'react'
import PoolRow from '../poolRow'

const PastPoolTab: React.FC = () => {
	const [poolsData, setPoolsData] = useState<poolData[] | undefined>([])

	const fetchPoolsData = async () => {
		const retrievedPoolsData = await fetchPastPools()
		setPoolsData(retrievedPoolsData)
	}

	useEffect(() => {
		fetchPoolsData()
	}, [])

	return (
		<div className='mt-8 flex h-full w-full grow flex-col space-y-4'>
			{poolsData?.map((pool) => {
				return (
					<PoolRow
						key={pool.pool_id}
						title={pool.pool_name}
						poolImagePath={pool.pool_image_url}
						registered={pool.participant_count}
						capacity={pool.soft_cap}
						startTime={pool.event_timestamp}
						poolId={pool.pool_id}
					/>
				)
			})}
		</div>
	)
}

export default PastPoolTab
