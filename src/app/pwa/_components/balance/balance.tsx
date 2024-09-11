'use client'

import { formatBalance } from '@/app/pwa/_lib/utils/balance'
import { useEffect, useState } from 'react'
import EncryptText from './encrypt-text'
import FormattedBalance from './formatted-balance'
import { useAccount, useBalance } from 'wagmi'
import { currentTokenAddress } from '../../_server/blockchain/server-config'
import BalanceSkeleton from './balance-skeleton'
import { usePrivy } from '@privy-io/react-auth'
import { TokenBalance } from '../../_lib/entities/models/token-balance'

interface BalanceProps {
    color?: string
    initialBalance?: TokenBalance | null
}

export default function Balance({ initialBalance, color }: BalanceProps) {
    const { authenticated, ready } = usePrivy()
    const [isVisible, setIsVisible] = useState(false)

    const { address } = useAccount()
    const { data: balance } = useBalance({
        token: currentTokenAddress,
        address,
        query: {
            initialData: initialBalance || undefined,
            enabled: Boolean(address),
            refetchInterval: 10_000, // 10 seconds
        },
    })

    const [isEncoded, setIsEncoded] = useState(false)

    const formattedBalance = formatBalance(balance?.value, balance?.decimals)

    useEffect(() => {
        if (ready && authenticated) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [ready, authenticated])

    if (ready && !authenticated) {
        return null
    }

    return (
        <section
            className={`detail_card mt-2 flex w-full flex-col gap-[0.69rem] rounded-3xl p-6 transition-all duration-300 ${
                isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}>
            <h1 className='text-[0.6875rem] font-semibold'>Total balance</h1>
            <div className='inline-flex items-baseline gap-2 text-4xl font-bold'>
                {!balance || !ready ? (
                    <BalanceSkeleton />
                ) : (
                    <EncryptText
                        isEncoded={isEncoded}
                        setIsEncoded={setIsEncoded}
                        balance={formattedBalance}
                        color={color}
                        symbol={balance?.symbol || ''}>
                        <FormattedBalance {...formattedBalance} symbol={balance?.symbol || ''} />
                    </EncryptText>
                )}
            </div>
        </section>
    )
}
