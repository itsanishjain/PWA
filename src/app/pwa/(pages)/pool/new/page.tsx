'use client'

import { useSponsoredTxn } from '@/app/pwa/_client/hooks/use-sponsored-txn'
import { wagmi } from '@/app/pwa/_client/providers/configs'
import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import type { PoolDraft } from '@/app/pwa/_client/stores/create-pool.store'
import { useCreatePoolStore } from '@/app/pwa/_client/stores/create-pool.store'
import type { DateTimeRangeValue } from '@/app/pwa/_components/forms-controls/date-time-range.control'
import { Button } from '@/app/pwa/_components/ui/button'
import { Label } from '@/app/pwa/_components/ui/label'
import { dropletAddress, poolAbi, poolAddress } from '@/types/contracts'
import { useWallets } from '@privy-io/react-auth'
import type { Route } from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { decodeEventLog, getAbiItem, parseEther } from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { createPoolAction, updatePoolStatus } from './actions'

const CurrencyAmount = dynamic(() => import('@/app/pwa/_components/forms-controls/currency-amount.control'), {
    ssr: false,
})

const DateTimeRange = dynamic(() => import('@/app/pwa/_components/forms-controls/date-time-range.control'), {
    ssr: false,
})

const ImageUploader = dynamic(() => import('@/app/pwa/_components/forms-controls/image-uploader.control'), {
    ssr: false,
})

const NumberControl = dynamic(() => import('@/app/pwa/_components/forms-controls/number.control'), {
    ssr: false,
})

const TextArea = dynamic(() => import('@/app/pwa/_components/forms-controls/text-area.control'), {
    ssr: false,
})

const Text = dynamic(() => import('@/app/pwa/_components/forms-controls/text.control'), {
    ssr: false,
})

type DateRange = {
    start: string
    end: string
}

const formFields: Array<{
    name: string
    key: keyof PoolDraft
    label: string
    description: string
    component:
        | typeof ImageUploader
        | typeof Text
        | typeof DateTimeRange
        | typeof TextArea
        | typeof CurrencyAmount
        | typeof NumberControl
}> = [
    {
        key: 'bannerImage',
        name: 'bannerImage',
        label: 'Choose Image',
        description: 'Update a banner photo; ideal aspect ratio is 2:1',
        component: ImageUploader,
    },
    {
        key: 'name',
        name: 'name',
        label: 'Name of Pool',
        description: 'Enter a name for your Pool',
        component: Text,
    },
    {
        key: 'dateRange',
        name: 'dateRange',
        label: 'Date of Event',
        description: 'Select the start and end date and time of the Pool',
        component: DateTimeRange,
    },
    {
        key: 'description',
        name: 'description',
        label: 'Description',
        description: 'Enter a description for your Pool',
        component: TextArea,
    },
    {
        key: 'price',
        name: 'price',
        label: 'Buy in',
        description: 'What is the price to participate in the Pool?',
        component: CurrencyAmount,
    },
    {
        key: 'softCap',
        name: 'softCap',
        label: 'Soft Cap',
        description: 'Enter the max amount of paid entries allowed to join',
        component: NumberControl,
    },
    {
        key: 'termsURL',
        name: 'termsURL',
        label: 'Link To Rules, Terms, and Conditions',
        description: 'Paste a link to your rules',
        component: Text,
    },
]

type FormState = {
    message?: string
    errors?: {
        bannerImage: []
        name: []
        dateRange: []
        description: []
        price: []
        softCap: []
        termsURL: []
    }
    internalPoolId?: string
}

const initialState: FormState = {
    message: '',
    errors: {
        bannerImage: [],
        name: [],
        dateRange: [],
        description: [],
        price: [],
        softCap: [],
        termsURL: [],
    },
}

