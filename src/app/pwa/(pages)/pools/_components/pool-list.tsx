import { Skeleton } from '@/app/pwa/_components/ui/skeleton'
import dynamic from 'next/dynamic'

interface PoolItem {
    name: string
    image: string
    startDate: Date
    endDate: Date
    id: string
    status: string
    numParticipants: number
    softCap: number
}

const PoolCardSkeleton = () => {
    return (
        <Skeleton className='flex h-24 items-center gap-[14px] rounded-[2rem] bg-[#f4f4f4] p-3 pr-4'>
            <Skeleton className='size-[72px] rounded-[16px] bg-[#36a0f7]/20' />
            <div className='flex flex-col gap-[5px]'>
                <Skeleton className='h-4 w-10 bg-[#36a0f7]/20' />
                <Skeleton className='h-4 w-16 bg-[#36a0f7]/20' />
                <Skeleton className='h-4 w-28 bg-[#36a0f7]/20' />
            </div>
        </Skeleton>
    )
}

const PoolCard = dynamic(() => import('./pool-list-card'), {
    loading: () => <PoolCardSkeleton />,
    ssr: false,
})

export default function PoolList({ pools }: { pools: PoolItem[] }) {
    return (
        <div className='flex flex-col gap-4'>
            {pools.map(pool => (
                <PoolCard key={pool.id} {...pool} />
            ))}
        </div>
    )
}
