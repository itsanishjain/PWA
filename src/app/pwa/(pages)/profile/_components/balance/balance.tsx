'use client'

import { formatBalance } from '@/app/pwa/_lib/utils/balance'
import { useEffect, useState } from 'react'
import BalanceSkeleton from '../../../pools/_components/balance-skeleton'
import EncryptText from '../../../pools/_components/encrypt-text'
import FormattedBalance from '../../../pools/_components/formatted-balance'
import { getAddressBalanceAction } from '../../actions'
import { useWallets } from '@privy-io/react-auth'

type BalanceInfo = { balance: bigint; symbol: string; decimals: number } | null

interface BalanceProps {
    initialBalance: BalanceInfo | { needsRefresh: true }
}

export default function Balance({ initialBalance }: BalanceProps) {
    const { ready } = useWallets()
    const [balanceInfo, setBalanceInfo] = useState<BalanceInfo>(
        initialBalance && 'balance' in initialBalance ? initialBalance : null,
    )
    const [isEncoded, setIsEncoded] = useState(false)

    const pollBalance = async () => {
        const [refreshBalance] = await getAddressBalanceAction()
        if (refreshBalance && 'balance' in refreshBalance) setBalanceInfo(refreshBalance)
    }

    useEffect(() => {
        if (ready) {
            void pollBalance() // Fetch balance immediately
            // TODO: for some reason this is causing pools poll as well
            // const intervalId = setInterval(() => void pollBalance(), 5000) // Poll every 5 seconds
            // return () => clearInterval(intervalId) // Clean up on unmount
        }
    }, [ready])

    useEffect(() => {
        const fetchBalance = async () => {
            const [refreshBalance] = await getAddressBalanceAction()
            if (refreshBalance && 'balance' in refreshBalance) setBalanceInfo(refreshBalance)
        }

        if (ready && initialBalance && 'needsRefresh' in initialBalance) {
            void fetchBalance()
        }
    }, [initialBalance, ready])

    const balanceLoading = !ready || !balanceInfo || (initialBalance && 'needsRefresh' in initialBalance)

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
