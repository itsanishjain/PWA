import Balance from '../../_components/balance/balance'
import AuthenticatedContent from './_components/authenticated-content'
import NextUserPool from './_components/next-user-pool'
import RenderBottomBar from './_components/render-bottom-bar'
import UpcomingPools from './_components/upcoming-pools'
import { getPoolsPageAction } from './actions'

export default async function PoolsPage() {
    const { balance, isAdmin, pools, nextPool } = await getPoolsPageAction()

    return (
        <div className='space-y-6'>
            <Balance initialBalance={balance} />
            <NextUserPool initialNextPool={nextPool} />
            <UpcomingPools initialPools={pools} />
            <RenderBottomBar isAdmin={isAdmin} />
        </div>
    )
}
