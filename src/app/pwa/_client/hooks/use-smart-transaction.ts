import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useWriteContracts, useCapabilities, useCallsStatus } from 'wagmi/experimental'
import { useState, useCallback, useEffect } from 'react'
import { Address, Hash, TransactionReceipt, decodeEventLog, keccak256, toHex } from 'viem'
import { useWallets } from '@privy-io/react-auth'
import { poolAbi } from '@/types/contracts'

type WalletClientType = 'coinbase_smart_wallet' | 'coinbase_wallet' | 'eoa'

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
    const [result, setResult] = useState<SmartTransactionResult>({
        hash: null,
        receipt: null,
        isLoading: false,
        isError: false,
        error: null,
    })

    const account = useAccount()
    const { wallets } = useWallets()
    const { data: id, writeContracts } = useWriteContracts()
    const { data: hash, writeContract } = useWriteContract()
    const { data: availableCapabilities } = useCapabilities({ account: account.address })
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

    const executeCoinbaseTransaction = useCallback(
        async (args: ContractCalls) => {
            if (!availableCapabilities || !account.chainId) {
                throw new Error('Capabilities or chain ID not available')
            }

            const capabilitiesForChain = availableCapabilities[account.chainId]
            if (!capabilitiesForChain['paymasterService']?.supported) {
                throw new Error('Paymaster service not supported')
            }

            const capabilities = {
                paymasterService: paymasterService || {
                    url: process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL!,
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
        },
        [account, availableCapabilities, writeContracts, paymasterService],
    )

    const executeEOATransaction = useCallback(
        (args: ContractCalls) => {
            console.log('Executing EOA transaction')
            writeContract(args[args.length - 1])
        },
        [writeContract],
    )

    const executeTransaction = useCallback(
        async (args: ContractCalls) => {
            const walletClientType: WalletClientType = wallets[0].walletClientType
            setResult(prev => ({ ...prev, isLoading: true, isError: false, error: null }))

            try {
                if (walletClientType === 'coinbase_smart_wallet' || walletClientType === 'coinbase_wallet') {
                    executeCoinbaseTransaction(args)
                } else {
                    executeEOATransaction(args)
                }
                setResult(prev => ({ ...prev, isLoading: false }))
            } catch (error) {
                console.error('Transaction execution error:', error)
                setResult(prev => ({ ...prev, isLoading: false, isError: true, error: error as Error }))
            }
        },
        [wallets, executeCoinbaseTransaction, executeEOATransaction],
    )

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
    }
}

export default useSmartTransaction
