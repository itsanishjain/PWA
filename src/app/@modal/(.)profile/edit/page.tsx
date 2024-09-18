'use client'

import { getUserInfoAction } from '@/app/(pages)/profile/actions'
import ProfileForm from '@/app/(pages)/profile/edit/_components/profile-form'
import { useServerActionQuery } from '@/app/_client/hooks/server-action-hooks'
import { Modal } from '@/app/_components/ui/modal'

export default function EditProfileModal() {
    const {
        data: userInfo,
        isLoading,
        isSuccess,
    } = useServerActionQuery(getUserInfoAction, {
        queryKey: ['getUserInfoAction'],
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
