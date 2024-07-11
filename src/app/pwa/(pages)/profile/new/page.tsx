'use client'

import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { Button } from '@/app/pwa/_components/ui/button'
import { Label } from '@/app/pwa/_components/ui/label'
import { usePrivy } from '@privy-io/react-auth'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'
import { createProfileAction } from './actions'

const AvatarUploader = dynamic(() => import('./_components/avatar-uploader'), {
    ssr: false,
})

const Text = dynamic(() => import('@/app/pwa/_components/forms-controls/text.control'), {
    ssr: false,
})

const formFields = [
    {
        key: 'avatar' as const,
        name: 'avatar',
        label: 'User Image',
        description: 'Choose your account image',
        component: AvatarUploader,
    },
    {
        key: 'displayName' as const,
        name: 'displayName',
        label: 'User Name',
        description: 'Choose a user name',
        component: Text,
    },
] as const

type FormFieldKey = (typeof formFields)[number]['key']

const initialState = {
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

    const [state, formAction] = useFormState(createProfileAction, initialState)

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
                form='profile-form'
                className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                Save
            </Button>,
        )

        return () => {
            setTopBarTitle(null)
            setBottomBarContent(null)
        }
    }, [setBottomBarContent, setTopBarTitle])

    useEffect(() => {
        if (state?.message === 'Profile created successfully') {
            router.back()
        }
    }, [state?.message, router])

    return (
        <form id='profile-form' action={formAction} className='mx-auto flex w-full max-w-full flex-col'>
            {formFields.map(field => {
                const errors = state?.errors && field.key in state.errors ? state.errors[field.key as FormFieldKey] : []

                return (
                    <section key={field.key} className='flex flex-1 flex-col'>
                        <Label className='text-base font-medium text-[#090909]'>{field.label}</Label>
                        <p className='mb-4 mt-1.5 text-xs font-medium text-[#b2b2b2]'>{field.description}</p>
                        <field.component name={field.name} />
                        {errors && errors.length > 0 && (
                            <p className='mt-1 text-xs text-red-500'>{errors.join(', ')}</p>
                        )}
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
