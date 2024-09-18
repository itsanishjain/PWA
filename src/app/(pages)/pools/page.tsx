import Balance from '@/app/_components/balance/balance'
import NextUserPool from './_components/next-user-pool'
import { AuthenticatedGuard } from '@/components/authenticated-guard'
import UpcomingPools from './_components/upcoming-pools'
import RenderBottomBar from './_components/render-bottom-bar'

export default async function PoolsPage() {
    return (
        <div className='flex flex-1 flex-col space-y-6'>
            <Balance />
            <AuthenticatedGuard loading={null}>
                <NextUserPool />
                <RenderBottomBar />
            </AuthenticatedGuard>

            <UpcomingPools />
        </div>
    )
}
