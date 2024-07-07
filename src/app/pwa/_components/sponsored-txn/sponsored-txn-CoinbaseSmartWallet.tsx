'use client'

import { wagmi } from '@/app/pwa/_client/providers/configs'
import { dropletAbi, dropletAddress } from '@/types/contracts'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { getAbiItem } from 'viem'
import { useAccount } from 'wagmi'
import { useCapabilities, useWriteContracts } from 'wagmi/experimental'
import { Button } from '../ui/button'

interface PaymasterService {
    supported: boolean
}

interface ChainCapabilities {
    paymasterService?: PaymasterService
}

export default function SponsoredTxn() {
    const account = useAccount()

    const { writeContracts } = useWriteContracts({
        mutation: { onSuccess: id => toast(`Transaction completed: ${id}`) },
    })

    const { data: availableCapabilities } = useCapabilities({
        account: account.address,
    })

    const capabilities = useMemo(() => {
        if (!availableCapabilities || !account.chainId) {
            console.log('No capabilities or chainId')
            return {}
        }

        const capabilitiesForChain = availableCapabilities[account.chainId] as ChainCapabilities

        if (capabilitiesForChain?.paymasterService?.supported) {
            return {
                paymasterService: {
                    url: process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL,
                },
            }
        }
        return {}
    }, [availableCapabilities, account.chainId])

    const sendTransaction = () => {
        console.log('Sending transaction')

        const MintFunction = getAbiItem({
            abi: dropletAbi,
            name: 'mint',
        })

        writeContracts({
            contracts: [
                {
                    address: dropletAddress[wagmi.config.state.chainId as ChainId],
                    abi: [MintFunction],
                    functionName: 'mint',
                    args: [account.address, '1000000000000000000000'],
                },
            ],
            capabilities,
        })
    }

    if (!availableCapabilities || !account.chainId) return null

    return (
        <section className='detail_card flex w-full flex-col gap-[0.69rem] rounded-3xl p-6'>
            <Button
                className='detail_card_claim_button h-9 w-full text-[0.625rem] text-white'
                onClick={sendTransaction}>
                Faucet: Mint 1000 DROP
            </Button>
        </section>
    )
}
