import PoolDetails from './_components/pool-details'
import { getPoolDetailsAction } from './actions'

export default async function PoolPage({ params }: { params: { 'pool-id': string } }) {
    const [data, error] = await getPoolDetailsAction({ poolId: params['pool-id'] })

    if (error) {
        // TODO: error component with store
        throw error
    }

    return data.pool && <PoolDetails pool={data.pool} />
}
