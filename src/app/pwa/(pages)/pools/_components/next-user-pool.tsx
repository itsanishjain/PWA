import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { getUserNextPoolAction } from '../actions'
import PoolList from './pool-list'
import { Route } from 'next'

export default async function NextUserPool() {
    const [pools] = await getUserNextPoolAction()

    if (!pools || (pools && 'needsRefresh' in pools)) {
        return null
    }

    return (
        <>
            <Link href={'/my-pools' as Route} className='flex justify-between'>
                <h1 className='text-lg font-semibold'>Your Pools</h1>
                <ChevronRightIcon className='size-6 text-[#1a70e0]' />
            </Link>
            <PoolList pools={[pools]} />
        </>
    )
}
