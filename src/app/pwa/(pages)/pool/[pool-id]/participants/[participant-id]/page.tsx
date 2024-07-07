'use client'

import { Button } from '@/app/pwa/_components/ui/button'
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'

const ParticipantPayout = ({ params }: { params: { 'pool-id': string; 'participant-id': string } }) => {
    // const { userDetailsDB } = useUserDetailsDB(params['participant-id'])
    // const { poolDetails, isLoading, error } = usePoolDetails(BigInt(params?.['pool-id']))

    // const tokenAddress = poolDetails?.poolDetailFromSC?.[4] ?? '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'

    // const { tokenDecimalsData } = useTokenDecimals(tokenAddress)
    const { data: hash, isPending, isSuccess, writeContract } = useWriteContract()

    const inputRef = useRef<HTMLInputElement | null>(null)
    const [inputValue, setInputValue] = useState<string>('0')

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
    }

    // const onPayoutButtonClicked = (e: any) => {
    // console.log('tokenDecimals', tokenDecimalsData?.tokenDecimals)
    //     const winnerAmount = BigInt(inputValue) * BigInt(Math.pow(10, Number(tokenDecimalsData?.tokenDecimals)))
    //     try {
    //         const SetWinnerFunction = getAbiItem({
    //             abi: poolAbi,
    //             name: 'setWinner',
    //         })

    //         writeContract({
    //             address: poolAddress[wagmi.config.state.chainId as ChainId],
    //             abi: [SetWinnerFunction],
    //             functionName: 'setWinner',
    //             args: [BigInt(params['pool-id']), params['participant-id'] as Address, winnerAmount],
    //         })
    //     } catch (error) {
    //         console.log('setWinner Error', error)
    //     }
    // }

    useEffect(() => {
        if (isSuccess) {
            toast.success('Payout Successful', { description: `Transaction: ${hash}` })
        }
    }, [isPending, hash, isSuccess])

    return (
        <div className='mx-auto max-w-md overflow-hidden rounded-lg bg-white'>
            <div className='p-4'>
                <div className={'flex w-full flex-row justify-center'}>
                    <div className='relative flex size-24 justify-center object-contain'>
                        <Avatar className='size-[73px]' aria-label='User Avatar'>
                            {/* <AvatarImage alt='User Avatar' src={userDetailsDB?.userDetail?.avatar ?? frog.src} /> */}
                            <AvatarFallback className='bg-[#d9d9d9]' />
                        </Avatar>
                    </div>
                </div>
                <div className='flex flex-row'>
                    <h3 className='flex h-10 flex-1 flex-row items-center justify-center font-semibold'>
                        {/* {formatAddress(userDetailsDB?.userDetail?.displayName ?? params['participant-id'])} */}
                    </h3>
                </div>
                <div className='mb-4 flex flex-row justify-center'>
                    <p>Checked in</p>
                </div>
                <div className='mt-2 flex h-16 flex-row justify-center'>
                    <div className='relative flex justify-center'>
                        {/* <Input
                            className={cn(
                                'h-24 w-auto border-none px-4 text-center text-6xl font-bold focus:outline-none',
                            )}
                            placeholder='$'
                            autoFocus={true}
                            value={inputValue}
                            type='number'
                            onChange={handleInputChange}
                            ref={inputRef}
                            inputMode='numeric'
                        /> */}
                    </div>
                </div>
                <div className='mt-8 flex w-full flex-col items-center justify-center space-y-2 px-4'>
                    <Button
                        // onClick={onPayoutButtonClicked}
                        className='mb-3 h-[46px] w-full flex-1 grow flex-row items-center justify-center rounded-[2rem] bg-cta px-6 py-[11px] text-center align-middle font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                        Payout
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ParticipantPayout
