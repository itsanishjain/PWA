'use server'

import { db } from '@/app/_server/database/db'
import { createPoolUseCase } from '@/app/_server/use-cases/pools/create-pool'
import { CreatePoolFormSchema } from './_lib/definitions'
import { verifyToken } from '@/app/_server/auth/privy'
import { getAdminStatusAction, getUserAddressAction } from '../../pools/actions'
import { currentTokenAddress } from '@/app/_server/blockchain/server-config'

type FormState = {
    message?: string
    errors?: {
        bannerImage: string[]
        name: string[]
        dateRange: string[]
        description: string[]
        price: string[]
        softCap: string[]
        termsURL: string[]
    }
    internalPoolId?: string
    poolData?: {
        name: string
        startDate: string
        endDate: string
        price: string
    }
}

export async function createPoolAction(_prevState: FormState, formData: FormData): Promise<FormState> {
    console.log('createPoolAction started')
    const walletAddress = await getUserAddressAction()
    const isAdmin = await getAdminStatusAction()

    if (!isAdmin) {
        console.log('Unauthorized user')
        return {
            message: 'Unauthorized user',
        }
    }

    const bannerImage = formData.get('bannerImage') as File

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const termsURL = formData.get('termsURL') as string
    const softCap = formData.get('softCap') as string
    const price = formData.get('price') as string
    // TODO: implement token address
    // const tokenAddress = formData.get('tokenAddress') as Address
    const dateRangeString = formData.get('dateRange')
    let dateRange: { start: string; end: string } | null = null

    console.log('dateRangeString', dateRangeString)

    if (dateRangeString && typeof dateRangeString === 'string') {
        try {
            const parsedDateRange = JSON.parse(dateRangeString) as { start: string; end: string }

            // Truncate seconds from the date strings
            dateRange = {
                start: parsedDateRange.start.substring(0, 16), // YYYY-MM-DDTHH:MM
                end: parsedDateRange.end.substring(0, 16), // YYYY-MM-DDTHH:MM
            }
        } catch (error) {
            console.error('Error parsing dateRange:', error)
        }
    }

    console.log('dateRange', dateRange)

    if (!dateRange || !dateRange.start || !dateRange.end) {
        return {
            message: 'Invalid date range',
        }
    }

    // Validate fields
    const validationResult = CreatePoolFormSchema.safeParse({
        name,
        bannerImage,
        description,
        termsURL: termsURL || undefined,
        dateRange,
        softCap: Number(softCap),
        price: Number(price),
        // tokenAddress,
    })

    function transformErrors(zodErrors: Record<string, string[]>): FormState['errors'] {
        return {
            bannerImage: zodErrors.bannerImage || [],
            name: zodErrors.name || [],
            dateRange: zodErrors.dateRange || [],
            description: zodErrors.description || [],
            price: zodErrors.price || [],
            softCap: zodErrors.softCap || [],
            termsURL: zodErrors.termsURL || [],
        }
    }

    if (!validationResult.success) {
        console.log('validationResult.error.flatten()', validationResult.error.flatten())
        return {
            message: 'Invalid form data',
            errors: transformErrors(validationResult.error.flatten().fieldErrors),
        }
    }

    try {
        console.log('Attempting to create pool')
        const internalPoolId = await createPoolUseCase(walletAddress, {
            bannerImage,
            name,
            description,
            termsURL,
            softCap: Number(softCap),
            startDate: dateRange.start,
            endDate: dateRange.end,
            price: Number(price),
            tokenAddress: currentTokenAddress,
        })

        console.log('Pool created successfully, internalPoolId:', internalPoolId)

        return {
            message: 'Pool created successfully',
            internalPoolId,
            poolData: {
                name,
                startDate: dateRange.start,
                endDate: dateRange.end,
                price,
            },
        }
    } catch (error) {
        console.error('Error creating pool:', error)
        return { message: 'Error creating pool: ' + (error as Error).message }
    }
}

export async function updatePoolStatus(
    poolId: string,
    status: 'draft' | 'unconfirmed' | 'inactive' | 'depositsEnabled' | 'started' | 'paused' | 'ended' | 'deleted',
    contract_id: number,
) {
    const user = await verifyToken()
    if (!user) {
        throw new Error('User not found trying to add as mainhost')
    }

    const { error } = await db.from('pools').update({ status, contract_id }).eq('internal_id', poolId)

    // TODO: move this to persistence layer
    const { data: userId, error: userError } = await db.from('users').select('id').eq('privyId', user?.id).single()

    if (userError) {
        console.error('Error finding user:', userError)
        throw userError
    }

    // Now insert into pool_participants using the found user ID
    const { error: participantError } = await db.from('pool_participants').insert({
        user_id: userId.id,
        pool_id: contract_id,
        poolRole: 'mainHost',
    })

    if (participantError) {
        console.error('Error adding participant:', participantError)
        throw participantError
    }

    if (error) throw error
}
