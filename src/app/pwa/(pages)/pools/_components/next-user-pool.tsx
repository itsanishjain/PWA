import route from '@/lib/utils/routes'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { getUserNextPoolAction } from '../actions'
import PoolList from './pool-list'

export default async function NextUserPool() {
    const [pools] = await getUserNextPoolAction()

    if (!pools || (pools && 'needsRefresh' in pools)) {
        return null
    }

    return (
        <>
            <Link href={route['/my-pools']} className='flex justify-between'>
                <h1 className='text-lg font-semibold'>Your Pools</h1>
                <ChevronRightIcon className='size-6 text-[#1a70e0]' />
            </Link>
            <PoolList pools={[pools]} />
        </>
    )
}
