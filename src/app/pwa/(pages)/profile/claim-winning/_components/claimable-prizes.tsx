'use client'

import { useSponsoredTxn } from '@/app/pwa/_client/hooks/use-sponsored-txn'
import { wagmi } from '@/app/pwa/_client/providers/configs'
import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { Button } from '@/app/pwa/_components/ui/button'
import { poolAbi, poolAddress } from '@/types/contracts'
import { useWallets } from '@privy-io/react-auth'
import { useEffect } from 'react'
import type { Address } from 'viem'
import { getAbiItem } from 'viem'
import { useWriteContract } from 'wagmi'
import Container from './container'
import PoolCardRow from './pool-card-row'
import SectionContent from './section-content'
import SectionTitle from './section-title'
import { useClaimablePools } from './use-claimable-pools'

export default function ClaimablePrizesList() {
    const setBottomBarContent = useSettingsStore(state => state.setBottomBarContent)
    const { wallets } = useWallets()
    const { writeContract } = useWriteContract()
    const walletAddress = wallets?.[0]?.address
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { claimablePools, isLoading, error } = useClaimablePools(walletAddress)
    const { sponsoredTxn } = useSponsoredTxn()

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const poolIdIndices = claimablePools?.[1].reduce((indices: any, element: any, index: any) => {
        if (element === false) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            indices.push(index)
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return indices
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const poolIdsToClaimFrom: string[] = poolIdIndices?.map((index: any) => claimablePools?.[0]?.[index])

    const onClaimFromPoolsButtonClicked = (
        claimablePools: readonly [readonly bigint[], readonly boolean[]] | undefined,
    ) => {
        if (!claimablePools) return
        if (claimablePools[0].length === 0) return

        console.log('claimablePools', claimablePools)
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
            const poolIdIndices = claimablePools?.[1].reduce((indices: any, element: any, index: any) => {
                if (element === false) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    indices.push(index)
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return indices
            }, [])

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            const poolIdsToClaimFrom = poolIdIndices?.map((index: any) => claimablePools?.[0]?.[index])
            console.log('poolIdsToClaimFrom', poolIdsToClaimFrom)

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            const walletAddresses = poolIdsToClaimFrom.map(() => walletAddress as Address)

            const ClaimWinningsFunction = getAbiItem({
                abi: poolAbi,
                name: 'claimWinnings',
            })

            if (
                wallets[0].walletClientType === 'coinbase_smart_wallet' ||
                wallets[0].walletClientType === 'coinbase_wallet'
            ) {
                sponsoredTxn([
                    {
                        address: poolAddress[wagmi.config.state.chainId as ChainId],
                        abi: [ClaimWinningsFunction],
                        functionName: 'claimWinnings',
                        args: [poolIdsToClaimFrom, walletAddresses],
                    },
                ])
            } else {
                writeContract({
                    address: poolAddress[wagmi.config.state.chainId as ChainId],
                    abi: [ClaimWinningsFunction],
                    functionName: 'claimWinnings',
                    args: [poolIdsToClaimFrom, walletAddresses],
                })
            }
        } catch (error) {
            console.log('claimWinnings Error', error)
        }
    }
    useEffect(() => {
        if (claimablePools?.[0].length === 0) {
            setBottomBarContent(undefined)
        } else {
            setBottomBarContent(
                <Button
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    onClick={() => void onClaimFromPoolsButtonClicked(claimablePools)}
                    className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                    <span>Claim</span>
                </Button>,
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [claimablePools, wallets])

    if (claimablePools?.[0].length === 0) {
        return <div className='flex-center p-6'>Prizes you win may appear here.</div>
    }

    return (
        <Container>
            <SectionTitle />
            <SectionContent>
                {poolIdsToClaimFrom?.map((pool, index) => <PoolCardRow key={index} poolId={pool} />)}
            </SectionContent>
        </Container>
    )
}
