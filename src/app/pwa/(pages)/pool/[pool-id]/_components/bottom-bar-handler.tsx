'use client'

import { Button } from '@/app/pwa/_components/ui/button'
import { poolAbi, useReadDropletBalanceOf } from '@/types/contracts'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Address, parseUnits } from 'viem'
import useSmartTransaction from '@/app/pwa/_client/hooks/use-smart-transaction'
import { currentPoolAddress } from '@/app/pwa/_server/blockchain/server-config'
import { useAppStore } from '@/app/pwa/_client/providers/app-store.provider'
import { useAuth } from '@/app/pwa/_client/hooks/use-auth'
import { POOLSTATUS } from '../_lib/definitions'
import { usePoolActions } from '@/app/pwa/_client/hooks/use-pool-actions'

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
    const { setBottomBarContent } = useAppStore(state => ({
        setBottomBarContent: state.setBottomBarContent,
    }))

    // const { login, authenticated: isAuthenticated } = useAuth()
    // const { executeTransaction, isReady } = useSmartTransaction()
    // const { data: userBalance, error: balanceError } = useReadDropletBalanceOf({ args: [walletAddress || '0x'] })

    const { handleEnableDeposits, handleEndPool, handleJoinPool, handleStartPool, ready } = usePoolActions(
        poolId,
        poolPrice,
        tokenDecimals,
    )

    useEffect(() => {
        ready && handleBottomBarContent(poolStatus, isAdmin)
        return () => {
            setBottomBarContent(null)
        }
    }, [poolStatus, isAdmin, setBottomBarContent, ready])

    // const handleEnableDeposits = async () => {
    //     toast('Enabling deposits...')

    //     await executeTransaction([
    //         {
    //             address: currentPoolAddress,
    //             abi: poolAbi,
    //             functionName: 'enableDeposit',
    //             args: [poolId],
    //         },
    //     ])
    // }

    // const handleStartPool = async () => {
    //     toast('Starting pool...')

    //     await executeTransaction([
    //         {
    //             address: currentPoolAddress,
    //             abi: poolAbi,
    //             functionName: 'startPool',
    //             args: [poolId],
    //         },
    //     ])
    // }

    // const handleEndPool = async () => {
    //     toast('Ending pool...')

    //     await executeTransaction([
    //         {
    //             address: currentPoolAddress,
    //             abi: poolAbi,
    //             functionName: 'endPool',
    //             args: [poolId],
    //         },
    //     ])
    // }

    // const handleJoinPool = async () => {
    //     console.log('Join pool button clicked')

    //     if (!isReady) {
    //         console.log('Wallet not ready')
    //         return
    //     }

    //     if (isReady && !isAuthenticated) {
    //         console.log('Login first')
    //         login()
    //     }

    //     if (isReady && isAuthenticated) {
    //         console.log('Check funds')

    //         const bigIntPrice = parseUnits(poolPrice.toString(), tokenDecimals)
    //         console.log('Big int price:', bigIntPrice.toString())

    //         if (balanceError) {
    //             console.error('Error reading balance', balanceError)
    //             return
    //         }

    //         if (Number(userBalance || 0) < bigIntPrice) {
    //             toast('Insufficient funds, please top up your account.')
    //             return
    //         }

    //         console.log('Onramp funds if needed')

    //         console.log('Join pool')
    //         toast('Joining pool...')

    //         await executeTransaction([
    //             {
    //                 address: currentPoolAddress,
    //                 abi: poolAbi,
    //                 functionName: 'deposit',
    //                 args: [poolId, bigIntPrice],
    //             },
    //         ])
    //     }
    // }

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

    return null
}