export default function CreatePool() {
    const router = useRouter()
    const [toastId, setToastId] = useState<string | number>()

    const { data: hash, isPending, writeContract } = useWriteContract()
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        data: receipt,
    } = useWaitForTransactionReceipt({
        hash,
    })
    const { wallets } = useWallets()
    const { sponsoredTxn } = useSponsoredTxn()

    const { setBottomBarContent, setTopBarTitle } = useSettingsStore(s => ({
        setBottomBarContent: s.setBottomBarContent,
        setTopBarTitle: s.setTopBarTitle,
    }))

    const { poolDraft, setPoolDraft, resetPoolDraft } = useCreatePoolStore(s => ({
        poolDraft: s.poolDraft,
        setPoolDraft: s.setPoolDraft,
        resetPoolDraft: s.resetPoolDraft,
    }))

    const [state, action] = useFormState(createPoolAction, initialState)
    const { pending } = useFormStatus()

    useEffect(() => {
        if (state?.message) {
            // Dismiss the loading toast
            if (toastId) {
                toast.dismiss(toastId)
            }

            // Show the error message
            if (state.message !== 'Pool created successfully') {
                toast.error(state.message)
            } else {
                toast.success(state.message)
            }
        }
    }, [state?.message, toastId])

    useEffect(() => {
        setTopBarTitle('Create Pool')
        setBottomBarContent(
            <Button
                type='submit'
                disabled={pending || Boolean(state.message) || isPending || isConfirming}
                className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'
                onClick={() => {
                    setToastId(
                        toast.loading('Creating Pool', {
                            description: 'Please wait...',
                            dismissible: true,
                        }),
                    )
                    document.querySelector('form')?.requestSubmit()
                }}>
                {isPending || pending ? 'Creating...' : isConfirming ? 'Confirming...' : 'Create Pool'}
            </Button>,
        )
        return () => {
            setTopBarTitle(null)
            setBottomBarContent(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (state?.message === 'Pool created successfully' && state.internalPoolId) {
            toast.info('Creating Pool on-chain', { description: 'Initiating blockchain transaction...' })

            if (writeContract) {
                const timeStart = Math.floor(new Date(poolDraft.dateRange.start).getTime() / 1000)
                const timeEnd = Math.floor(new Date(poolDraft.dateRange.end).getTime() / 1000)

                const CreatePoolFunction = getAbiItem({
                    abi: poolAbi,
                    name: 'createPool',
                })

                if (
                    wallets[0].walletClientType === 'coinbase_smart_wallet' ||
                    wallets[0].walletClientType === 'coinbase_wallet'
                ) {
                    sponsoredTxn([
                        {
                            address: poolAddress[wagmi.config.state.chainId as ChainId],
                            abi: [CreatePoolFunction],
                            functionName: 'createPool',
                            args: [
                                timeStart,
                                timeEnd,
                                poolDraft.name,
                                parseEther(poolDraft.price.toString()),
                                1000, // penaltyFeeRate, assuming 10% (1000 basis points), adjust as needed
                                //TODO: change to usdc/ flexible token
                                dropletAddress[wagmi.config.state.chainId as ChainId],
                            ],
                        },
                    ])
                } else {
                    writeContract({
                        address: poolAddress[wagmi.config.state.chainId as ChainId],
                        abi: [CreatePoolFunction],
                        functionName: 'createPool',
                        args: [
                            timeStart,
                            timeEnd,
                            poolDraft.name,
                            parseEther(poolDraft.price.toString()),
                            1000, // penaltyFeeRate, assuming 10% (1000 basis points), adjust as needed
                            //TODO: change to usdc/ flexible token
                            dropletAddress[wagmi.config.state.chainId as ChainId],
                        ],
                    })
                }
            }
        }
    }, [
        poolDraft.dateRange.end,
        poolDraft.dateRange.start,
        poolDraft.name,
        poolDraft.price,
        sponsoredTxn,
        state.internalPoolId,
        state?.message,
        wallets,
        writeContract,
    ])

    useEffect(() => {
        if (isConfirmed && receipt) {
            // Buscar el evento PoolCreated en los logs
            const poolCreatedLog = receipt.logs.find(
                log => log.topics[0] === '0x62cf78dd3c1528a147e40a8e7413f29c3deed8603e2ee1d0c5284b052dae7221',
            )

            if (poolCreatedLog) {
                const decodedLog = decodeEventLog({
                    abi: poolAbi,
                    data: poolCreatedLog.data,
                    topics: poolCreatedLog.topics,
                })

                // Extract the pool
                const latestPoolId = Number('poolId' in decodedLog.args && decodedLog.args.poolId)

                console.log('Latest Pool ID:', latestPoolId)

                const updatePoolToastId = toast.loading('Updating Pool', { description: 'Finalizing pool creation...' })
                const internalId = state.internalPoolId

                if (!internalId) {
                    console.error('Internal ID not found')
                    toast.error('Failed to finalize pool creation', { description: 'Please contact support' })
                    return
                }

                updatePoolStatus(internalId, 'inactive', latestPoolId)
                    .then(() => {
                        toast.success('Pool Created Successfully', { description: 'Redirecting to pool details...' })
                        resetPoolDraft()
                        router.push(`/pool/${latestPoolId}` as Route)
                    })
                    .catch(error => {
                        console.error('Error updating pool:', error)
                        toast.error('Failed to finalize pool creation', { description: 'Please contact support' })
                    })
                    .finally(() => {
                        toast.dismiss(updatePoolToastId)
                    })
            } else {
                console.error('PoolCreated event not found in transaction logs')
                toast.error('Failed to retrieve pool ID', { description: 'Please contact support' })
            }
        }
    }, [isConfirmed, receipt, resetPoolDraft, router, state.internalPoolId])

    return (
        <form action={action} className='flex w-full flex-col gap-6 py-6'>
            {formFields.map(({ name, key, label, description, component: Component }) => (
                <section key={key} className='flex flex-1 flex-col'>
                    <Label className='text-base font-medium text-[#090909]'>{label}</Label>
                    <p className='mb-4 mt-1.5 text-xs font-medium text-[#b2b2b2]'>{description}</p>
                    <Component
                        name={name}
                        value={poolDraft[key] as (string & DateTimeRangeValue) | (File & string & DateTimeRangeValue)}
                        onChange={(value: string | File | DateRange | null | undefined) => setPoolDraft(key, value)}
                    />
                    {state?.errors?.[key] && <p className='mt-1 text-xs text-red-500'>{state.errors[key]}</p>}
                    <p aria-live='polite' className='sr-only'>
                        {state?.message}
                    </p>
                </section>
            ))}
        </form>
    )
}
