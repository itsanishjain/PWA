'use client'

import { useWallets } from '@privy-io/react-auth'
import { useWriteContract } from 'wagmi'
import { useSponsoredTxn } from '../../_client/hooks/use-sponsored-txn'
import { Button } from '../ui/button'

export default function SponsoredTxn(prop: {
    text: string
    targetAddress: `0x${string}`
    // eslint-disable-next-line
    abi: any
    functionName: string
    // eslint-disable-next-line
    args: any[]
}) {
    const { writeContract } = useWriteContract()
    const { wallets } = useWallets()
    const { sponsoredTxn } = useSponsoredTxn()

    const sendTransaction = () => {
        console.log('Sending transaction')
        if (
            wallets[0].walletClientType === 'coinbase_smart_wallet' ||
            wallets[0].walletClientType === 'coinbase_wallet'
        ) {
            sponsoredTxn([
                {
                    address: prop.targetAddress,
                    // eslint-disable-next-line
                    abi: prop.abi,
                    functionName: prop.functionName,
                    args: prop.args,
                },
            ])
        } else {
            writeContract({
                address: prop.targetAddress,
                // eslint-disable-next-line
                abi: prop.abi,
                functionName: prop.functionName,
                args: prop.args,
            })
        }
    }
    // if (!availableCapabilities || !account.chainId) return null

    return (
        <Button
            className='h-[30px] w-[100px] rounded-mini bg-cta px-[10px] py-[5px] text-[10px]'
            onClick={sendTransaction}>{`${prop.text}`}</Button>
    )
}
