'use server'

import { validateRequest } from '@/app/pwa/_server/auth/auth'
import { getPrivyUser } from '@/app/pwa/_server/auth/privy'
import { authenticatedAction } from '@/app/pwa/_server/lib/safe-action'
import { createUserUseCase } from '@/app/pwa/_server/use-cases/users/create-user'
import { updateProfileUseCase } from '@/app/pwa/_server/use-cases/users/update-profile'
import { CreateProfileFormSchema } from './_lib/definitions'

type FormState = {
    message?: string
    errors?: {
        displayName?: string[]
        avatar?: string[]
    }
}

export async function createProfileAction(_prevState: FormState, formData: FormData): Promise<FormState> {
    const user = await getPrivyUser()

    if (!user) {
        return {
            message: 'Not connected with Privy',
        }
    }

    const avatarFile = formData.get('avatar') as string | null
    const displayName = formData.get('displayName') as string

    // Validate fields
    const validationResult = CreateProfileFormSchema.safeParse({
        displayName,
        avatar: avatarFile,
    })

    if (!validationResult.success) {
        return {
            message: 'Invalid form data',
            errors: validationResult.error.flatten().fieldErrors,
        }
    }

    try {
        await updateProfileUseCase(user.id, { displayName, avatar: avatarFile })
        console.log('Profile updated successfully')
        return {
            message: 'Profile created successfully',
        }
    } catch (error) {
        console.log('Error updating profile:', error)
        return {
            message: 'Error updating profile',
        }
    }
    // TODO: Create session
}

export const createUserAction = authenticatedAction
    .createServerAction()
    .handler(async (): Promise<void | { needsRefresh: true } | null> => {
        console.log('createUserAction called')
        const { session, needsRefresh } = await validateRequest()

        if (needsRefresh) {
            console.log('Needs refresh')
            return { needsRefresh: true }
        }

        if (!session || !session.address) {
            console.log('User not authenticated or address not available')
            throw new Error('User not authenticated or address not available')
        }

        await createUserUseCase({
            privyId: session.id,
            info: { walletAddress: session.address, role: session.isAdmin ? 'admin' : 'user' },
        })
    })
