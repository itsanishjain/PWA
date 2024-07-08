'use client'

import { Button } from '@/app/pwa/_components/ui/button'
import { serverConfig } from '@/app/pwa/_server/blockchain/server-config'
import { useWritePoolClaimWinning } from '@/types/contracts'
import { CheckCircleIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

interface PoolDetailsClaimableWinningsProps {
    claimableAmount: number
    title?: string
    description?: string
    tokenSymbol: string
    poolId: bigint
}
export default function PoolDetailsClaimableWinnings({
    claimableAmount,
    tokenSymbol,
    title = 'Winner',
    description = 'First Place!',
    poolId,
}: PoolDetailsClaimableWinningsProps) {
    const { address } = useAccount() as { address: Address }

    const { writeContract } = useWritePoolClaimWinning({
        config: serverConfig,
    })

    const handleClaimWinnings = async () => {
        toast('Claiming winnings...')
        void writeContract({ args: [poolId, address] })
    }

    if (claimableAmount <= 0) return null

    return (
        <div className='mb-[1.12rem] flex flex-col gap-[0.38rem]'>
            <div className='inline-flex w-full justify-between'>
                <div className='inline-flex items-center gap-1'>
                    <CheckCircleIcon className='size-3 scale-95' />
                    <span className='text-xs font-semibold'>{title}</span>
                </div>
                <div className='text-xs'>{`${description} $${claimableAmount} ${tokenSymbol}`}</div>
            </div>
            <Button
                onClick={() => void handleClaimWinnings()}
                className='detail_card_claim_button h-9 w-full text-[0.625rem] text-white'>
                Claim winnings
            </Button>
        </div>
    )
}
