import { useMemo, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { useCapabilities, useWriteContracts } from 'wagmi/experimental'

interface ContractCall {
    address: Address
    abi: any
    functionName: string
    args: any[]
}

export function useSmartWallet() {
    const account = useAccount()
    const [id, setId] = useState<string | undefined>(undefined)
    const { writeContracts } = useWriteContracts({
        mutation: { onSuccess: id => setId(id) },
    })
    const { data: availableCapabilities } = useCapabilities({
        account: account.address,
    })

    const capabilities = useMemo(() => {
        if (!availableCapabilities || !account.chainId) return {}
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

    const sendTransaction = async (args: ContractCall[]) => {
        writeContracts({
            contracts: args,
            capabilities,
        })
    }

    return { sendTransaction, id }
}
