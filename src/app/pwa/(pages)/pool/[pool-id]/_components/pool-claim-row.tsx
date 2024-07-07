// src/components/pool-detail/pool-detail.tsx
'use client'

import { Button } from '@/app/pwa/_components/ui/button'
import frog from '@/public/app/images/frog.png'

import { useWallets } from '@privy-io/react-auth'
import { CircleCheckIcon } from 'lucide-react'

const avatarUrls = new Array(4).fill(frog.src)

interface PoolDetailsProps {
    poolId: string
}
const PoolClaimRow = (props: PoolDetailsProps) => {
    const { wallets } = useWallets()

    // const { winnerDetail, isLoading, error } = useWinnerDetail(BigInt(props.poolId), wallets[0]?.address)

    // const queryClient = useQueryClient()
    // const { adminData } = useAdmin()

    // const claimAmount = BigInt(winnerDetail?.winnerDetailFromSC?.amountWon ?? 0)
    // const claimed = winnerDetail?.winnerDetailFromSC?.claimed ?? false
    // const { showBar, hideBar, setContent } = useBottomBarStore(state => state)

    // const { data: hash, isPending, writeContract, writeContractAsync } = useWriteContract()
    // const {
    //     isLoading: isConfirming,
    //     isSuccess: isConfirmed,
    //     isError,
    //     error: registerError,
    //     data: txData,
    // } = useWaitForTransactionReceipt({
    //     hash,
    // })

    // const onClaimButtonClicked = async () => {
    //     console.log('onClaimButtonClicked')
    //     try {
    //         const ClaimWinningFunction = getAbiItem({
    //             abi: poolAbi,
    //             name: 'claimWinning',
    //         })

    //         writeContract({
    //             address: poolAddress[wagmi.config.state.chainId as ChainId],
    //             abi: [ClaimWinningFunction],
    //             functionName: 'claimWinning',
    //             args: [BigInt(props.poolId), wallets[0]?.address as Address],
    //         })
    //     } catch (error) {
    //         console.log('claimWinning Error', error)
    //     }
    // }
    // if (claimAmount === BigInt(0)) {
    //     return
    // }
    // useEffect(() => {
    //     if (isConfirmed) {
    //         toast.message('Transaction Success', { description: 'Claimed winnings successfully' })
    //     }
    // }, [isConfirmed, isConfirming, isError])

    return (
        <div className='mb-4 flex flex-col'>
            <div className='mb-1 flex justify-between font-medium text-[#003073]'>
                <div className='inline-flex items-center gap-1'>
                    <CircleCheckIcon />
                    <span className='font-semibold'>Winner</span>
                </div>
                {/* <span>${winnerDetail?.winnerDetailFromSC?.amountWon?.toString()}</span> */}
            </div>
            <Button
                // onClick={onClaimButtonClicked}
                className='mb-3 h-[46px] w-full flex-1 grow flex-row items-center justify-center rounded-[2rem] bg-cta px-6 py-[11px] text-center align-middle font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
                Claim winnings
            </Button>
        </div>
    )
}

export default PoolClaimRow
