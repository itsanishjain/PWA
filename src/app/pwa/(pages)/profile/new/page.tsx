'use client'

import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import type { ProfileDraft } from '@/app/pwa/_client/stores/create-profile.store'
import { useCreateProfileStore } from '@/app/pwa/_client/stores/create-profile.store'
import { Button } from '@/app/pwa/_components/ui/button'
import { Label } from '@/app/pwa/_components/ui/label'
import { usePrivy } from '@privy-io/react-auth'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { createProfileAction } from './actions'

const AvatarUploader = dynamic(() => import('./_components/avatar-uploader'), {
    ssr: false,
})

const Text = dynamic(() => import('@/app/pwa/_components/forms-controls/text.control'), {
    ssr: false,
})

const formFields: Array<{
    name: string
    key: keyof ProfileDraft
    label: string
    description: string
    component: typeof AvatarUploader | typeof Text
}> = [
    {
        key: 'avatar',
        name: 'avatar',
        label: 'User Image',
        description: 'Choose your account image',
        component: AvatarUploader,
    },
    {
        key: 'displayName',
        name: 'displayName',
        label: 'User Name',
        description: 'Choose a user name',
        component: Text,
    },
]

type FormState = {
    message?: string
    errors?: {
        displayName: []
        avatar: []
    }
}

const initialState: FormState = {
    message: '',
    errors: {
        displayName: [],
        avatar: [],
    },
}

const ProfileForm = ({ userId }: { userId: string }) => {
    const router = useRouter()

    const { setBottomBarContent, setTopBarTitle } = useSettingsStore(s => ({
        setBottomBarContent: s.setBottomBarContent,
        setTopBarTitle: s.setTopBarTitle,
    }))

    const { profileDraft, setProfileDraft, resetProfileDraft } = useCreateProfileStore(userId)(s => ({
        profileDraft: s.profileDraft,
        setProfileDraft: s.setProfileDraft,
        resetProfileDraft: s.resetProfileDraft,
    }))

    const [state, action] = useFormState(createProfileAction, initialState)
    const { pending } = useFormStatus()

    useEffect(() => {
        if (state?.message) {
            toast(state.message)
        }
    }, [state?.message])

    useEffect(() => {
        setTopBarTitle('Create a Profile')
        setBottomBarContent(
            <Button
                type='submit'
                disabled={pending || Boolean(state.message)}
                className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'
                onClick={() => document.querySelector('form')?.requestSubmit()}>
                {pending ? 'Saving...' : 'Save'}
            </Button>,
        )

        return () => {
            setTopBarTitle(null)
            setBottomBarContent(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (state?.message === 'Profile created successfully') {
            resetProfileDraft()
            router.back()
            state.message = ''
        }
    }, [state?.message])

    return (
        <form action={action} className='mx-auto flex w-full max-w-full flex-col'>
            {formFields.map(field => {
                const errors = state?.errors?.[field.key] || []

                return (
                    <section key={field.key} className='flex flex-1 flex-col'>
                        <Label className='text-base font-medium text-[#090909]'>{field.label}</Label>
                        <p className='mb-4 mt-1.5 text-xs font-medium text-[#b2b2b2]'>{field.description}</p>
                        <field.component
                            name={field.name}
                            value={profileDraft[field.key] as string}
                            onChange={newValue => setProfileDraft(field.key, newValue)}
                        />
                        {errors && <p className='mt-1 text-xs text-red-500'>{errors}</p>}
                        <p aria-live='polite' className='sr-only'>
                            {state?.message}
                        </p>
                    </section>
                )
            })}
        </form>
    )
}

export default function NewProfilePage() {
    const router = useRouter()
    const { ready, user } = usePrivy()

    useEffect(() => {
        if (ready && !user) {
            router.back()
        }
    }, [ready, user, router])

    if (!ready || !user) {
        return <div className='flex-center mx-6'>Loading...</div>
    }

    return <ProfileForm userId={user.id} />
}
