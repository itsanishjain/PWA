import { getDbUser } from '@/app/_server/persistence/users/db/get-db-user'
import ProfileForm from './_components/profile-form'
import { privy } from '@/app/_server/auth/privy'
import { Tables } from '@/types/db'
import { Metadata } from 'next'
import PageWrapper from '@/components/page-wrapper'
import SkipButton from '@/components/skip-button'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

type UserInfo = Pick<Tables<'users'>, 'avatar' | 'displayName'> | null

export default async function EditProfilePage({ searchParams }: { searchParams: { new?: string } }) {
    const accessToken = cookies().get('privy-token')?.value

    if (!accessToken) {
        redirect('/pools')
    }

    try {
        const user = await privy.getUser({ idToken: accessToken })

        if (!user?.id) {
            redirect('/pools')
        }

        const isNewProfile = searchParams.new !== undefined
        const title = isNewProfile ? 'Create a Profile' : 'Edit Profile'

        let userInfo: UserInfo = null
        if (!isNewProfile) {
            userInfo = await getDbUser(user.id)
        }

        return (
            <PageWrapper
                topBarProps={{
                    title,
                    actionButton: isNewProfile ? <SkipButton /> : null,
                }}>
                <ProfileForm userInfo={userInfo} />
            </PageWrapper>
        )
    } catch (error) {
        throw new Error('Failed to load profile')
    }
}
