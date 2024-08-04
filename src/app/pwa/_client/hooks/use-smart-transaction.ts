import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useWriteContracts, useCapabilities, useCallsStatus } from 'wagmi/experimental'
import { useState, useCallback, useEffect } from 'react'
import { Address, Hash, TransactionReceipt, decodeEventLog, keccak256, toHex } from 'viem'
import { poolAbi } from '@/types/contracts'

import { useWallets } from '@privy-io/react-auth'
import { wagmi } from '../providers/configs'

interface ContractCall {
    address: Address
    abi: any
    functionName: string
    args: any[]
}

type ContractCalls = ContractCall[]

interface PaymasterService {
    url: string
    execute: (calls: ContractCalls) => Promise<string>
}

interface SmartTransactionResult {
    hash: Hash | null
    receipt: TransactionReceipt | null
    isLoading: boolean
    isError: boolean
    error: Error | null
}

const useSmartTransaction = (paymasterService?: PaymasterService) => {
    const { wallets, ready: walletsReady } = useWallets()
    const chainId = wagmi.config.state.chainId

    const [result, setResult] = useState<SmartTransactionResult>({
        hash: null,
        receipt: null,
        isLoading: false,
        isError: false,
        error: null,
    })

    const { data: id, writeContracts } = useWriteContracts()
    const { data: hash, writeContract } = useWriteContract()
    const { data: availableCapabilities } = useCapabilities({
        account: wallets[0]?.address as Address,
    })
    const { data: callsStatus } = useCallsStatus({
        id: id as string,
        query: {
            enabled: Boolean(id),
            refetchInterval: data => (data.state.data?.status === 'CONFIRMED' ? false : 1000),
        },
    })
    const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
        hash: result.hash as Hash | undefined,
    })

    useEffect(() => {
        if (callsStatus?.status === 'CONFIRMED' && callsStatus.receipts && callsStatus.receipts.length > 0) {
            const receipt = callsStatus.receipts[0]
            console.log('Transaction confirmed. Hash:', receipt.transactionHash)
            console.log('Full receipt:', receipt)
            console.log('Transaction logs:', receipt.logs)
            setResult(prev => ({ ...prev, hash: receipt.transactionHash }))
        }
    }, [callsStatus])

    useEffect(() => {
        if (hash) {
            console.log('Hash updated from writeContract:', hash)
            setResult(prev => ({ ...prev, hash }))
        }
    }, [hash])

    const executeCoinbaseTransaction = async (args: ContractCalls) => {
        if (!availableCapabilities || !chainId) {
            throw new Error('Capabilities or chain ID not available')
        }

        const capabilitiesForChain = availableCapabilities[chainId]

        if (!capabilitiesForChain['paymasterService']?.supported) {
            throw new Error('Paymaster service not supported')
        }

        const capabilities = {
            paymasterService: paymasterService || {
                url: process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL,
            },
        }

        if (capabilitiesForChain['atomicBatch']?.supported) {
            console.log('Executing atomic batch transaction')
            writeContracts({ contracts: args, capabilities })
        } else {
            console.log('Executing individual transactions')
            for (const call of args) {
                writeContracts({ contracts: [call], capabilities })
            }
        }
    }

    const executeEOATransaction = (args: ContractCalls) => {
        console.log('Executing EOA transaction')
        writeContract(args[args.length - 1])
    }

    const executeTransaction = async (args: ContractCalls) => {
        if (!walletsReady || !availableCapabilities) {
            console.error('Wallets not ready')
            return
        }

        const walletType = wallets[0].walletClientType

        setResult(prev => ({ ...prev, isLoading: true, isError: false, error: null }))

        try {
            if (walletType === 'coinbase_smart_wallet' || walletType === 'coinbase_wallet') {
                executeCoinbaseTransaction(args)
            } else {
                executeEOATransaction(args)
            }
            setResult(prev => ({ ...prev, isLoading: false }))
        } catch (error) {
            console.error('Transaction execution error:', error)
            setResult(prev => ({ ...prev, isLoading: false, isError: true, error: error as Error }))
        }
    }

    useEffect(() => {
        if (receipt) {
            console.log('Transaction receipt received:', receipt)

            // Calculate the hash of the PoolCreated event
            const eventSignature = 'PoolCreated(uint256,address,string,uint256,uint16,address)'
            const eventHash = keccak256(toHex(eventSignature))

            // Search for the PoolCreated event in the logs
            const poolCreatedLog = receipt.logs.find(log => log.topics[0] === eventHash)

            if (poolCreatedLog) {
                try {
                    const decodedLog = decodeEventLog({
                        abi: poolAbi, // Make sure poolAbi is available in this scope
                        data: poolCreatedLog.data,
                        topics: poolCreatedLog.topics,
                        eventName: 'PoolCreated',
                    })

                    const latestPoolId = Number(decodedLog.args.poolId)
                    console.log('Latest Pool ID:', latestPoolId)

                    // Here you can trigger any necessary updates or state changes
                    // based on the successful pool creation
                } catch (error) {
                    console.error('Error decoding PoolCreated event:', error)
                }
            } else {
                console.log('PoolCreated event not found in transaction logs')
            }
        }
    }, [receipt])

    return {
        executeTransaction,
        result: {
            ...result,
            receipt,
            isConfirming,
            callsStatus,
        },
        isReady: walletsReady,
    }
}

export default useSmartTransaction
