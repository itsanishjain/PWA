'use client'

import { formatBalance } from '@/app/pwa/_lib/utils/balance'
import { useEffect, useRef, useState } from 'react'
import { getAddressBalanceAction } from '../../profile/actions'
import BalanceSkeleton from './balance-skeleton'
import EncryptText from './encrypt-text'
import FormattedBalance from './formatted-balance'
import { useWallets } from '@privy-io/react-auth'

type BalanceInfo = { balance: bigint; symbol: string; decimals: number } | null

interface BalanceProps {
    initialBalance: BalanceInfo | { needsRefresh: true }
}

export default function Balance({ initialBalance }: BalanceProps) {
    const { ready } = useWallets()
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

    // TODO: replace polling with pubsub model
    useEffect(() => {
        if (ready) {
            void pollBalance().finally(() => setIsInitialLoading(false))
            // TODO: for some reason this is causing pools poll as well
            // const intervalId = setInterval(() => void pollBalance(), 20000)
            // return () => clearInterval(intervalId)
        }
    }, [ready])

    useEffect(() => {
        const fetchBalance = async () => {
            const [refreshBalance] = await getAddressBalanceAction()
            if (refreshBalance && 'balance' in refreshBalance) {
                setBalanceInfo(refreshBalance)
                prevBalanceRef.current = refreshBalance.balance
            }
            setIsInitialLoading(false)
        }

        if (ready && initialBalance && 'needsRefresh' in initialBalance) {
            void fetchBalance()
        }
    }, [initialBalance, ready])

    const showSkeleton =
        isInitialLoading || !ready || !balanceInfo || (initialBalance && 'needsRefresh' in initialBalance)

    const formattedBalance = balanceInfo
        ? formatBalance(balanceInfo.balance, balanceInfo.decimals)
        : { integerPart: 0, fractionalPart: 0 }

    return (
        <section className='detail_card mb-6 flex min-h-min w-full flex-col gap-[0.69rem] rounded-3xl p-6'>
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
