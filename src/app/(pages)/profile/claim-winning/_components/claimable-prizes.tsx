'use client'

import { Button } from '@/app/_components/ui/button'
import { poolAbi, poolAddress } from '@/types/contracts'
import { useEffect } from 'react'
import type { Address } from 'viem'
import { getAbiItem } from 'viem'
import { useAccount } from 'wagmi'
import Container from './container'
import PoolCardRow from './pool-card-row'
import SectionContent from './section-content'
import SectionTitle from './section-title'
import { useClaimablePools } from './use-claimable-pools'
import { useAppStore } from '@/app/_client/providers/app-store.provider'
import { getConfig } from '@/app/_client/providers/configs/wagmi.config'
import useTransactions from '@/app/_client/hooks/use-smart-transaction'

export default function ClaimablePrizesList() {
    const setBottomBarContent = useAppStore(state => state.setBottomBarContent)
    const { address } = useAccount()
    const { claimablePools } = useClaimablePools(address as Address)
    const { executeTransactions } = useTransactions()

    const poolIdIndices = claimablePools?.[1].reduce((indices: any, element: any, index: any) => {
        if (element === false) {
            indices.push(index)
        }
        return indices
    }, [])

    const poolIdsToClaimFrom: string[] = poolIdIndices?.map((index: any) => claimablePools?.[0]?.[index])

    const onClaimFromPoolsButtonClicked = (
        claimablePools: readonly [readonly bigint[], readonly boolean[]] | undefined,
    ) => {
        if (!claimablePools) return
        if (claimablePools[0].length === 0) return

        const poolIdIndices = claimablePools?.[1].reduce((indices: any, element: any, index: any) => {
            if (element === false) {
                indices.push(index)
            }
            return indices
        }, [])

        const poolIdsToClaimFrom = poolIdIndices?.map((index: any) => claimablePools?.[0]?.[index])
        console.log('poolIdsToClaimFrom', poolIdsToClaimFrom)

        const walletAddresses = Array(poolIdsToClaimFrom.length).fill(address as Address)

        const ClaimWinningsFunction = getAbiItem({
            abi: poolAbi,
            name: 'claimWinnings',
        })

        executeTransactions([
            {
                address: poolAddress[getConfig().state.chainId as ChainId],
                abi: [ClaimWinningsFunction],
                functionName: ClaimWinningsFunction.name,
                args: [poolIdsToClaimFrom, walletAddresses],
            },
        ])
    }

    useEffect(() => {
        if (!claimablePools || claimablePools?.[0].length === 0) {
            setBottomBarContent(undefined)
        } else {
            setBottomBarContent(
                <Button
                    onClick={() => void onClaimFromPoolsButtonClicked(claimablePools)}
                    className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                    <span>Claim</span>
                </Button>,
            )
        }
        return () => {
            setBottomBarContent(undefined)
        }
    }, [claimablePools])

    if (!claimablePools || claimablePools?.[0].length === 0) {
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
