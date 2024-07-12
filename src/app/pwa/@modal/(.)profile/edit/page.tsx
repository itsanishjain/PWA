'use client'

import { getUserInfoAction } from '@/app/pwa/(pages)/profile/actions'
import ProfileForm from '@/app/pwa/(pages)/profile/new/_components/profile-form'
import { Modal } from '@/app/pwa/_components/ui/modal'
import { useEffect, useState } from 'react'

export default function EditProfileModal() {
    const [userData, setUserData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchUserData() {
            const [data, err] = await getUserInfoAction()
            if (err) {
                console.error(err)
                setError('Error loading user data')
            } else if (data && 'needsRefresh' in data) {
                setError('Loading...')
            } else {
                setUserData(data)
            }
        }
        fetchUserData()
    }, [])

    if (error) return <Modal>{error}</Modal>

    return <Modal>{userData ? <ProfileForm userInfo={userData} /> : 'Loading...'}</Modal>
}
