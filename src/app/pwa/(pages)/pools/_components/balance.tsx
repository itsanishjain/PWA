'use client'

import { useSmartAccount } from '@/app/pwa/_client/hooks/use-smart-account'
import { formatBalance } from '@/app/pwa/_lib/utils/balance'
import { useEffect, useRef, useState } from 'react'
import { getAddressBalanceAction } from '../../profile/actions'
import BalanceSkeleton from './balance-skeleton'
import EncryptText from './encrypt-text'
import FormattedBalance from './formatted-balance'

type BalanceInfo = { balance: bigint; symbol: string; decimals: number } | null

interface BalanceProps {
    initialBalance: BalanceInfo | { needsRefresh: true }
}

export default function Balance({ initialBalance }: BalanceProps) {
    const { loading } = useSmartAccount()
    const [isInitialLoading, setIsInitialLoading] = useState(true)
    const [balanceInfo, setBalanceInfo] = useState<BalanceInfo>(
        initialBalance && 'balance' in initialBalance ? initialBalance : null,
    )
    const [isEncoded, setIsEncoded] = useState(false)
    const prevBalanceRef = useRef<bigint | null>(null)

    const pollBalance = async () => {
        const [refreshBalance] = await getAddressBalanceAction()
        if (refreshBalance && 'balance' in refreshBalance) {
            if (!prevBalanceRef.current || refreshBalance.balance !== prevBalanceRef.current) {
                setBalanceInfo(refreshBalance)
                prevBalanceRef.current = refreshBalance.balance
            }
        }
    }

    useEffect(() => {
        if (!loading) {
            void pollBalance().finally(() => setIsInitialLoading(false))
            const intervalId = setInterval(() => void pollBalance(), 20000)
            return () => clearInterval(intervalId)
        }
    }, [loading])

    useEffect(() => {
        const fetchBalance = async () => {
            const [refreshBalance] = await getAddressBalanceAction()
            if (refreshBalance && 'balance' in refreshBalance) {
                setBalanceInfo(refreshBalance)
                prevBalanceRef.current = refreshBalance.balance
            }
            setIsInitialLoading(false)
        }

        if (!loading && initialBalance && 'needsRefresh' in initialBalance) {
            void fetchBalance()
        }
    }, [initialBalance, loading])

    const showSkeleton =
        isInitialLoading || loading || !balanceInfo || (initialBalance && 'needsRefresh' in initialBalance)

    const formattedBalance = balanceInfo
        ? formatBalance(balanceInfo.balance, balanceInfo.decimals)
        : { integerPart: 0, fractionalPart: 0 }

    return (
        <section className='detail_card flex w-full flex-col gap-[0.69rem] rounded-3xl p-6'>
            <h1 className='text-[0.6875rem] font-semibold'>Total balance</h1>
            {showSkeleton ? (
                <BalanceSkeleton />
            ) : (
                <EncryptText
                    isEncoded={isEncoded}
                    setIsEncoded={setIsEncoded}
                    balance={formattedBalance}
                    symbol={balanceInfo?.symbol || ''}>
                    <FormattedBalance {...formattedBalance} symbol={balanceInfo?.symbol || ''} />
                </EncryptText>
            )}
        </section>
    )
}
