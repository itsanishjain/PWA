import { getDbUser } from '@/app/_server/persistence/users/db/get-db-user'
import ProfileForm from './_components/profile-form'
import { verifyToken } from '@/app/_server/auth/privy'
import { Tables } from '@/types/db'
import MainContentWrapper from '@/app/_components/main-wrapper'
import { Metadata } from 'next'
import Title from '@/app/_components/title'

type UserInfo = Pick<Tables<'users'>, 'avatar' | 'displayName'> | null

type Props = {
    searchParams: { new?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const title = searchParams.new ? 'Create a Profile' : 'Edit Profile'

    return {
        title: `pool app 🏝️ | ${title}`,
        description: 'Personalize your profile',
        openGraph: {
            images: [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: 'Edit your profile',
            images: ['/og-image.png'],
        },
        icons: {
            icon: '/favicon.ico',
        },
    }
}

export default async function EditProfilePage({ searchParams }: Props) {
    const user = await verifyToken()
    if (!user) {
        return <div>Not authenticated</div>
    }

    const isNewProfile = searchParams.new !== undefined
    const title = isNewProfile ? 'Create a Profile' : 'Edit Profile'

    let userInfo: UserInfo = null
    if (!isNewProfile) {
        userInfo = await getDbUser(user.id)
    }

    return (
        <>
            <Title title={title} />
            <ProfileForm userInfo={userInfo} />
        </>
    )
}
