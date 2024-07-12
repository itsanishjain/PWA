'use client'

import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { Button } from '@/app/pwa/_components/ui/button'
import {
    poolAbi,
    poolAddress,
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
import { Address, parseUnits } from 'viem'
import useSmartTransaction from '@/app/pwa/_client/hooks/use-smart-transaction'
import { currentPoolAddress } from '@/app/pwa/_server/blockchain/server-config'

export default function BottomBarHandler({
    isAdmin,
    walletAddress,
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
    walletAddress: Address | null
}) {
    const { login } = useSmartAccount()
    const { ready, authenticated } = usePrivy()
    const setBottomBarContent = useSettingsStore(state => state.setBottomBarContent)
    const { executeTransaction, result } = useSmartTransaction()

    const { data: userBalance, error: balanceError } = useReadDropletBalanceOf({ args: [walletAddress || '0x'] })

    const handleEnableDeposits = async () => {
        toast('Enabling deposits...')

        await executeTransaction([
            {
                address: currentPoolAddress,
                abi: poolAbi,
                functionName: 'enableDeposits',
                args: [poolId],
            },
        ])
    }

    const handleStartPool = async () => {
        toast('Starting pool...')

        await executeTransaction([
            {
                address: currentPoolAddress,
                abi: poolAbi,
                functionName: 'startPool',
                args: [poolId],
            },
        ])
    }

    const handleEndPool = async () => {
        toast('Ending pool...')

        await executeTransaction([
            {
                address: currentPoolAddress,
                abi: poolAbi,
                functionName: 'endPool',
                args: [poolId],
            },
        ])
    }

    const handleJoinPool = async () => {
        if (ready && !authenticated) {
            console.log('Login first')
            login()
        }

        if (ready && authenticated) {
            console.log('Check funds')

            const bigIntPrice = parseUnits(poolPrice.toString(), tokenDecimals)

            if (balanceError) {
                console.error('Error reading balance', balanceError)
                return
            }

            if (Number(userBalance || 0) < bigIntPrice) {
                toast('Insufficient funds, please top up your account.')
                return
            }

            console.log('Onramp funds if needed')

            console.log('Join pool')
            toast('Joining pool...')

            await executeTransaction([
                {
                    address: currentPoolAddress,
                    abi: poolAbi,
                    functionName: 'deposit',
                    args: [poolId, bigIntPrice],
                },
            ])
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
