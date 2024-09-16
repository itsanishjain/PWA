'use client'

import { wagmi } from '@/app/pwa/_client/providers/configs'
import { Button } from '@/app/pwa/_components/ui/button'
import { Input } from '@/app/pwa/_components/ui/input'
import { dropletAbi, dropletAddress } from '@/types/contracts'
import { useWallets } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import type { Address } from 'viem'
import { getAbiItem } from 'viem'
import { useBalance, useWriteContract } from 'wagmi'
import Container from '../../claim-winning/_components/container'
import SectionContent from '../../claim-winning/_components/section-content'
import { useTokenDecimals } from './use-token-decimals'
import { useAppStore } from '@/app/pwa/_client/providers/app-store.provider'

export default function AmountSection() {
    const { wallets } = useWallets()

    const { data: tokenBalanceData } = useBalance({
        address: wallets[0]?.address as Address,
        token: dropletAddress[wagmi.config.state.chainId as ChainId],
    })

    const decimals = BigInt(tokenBalanceData?.decimals ?? BigInt(18))
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tokenBalance = ((tokenBalanceData?.value ?? BigInt(0)) / BigInt(10) ** decimals).toString()

    const [amount, setAmount] = useState('')
    const [withdrawAddress, setWithdrawAddress] = useState('')

    const handleAmountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value)
    }
    const handleWithdrawAddressInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWithdrawAddress(event.target.value)
    }
    const setBottomBarContent = useAppStore(state => state.setBottomBarContent)
    // const { data: hash, sendTransaction } = useSendTransaction()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data: hash, isPending, isSuccess, writeContract } = useWriteContract()

    const { tokenDecimalsData } = useTokenDecimals(dropletAddress[wagmi.config.state.chainId as ChainId] as Address)
    const TransferFunction = getAbiItem({
        abi: dropletAbi,
        name: 'transfer',
    })
    const onWithdrawButtonClicked = (amount: string, withdrawAddress: string) => {
        console.log('to', withdrawAddress)
        console.log('amount', amount)
        // writeContract({
        //     to: withdrawAddress as Address,

        //     : BigInt(amount) * BigInt(Math.pow(10, Number(tokenDecimalsData?.tokenDecimals ?? 0))),
        // })

        writeContract({
            address: dropletAddress[wagmi.config.state.chainId as ChainId],
            abi: [TransferFunction],
            functionName: 'transfer',
            args: [
                withdrawAddress as Address,
                BigInt(Number(amount) * Math.pow(10, Number(tokenDecimalsData?.tokenDecimals ?? 0))),
            ],
        })
    }

    useEffect(() => {
        setBottomBarContent(
            <Button
                onClick={() => onWithdrawButtonClicked(amount, withdrawAddress)}
                className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                <span>Withdraw</span>
            </Button>,
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount, withdrawAddress])

    return (
        <div className='flex flex-col gap-y-6'>
            <Container>
                <SectionContent>
                    <div className='mx-2 flex flex-col justify-center'>
                        <h3 className='text-[11pt] font-semibold text-black'>Withdraw Amount</h3>
                        <h3 className='text-[36pt] font-bold text-[#2785EA]'>
                            <Input
                                value={amount}
                                onChange={handleAmountInputChange}
                                className='border-none text-2xl font-bold focus:border-none'
                                type='number'
                                placeholder='$0'
                            />
                        </h3>
                    </div>
                </SectionContent>
            </Container>
            <Container>
                <SectionContent>
                    <div className='mx-2 flex flex-col justify-center'>
                        <h3 className='text-[11pt] font-semibold text-black'>Address to send amount to</h3>
                        <h3 className='mb-8 text-[36pt] font-bold text-[#2785EA]'>
                            <Input
                                value={withdrawAddress}
                                onChange={handleWithdrawAddressInputChange}
                                className='text-2xl font-bold'
                                placeholder='Paste address here'
                            />
                        </h3>
                        <p>
                            <span className='font-bold'>Important</span>: Only send to an ERC20 token wallet that
                            accepts USDC. Failure to do this will result in a{' '}
                            <span className='mx-1 font-bold'>loss</span>
                            of your funds. This transaction is not refundable.
                        </p>
                    </div>
                </SectionContent>
            </Container>
        </div>
    )
}
