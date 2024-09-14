'use client'

import { formatBalance } from '@/app/_lib/utils/balance'
import { useEffect, useState } from 'react'
import FormattedBalance from './formatted-balance'
import { useBalance } from 'wagmi'
import BalanceSkeleton from './balance-skeleton'
import { TokenBalance } from '@/app/_lib/entities/models/token-balance'
import { currentTokenAddress } from '@/app/_server/blockchain/server-config'
import { cn } from '@/lib/utils/tailwind'
import EncryptText from './encrypt-text'
import { usePrivy } from '@privy-io/react-auth'
import { Address } from 'viem'
import { AuthenticatedGuard } from '@/components/authenticated-guard'

interface BalanceProps {
    color?: string
    initialBalance?: TokenBalance | null
}

function BalanceContent({ color }: BalanceProps) {
    const { user } = usePrivy()
    const [formattedBalance, setFormattedBalance] = useState<{ integerPart: number; fractionalPart: number }>()
    const address = user?.wallet?.address as Address

    const { data: balance, isLoading } = useBalance({
        token: currentTokenAddress,
        address,
    })

    useEffect(() => {
        if (balance && balance.value !== undefined) {
            const newFormattedBalance = formatBalance(balance.value, balance.decimals)
            setFormattedBalance(newFormattedBalance)
        }
    }, [balance])

    return (
        <section
            className={cn(
                'detail_card mt-2 flex w-full flex-col gap-[0.69rem] rounded-3xl p-6 transition-all duration-300',
                formattedBalance ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
            )}>
            <h1 className='text-[0.6875rem] font-semibold'>Total balance</h1>
            <div className='inline-flex items-baseline gap-2 text-4xl font-bold'>
                {isLoading || !formattedBalance ? (
                    <BalanceSkeleton />
                ) : (
                    <EncryptText balance={formattedBalance} color={color} symbol={balance?.symbol}>
                        <FormattedBalance
                            integerPart={formattedBalance.integerPart}
                            fractionalPart={formattedBalance.fractionalPart}
                            symbol={balance?.symbol}
                        />
                    </EncryptText>
                )}
            </div>
        </section>
    )
}

export default function Balance(props: BalanceProps) {
    return (
        <AuthenticatedGuard>
            <BalanceContent {...props} />
        </AuthenticatedGuard>
    )
}
