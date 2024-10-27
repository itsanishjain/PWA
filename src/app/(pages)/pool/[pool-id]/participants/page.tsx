import { getUserAdminStatusActionWithCookie } from '@/features/users/actions'
import Participants from './_components/participants'

type Props = { params: { 'pool-id': string } }

export default async function ManageParticipantsPage({ params: { 'pool-id': poolId } }: Props) {
    const isAdmin = await getUserAdminStatusActionWithCookie()

    return <Participants poolId={poolId} isAdmin={isAdmin} />
}
