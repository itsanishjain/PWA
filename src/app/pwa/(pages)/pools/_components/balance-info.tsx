import { getAddressBalanceAction } from '../../profile/actions'
import Balance from './balance'

export default async function PoolsBalance() {
    const [balanceResult] = await getAddressBalanceAction()

    return <Balance initialBalance={balanceResult} />
}
