import { Skeleton } from '../../_components/ui/skeleton'
import PoolsSkeleton from './_components/pools-skeleton'

export default function PoolsLoader() {
    // <section className='flex h-dvh flex-col items-center justify-center'>
    //     <h1 className='text-[0.875rem] font-semibold'>Loading...</h1>
    //     <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900'></div>
    // </section>
    return (
        <div className='space-y-6'>
            <Skeleton className='detail_card mt-2 min-h-28 w-full rounded-3xl p-6' />
            <PoolsSkeleton title='Your Pools' length={1} />
            <PoolsSkeleton title='Upcoming Pools' length={7} />
        </div>
    )
}
