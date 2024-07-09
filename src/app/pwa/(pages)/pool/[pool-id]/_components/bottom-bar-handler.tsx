'use client'

import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { Button } from '@/app/pwa/_components/ui/button'
import {
    useReadDropletBalanceOf,
    useWritePoolDeposit,
    useWritePoolEnableDeposit,
    useWritePoolEndPool,
    useWritePoolStartPool,
} from '@/types/contracts'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { POOLSTATUS } from '../_lib/definitions'
import { useSmartAccount } from '@/app/pwa/_client/hooks/use-smart-account'
import { usePrivy } from '@privy-io/react-auth'
import { revalidatePath } from 'next/cache'
import { Address } from 'viem'

export default function BottomBarHandler({
    isAdmin,
    poolStatus,
    poolId,
    poolPrice,
    poolTokenSymbol,
    tokenDecimals,
}: {
    isAdmin: boolean
    poolStatus: POOLSTATUS
    poolId: bigint
    poolPrice: number
    poolTokenSymbol: string
    tokenDecimals: number
}) {
    const { login } = useSmartAccount()
    const { ready, authenticated, user } = usePrivy()
    const setBottomBarContent = useSettingsStore(state => state.setBottomBarContent)
    const { writeContractAsync: enableDeposits } = useWritePoolEnableDeposit()
    const { writeContractAsync: startPool } = useWritePoolStartPool()
    const { writeContractAsync: endPool } = useWritePoolEndPool()
    const { writeContractAsync: joinPool } = useWritePoolDeposit()

    const handleEnableDeposits = async () => {
        toast('Enabling deposits...')

        await enableDeposits({
            args: [poolId],
        })
        revalidatePath(`/pool/${poolId}`)
    }

    const handleStartPool = async () => {
        toast('Starting pool...')

        await startPool({
            args: [poolId],
        })
        revalidatePath(`/pool/${poolId}`)
    }

    const handleEndPool = async () => {
        toast('Ending pool...')

        await endPool({
            args: [poolId],
        })
        revalidatePath(`/pool/${poolId}`)
    }

    const handleJoinPool = async () => {
        if (ready && !authenticated) {
            console.log('Login first')
            login()
            revalidatePath(`/pool/${poolId}`)
        }

        if (ready && authenticated) {
            console.log('Check funds')
            const userWalletAddress = user?.wallet?.address as Address
            if (userWalletAddress === undefined) {
                console.error('No wallet address')
                handleJoinPool()
            }
            // convert prize to correct format with decimals:
            const bigIntPrice = BigInt(poolPrice * 10 ** tokenDecimals)

            const { data: userBalance, error } = useReadDropletBalanceOf({ args: [userWalletAddress] })

            if (error || userBalance === undefined) {
                console.error('Error reading balance', error)
                return
            }

            if (userBalance < bigIntPrice) {
                toast('Insufficient funds, please top up your account.')
                return
            }

            console.log('Onramp funds if needed')

            console.log('Join pool')
            toast('Joining pool...')

            await joinPool({
                args: [poolId, bigIntPrice],
            })
            revalidatePath(`/pool/${poolId}`)
        }
    }

    const handleBottomBarContent = (poolStatus: POOLSTATUS, isAdmin: boolean) => {
        switch (poolStatus) {
            case POOLSTATUS.INACTIVE: {
                if (isAdmin) {
                    setBottomBarContent(
                        <Button
                            className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'
                            onClick={handleEnableDeposits}>
                            Enable deposits
                        </Button>,
                    )
                }
                break
            }
            case POOLSTATUS.DEPOSIT_ENABLED: {
                if (isAdmin) {
                    setBottomBarContent(
                        <Button
                            className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'
                            onClick={handleStartPool}>
                            Start Pool
                        </Button>,
                    )
                } else {
                    setBottomBarContent(
                        <Button
                            className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'
                            onClick={handleJoinPool}>
                            {`Register for ${poolPrice} ${poolTokenSymbol}`}
                        </Button>,
                    )
                }
                break
            }

            case POOLSTATUS.STARTED: {
                if (isAdmin) {
                    setBottomBarContent(
                        <Button
                            className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'
                            onClick={handleEndPool}>
                            End pool
                        </Button>,
                    )
                } else {
                    setBottomBarContent(
                        <Button
                            className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'
                            onClick={handleJoinPool}>
                            {`Register for ${poolPrice} ${poolTokenSymbol}`}
                        </Button>,
                    )
                }
                break
            }
            case POOLSTATUS.ENDED:
                setBottomBarContent(null)
            default:
                setBottomBarContent(
                    <Button
                        className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'
                        onClick={handleJoinPool}>
                        {`Register for ${poolPrice} ${poolTokenSymbol}`}
                    </Button>,
                )
        }
    }

    useEffect(() => {
        handleBottomBarContent(poolStatus, isAdmin)
        return () => {
            setBottomBarContent(null)
        }
    }, [poolStatus, isAdmin])

    return null
}
