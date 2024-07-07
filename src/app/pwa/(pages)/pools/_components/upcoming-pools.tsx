import { getAllPoolsAction } from '../actions'
import PoolList from './pool-list'

export default async function UpcomingPools() {
    const pools = await getAllPoolsAction()

    return (
        // <div className='container mx-auto px-4'>
        <>
            <h1 className='text-lg font-semibold'>Upcoming Pools</h1>
            <PoolList pools={pools} />
        </>
        // </div>
    )
}

// 'use client'

// import PoolList from '@/components/pools/pool-list/pool-list'
// import { useWatchPoolPoolCreatedEvent } from '@/types/contracts'
// import { orderBy } from 'lodash'

// export default function Upcoming() {
//     const data = useWatchPoolPoolCreatedEvent({
//         fromBlock: BigInt(process.env.NEXT_PUBLIC_INITIAL_BLOCK!),
//     })

//     console.log(data)
//     return (
//         // <>
//         // 	<h1 className='font-semibold text-lg'>Upcoming Pools</h1>
//         // 	<PoolList filter={{ status: ['live', 'upcoming'] }} />
//         // </>
//         <div className='container mx-auto text-wrap p-4'>eelooo</div>
//     )
// }
