import { useWallets } from '@privy-io/react-auth'
import { useEffect, useState, useCallback, useRef } from 'react'
import type { Hash, TransactionReceipt } from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useCallsStatus, useWriteContracts } from 'wagmi/experimental'
import { ContractCall } from '@/app/_lib/entities/models/contract-call'
import { base, baseSepolia } from 'viem/chains'

interface SmartTransactionResult {
    hash: Hash | null
    receipt: TransactionReceipt | null
    isLoading: boolean
    isError: boolean
    error: Error | null
}

export default function useTransactions() {
    console.log('🔄 [useTransactions] Initializing hook')

    const {
        data: id,
        writeContractsAsync,
        isPending: isPaymasterPending,
    } = useWriteContracts({
        mutation: {
            onMutate(variables) {
                console.log('Optimistic update here', variables)
            },
            // onSuccess(data, variables, context) {},
        },
    })
    const { data: hash, writeContractAsync } = useWriteContract()
    const { wallets, ready: walletsReady } = useWallets()

    const [result, setResult] = useState<SmartTransactionResult>({
        hash: null,
        receipt: null,
        isLoading: false,
        isError: false,
        error: null,
    })

    const { data: callsStatus } = useCallsStatus({
        id: id as string,
        query: {
            enabled: Boolean(id),
            refetchInterval: data => (data.state.data?.status === 'CONFIRMED' ? false : 1000),
        },
    })

    const {
        data: receipt,
        isLoading: isConfirming,
        isSuccess: isEoaConfirmed,
    } = useWaitForTransactionReceipt({
        hash: result.hash as Hash | undefined,
    })

    const [isConfirmed, setIsConfirmed] = useState(false)

    const transactionInProgressRef = useRef(false)

    useEffect(() => {
        if (callsStatus?.status === 'CONFIRMED' && callsStatus.receipts && callsStatus.receipts.length > 0) {
            const paymasterReceipt = callsStatus.receipts[0]
            console.log('✅ [useTransactions] Paymaster transaction confirmed:', {
                hash: paymasterReceipt.transactionHash,
                blockNumber: paymasterReceipt.blockNumber,
                gasUsed: paymasterReceipt.gasUsed.toString(),
            })
            setResult(prev => ({ ...prev, hash: paymasterReceipt.transactionHash }))
            setIsConfirmed(true)
        }
    }, [callsStatus])

    useEffect(() => {
        if (isEoaConfirmed) {
            console.log('Transaction confirmed by EOA')
            setIsConfirmed(true)
        }
    }, [isEoaConfirmed])

    const resetConfirmation = useCallback(() => {
        setIsConfirmed(false)
    }, [])

    useEffect(() => {
        if (hash) {
            console.log('Hash updated from writeContract:', hash)
            setResult(prev => ({ ...prev, hash }))
        }
    }, [hash])

    const executeCoinbaseTransactions = useCallback(
        async (contractCalls: ContractCall[]) => {
            console.log('🔄 [useTransactions] Executing Coinbase transaction with calls:', contractCalls)

            if (transactionInProgressRef.current) {
                console.log('⚠️ [useTransactions] Transaction already in progress')
                return
            }

            try {
                console.log('🔍 [useTransactions] Checking wallet state:', {
                    walletsReady,
                    hasWallet: Boolean(wallets[0]),
                    walletAddress: wallets[0]?.address,
                })

                transactionInProgressRef.current = true
                setResult(prev => ({ ...prev, isLoading: true, isError: false, error: null }))

                if (!walletsReady || !wallets[0]) {
                    console.error('❌ [useTransactions] Wallet not connected')
                    throw new Error('Wallet not connected')
                }

                console.log('📝 [useTransactions] Submitting transaction to Coinbase with payload:', {
                    contracts: contractCalls,
                    chainId: base.id,
                    paymasterUrl: process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL,
                })

                const response = await writeContractsAsync({
                    contracts: contractCalls,
                    capabilities: {
                        paymasterService: {
                            url: process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL,
                        },
                    },
                    chainId: base.id,
                })
                console.log('✅ [useTransactions] Coinbase transaction response:', response)
                setResult(prev => ({ ...prev, hash: response as `0x${string}` }))
            } catch (error) {
                console.error('❌ [useTransactions] Coinbase transaction error:', error)
                setResult(prev => ({
                    ...prev,
                    isError: true,
                    error: error as Error,
                }))
                throw error
            } finally {
                console.log('🔄 [useTransactions] Cleaning up Coinbase transaction state')
                transactionInProgressRef.current = false
                setResult(prev => ({ ...prev, isLoading: false }))
            }
        },
        [writeContractsAsync, walletsReady, wallets],
    )

    const executeEoaTransactions = useCallback(
        async (contractCalls: ContractCall[]) => {
            console.log('🔄 [useTransactions] Executing EOA transaction')

            if (transactionInProgressRef.current) {
                console.log('⚠️ [useTransactions] Transaction already in progress')
                return
            }

            try {
                transactionInProgressRef.current = true
                setResult(prev => ({ ...prev, isLoading: true, isError: false, error: null }))

                if (!writeContractAsync) {
                    console.error('❌ [useTransactions] Contract write not available')
                    throw new Error('Contract write not available')
                }

                console.log('📝 [useTransactions] Submitting EOA transaction')
                await writeContractAsync(contractCalls[0])
                console.log('✅ [useTransactions] EOA transaction submitted')
            } catch (error) {
                console.error('❌ [useTransactions] EOA transaction error:', error)
                setResult(prev => ({
                    ...prev,
                    isError: true,
                    error: error as Error,
                }))
                throw error
            } finally {
                console.log('🔄 [useTransactions] Cleaning up transaction state')
                transactionInProgressRef.current = false
                setResult(prev => ({ ...prev, isLoading: false }))
            }
        },
        [writeContractAsync],
    )

    const executeTransactions = useCallback(
        async (contractCalls: ContractCall[]) => {
            console.log('🔄 [useTransactions] Execute transactions initiated', {
                walletsReady,
                walletType: wallets[0]?.connectorType,
            })

            try {
                if (!walletsReady) {
                    console.error('❌ [useTransactions] Wallets not ready')
                    throw new Error('Wallets not ready')
                }

                const walletType = wallets[0]?.connectorType
                console.log('🔍 [useTransactions] Using wallet type:', walletType)

                if (walletType === 'coinbase_wallet') {
                    await executeCoinbaseTransactions(contractCalls)
                } else {
                    await executeEoaTransactions(contractCalls)
                }
            } catch (error) {
                console.error('❌ [useTransactions] Transaction execution failed:', error)
                throw error
            }
        },
        [walletsReady, wallets, executeCoinbaseTransactions, executeEoaTransactions],
    )

    return {
        executeTransactions,
        isConfirmed,
        resetConfirmation,
        isPending: isPaymasterPending,
        isReady: walletsReady,
        result: {
            ...result,
            receipt,
            isConfirming,
            callsStatus,
        },
    }
}
