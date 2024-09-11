'use client'

import { getUserInfoAction } from '@/app/pwa/(pages)/profile/actions'
import ProfileForm from '@/app/pwa/(pages)/profile/new/_components/profile-form'
import { useServerActionQuery } from '@/app/pwa/_client/hooks/server-action-hooks'
import { Modal } from '@/app/pwa/_components/ui/modal'

export default function EditProfileModal() {
    const {
        data: userInfo,
        isLoading,
        isSuccess,
    } = useServerActionQuery(getUserInfoAction, {
        queryKey: ['userInfo'],
        input: undefined,
    })

    if (isLoading) return <>Loading...</>

    if (isSuccess && !userInfo) return <>Error loading user data</>

    console.log('userInfo', userInfo)

    return (
        <Modal>
            <ProfileForm userInfo={userInfo} />
        </Modal>
    )
}
