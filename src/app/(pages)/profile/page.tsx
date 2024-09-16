import Title from '../../_components/title'
import Balance from '@/app/pwa/_components/balance/balance'
import UserInfo from './_components/user-info/user-info'
import { ClaimablePrizes } from './claim-winning/_components'
import { getProfilePageAction } from './actions'

export default async function ProfilePage() {
    const { balance, userInfo } = await getProfilePageAction()

    return (
        <div className='space-y-[0.94rem] bg-white p-2'>
            <Title title='User Profile' />
            <UserInfo initialUserInfo={userInfo} />
            <Balance color='#5472E9' initialBalance={balance} />
            <ClaimablePrizes />
        </div>
    )
}
