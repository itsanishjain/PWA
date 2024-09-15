'use client'

import { formatBalance } from '@/app/_lib/utils/balance'
import FormattedBalance from './formatted-balance'
import { useBalance } from 'wagmi'
import BalanceSkeleton from './balance-skeleton'
import { currentTokenAddress } from '@/app/_server/blockchain/server-config'
import { cn } from '@/lib/utils/tailwind'
import EncryptText from './encrypt-text'
import { usePrivy } from '@privy-io/react-auth'
import { Address } from 'viem'

type Props = {
    color?: string
}

export default function Balance({ color }: Props) {
    const { user } = usePrivy()
    const address = user?.wallet?.address as Address

    const { data: balance, isLoading } = useBalance({
        token: currentTokenAddress,
        address,
        query: {
            refetchInterval: 20_000, // 20 seconds
            select: data => ({
                ...data,
                ...formatBalance(data.value, data.decimals),
            }),
        },
    })

    return (
        <section
            className={cn(
                'detail_card mt-2 flex w-full flex-col gap-[0.69rem] rounded-3xl p-6 transition-all duration-300',
                balance ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
            )}>
            <h1 className='text-[0.6875rem] font-semibold'>Total balance</h1>
            <div className='inline-flex items-baseline gap-2 text-4xl font-bold'>
                {isLoading && <BalanceSkeleton />}
                {balance && (
                    <EncryptText balance={balance} color={color} symbol={balance?.symbol}>
                        <FormattedBalance
                            integerPart={balance.integerPart}
                            fractionalPart={balance.fractionalPart}
                            symbol={balance?.symbol}
                        />
                    </EncryptText>
                )}
            </div>
        </section>
    )
}
