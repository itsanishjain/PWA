'use server'

import { authenticatedProcedure } from '@/app/pwa/_server/procedures/authenticated'
import { createProfileUseCase } from '@/app/pwa/_server/use-cases/users/create-user'
import { updateProfileUseCase } from '@/app/pwa/_server/use-cases/users/update-profile'
import { CreateProfileFormSchema } from './_lib/definitions'
import { z } from 'zod'
import { Address } from 'viem'
import { isAdminUseCase } from '@/app/pwa/_server/use-cases/users/is-admin'

type FormState = {
    message?: string
    errors?: {
        displayName?: string[]
        avatar?: string[]
    }
}

export async function validateProfileAction(_prevState: FormState, formData: FormData): Promise<FormState> {
    const avatarFile = formData.get('avatar') as File | null
    const displayName = formData.get('displayName') as string

    console.log('Validating profile form', { displayName, avatarFile })

    let avatarToUpdate: File | null | undefined

    if (avatarFile instanceof File) {
        if (avatarFile.size === 0) {
            // If size is 0, we want to delete the avatar
            avatarToUpdate = null
        } else if (avatarFile.size > 0) {
            // If size is greater than 0, we want to update the avatar
            avatarToUpdate = avatarFile
        }
    } else {
        // If avatarFile is null, we don't want to touch the avatar
        avatarToUpdate = undefined
    }

    try {
        console.log('Updating profile')
        const [, error] = await updateProfileAction({
            displayName,
            avatar: avatarToUpdate,
        })

        if (error) {
            return {
                message: 'Error updating profile',
                errors: {
                    displayName: error.fieldErrors?.displayName,
                    avatar: error.fieldErrors?.avatar,
                },
            }
        }

        return {
            message: 'Profile updated successfully',
        }
    } catch (error) {
        return {
            message: 'Error updating profile',
        }
    }
}

export const updateProfileAction = authenticatedProcedure
    .createServerAction()
    .input(
        CreateProfileFormSchema.extend({
            avatar: z.union([z.instanceof(File), z.null(), z.undefined()]),
        }),
    )
    .output(
        z.object({
            message: z.string(),
            errors: z
                .object({
                    displayName: z.array(z.string()).optional(),
                    avatar: z.array(z.string()).optional(),
                })
                .optional(),
        }),
    )
    .handler(async ({ input, ctx: { user } }) => {
        try {
            await updateProfileUseCase(user.id, {
                displayName: input.displayName,
                avatar: input.avatar,
            })
            return {
                message: 'Profile updated successfully',
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            return {
                message: 'Error updating profile',
                errors: {
                    displayName: ['An unexpected error occurred'],
                },
            }
        }
    })

export const createProfileAction = authenticatedProcedure
    .createServerAction()
    .output(
        z.object({
            needsRefresh: z.boolean().optional(),
        }),
    )
    .handler(async ({ ctx: { user } }) => {
        const walletAddress = user.wallet?.address as Address
        if (!walletAddress) {
            throw new Error('User does not have a wallet address')
        }
        try {
            await createProfileUseCase({
                privyId: user.id,
                info: {
                    walletAddress,
                    role: (await isAdminUseCase(walletAddress)) ? 'admin' : 'user',
                },
            })
            return {}
        } catch (error) {
            console.error('Error creating user:', error)
            throw new Error('Failed to create user')
        }
    })
