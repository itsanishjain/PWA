'use client'

import { useAccount } from 'wagmi'
import { useCapabilities, useWriteContracts } from 'wagmi/experimental'
import { useMemo } from 'react'
import { Button } from '../ui/button'

export default function SponsoredTxn(prop: {
    text: string
    targetAddress: `0x${string}`
    abi: any
    functionName: string
    args: any[]
}) {
    const account = useAccount()
    const { writeContracts } = useWriteContracts({
        mutation: { onSuccess: id => alert(`Transaction completed: ${id}`) },
    })
    const { data: availableCapabilities } = useCapabilities({
        account: account.address,
    })
    const capabilities = useMemo(() => {
        if (!availableCapabilities || !account.chainId) {
            console.log('No capabilities or chainId')
            return {}
        }
        const capabilitiesForChain = availableCapabilities[account.chainId]
        if (capabilitiesForChain['paymasterService'] && capabilitiesForChain['paymasterService'].supported) {
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
        writeContracts({
            contracts: [
                {
                    address: prop.targetAddress,
                    abi: prop.abi,
                    functionName: prop.functionName,
                    args: prop.args,
                },
            ],
            capabilities,
        })
    }

    if (!availableCapabilities || !account.chainId) return null

    return <Button onClick={sendTransaction}>{`${prop.text}`}</Button>
}
