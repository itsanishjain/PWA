'use client'

import { useSmartAccount } from '@/app/pwa/_client/hooks/use-smart-account'
import { formatBalance } from '@/app/pwa/_lib/utils/balance'
import { useEffect, useState } from 'react'
import BalanceSkeleton from '../../pools/_components/balance-skeleton'
import EncryptText from '../../pools/_components/encrypt-text'
import FormattedBalance from '../../pools/_components/formatted-balance'
import { getAddressBalanceAction } from '../actions'

type BalanceInfo = { balance: bigint; symbol: string; decimals: number } | null

interface BalanceProps {
    initialBalance: BalanceInfo | { needsRefresh: true }
}

export default function Balance({ initialBalance }: BalanceProps) {
    const { loading } = useSmartAccount()
    const [balanceInfo, setBalanceInfo] = useState<BalanceInfo>(
        initialBalance && 'balance' in initialBalance ? initialBalance : null,
    )
    const [isEncoded, setIsEncoded] = useState(false)

    const pollBalance = async () => {
        const [refreshBalance] = await getAddressBalanceAction()
        if (refreshBalance && 'balance' in refreshBalance) setBalanceInfo(refreshBalance)
    }

    useEffect(() => {
        if (!loading) {
            void pollBalance() // Fetch balance immediately

            const intervalId = setInterval(() => void pollBalance(), 5000) // Poll every 5 seconds

            return () => clearInterval(intervalId) // Clean up on unmount
        }
    }, [loading])

    useEffect(() => {
        const fetchBalance = async () => {
            const [refreshBalance] = await getAddressBalanceAction()
            if (refreshBalance && 'balance' in refreshBalance) setBalanceInfo(refreshBalance)
        }

        if (!loading && initialBalance && 'needsRefresh' in initialBalance) {
            void fetchBalance()
        }
    }, [initialBalance, loading])

    const balanceLoading = loading || !balanceInfo || (initialBalance && 'needsRefresh' in initialBalance)

    const formattedBalance = balanceInfo
        ? formatBalance(balanceInfo.balance, balanceInfo.decimals)
        : { integerPart: 0, fractionalPart: 0 }

    return (
        <section className='detail_card flex w-full flex-col gap-[0.69rem] rounded-3xl p-6'>
            <h1 className='text-[0.6875rem] font-semibold'>Total balance</h1>
            <div className='inline-flex items-baseline gap-2 text-4xl font-bold'>
                {balanceLoading ? (
                    <BalanceSkeleton />
                ) : (
                    <EncryptText
                        isEncoded={isEncoded}
                        setIsEncoded={setIsEncoded}
                        balance={formattedBalance}
                        color='#5472E9'
                        symbol={balanceInfo?.symbol || ''}>
                        <FormattedBalance {...formattedBalance} symbol={balanceInfo?.symbol || ''} />
                    </EncryptText>
                )}
            </div>
        </section>
    )
}
