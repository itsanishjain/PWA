import { PoolItem } from '@/app/pwa/_lib/entities/models/pool-item'
import PoolListCard from './pool-list-card'

export default function PoolList({ pools }: { pools?: PoolItem[] | null }) {
    if (pools?.length === 0) {
        return (
            <div className='flex-center h-80 flex-col animate-in'>
                <h1 className='mb-4 text-lg font-semibold'>No upcoming pools</h1>
                <p className='text-sm'>Come back later</p>
            </div>
        )
    }

    return <div className='flex flex-col gap-4'>{pools?.map(pool => <PoolListCard key={pool.id} {...pool} />)}</div>
}
