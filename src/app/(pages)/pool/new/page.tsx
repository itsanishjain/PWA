import { getAdminStatusAction } from '../../pools/actions'
import CreatePoolForm from './create-pool-form'

export default async function CreatePoolPage() {
    const [isAdmin] = await getAdminStatusAction()

    if (!isAdmin) {
        return <div className={'mt-4 w-full text-center'}>You are not authorized to create a pool.</div>
    }

    return <CreatePoolForm />
}
