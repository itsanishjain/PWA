'use client'
import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { useWallets } from '@privy-io/react-auth'
import { useWriteContract } from 'wagmi'
import Container from './container'
import SectionContent from './section-content'
import SectionTitle from './section-title'

export default function ClaimablePrizesList() {
    const { setBottomBarContent } = useSettingsStore(state => {
        return {
            setBottomBarContent: state.setBottomBarContent,
        }
    })
    const { wallets } = useWallets()
    const { writeContract } = useWriteContract()
    const walletAddress = wallets?.[0]?.address
    // const { claimablePools, isLoading, error } = useClaimablePools(walletAddress)

    // const poolIdIndices = claimablePools?.[1].reduce((indices: any, element: any, index: any) => {
    //     if (element === false) {
    //         indices.push(index)
    //     }
    //     return indices
    // }, [])

    // const poolIdsToClaimFrom: string[] = poolIdIndices?.map((index: any) => claimablePools?.[0]?.[index])

    const onClaimFromPoolsButtonClicked = async (
        claimablePools: readonly [readonly bigint[], readonly boolean[]] | undefined,
    ) => {
        // if (!claimablePools) return
        // if (claimablePools[0].length === 0) return
        // console.log('claimablePools', claimablePools)
        // try {
        // const poolIdIndices = claimablePools?.[1].reduce((indices: any, element: any, index: any) => {
        //     if (element === false) {
        //         indices.push(index)
        //     }
        //     return indices
        // }, [])
        // const poolIdsToClaimFrom = poolIdIndices?.map((index: any) => claimablePools?.[0]?.[index])
        // console.log('poolIdsToClaimFrom', poolIdsToClaimFrom)
        // const walletAddresses = poolIdsToClaimFrom.map(() => walletAddress as Address)
        // const ClaimWinningsFunction = getAbiItem({
        //     abi: poolAbi,
        //     name: 'claimWinnings',
        // })
        // writeContract({
        //     address: poolAddress[wagmi.config.state.chainId as ChainId],
        //     abi: [ClaimWinningsFunction],
        //     functionName: 'claimWinnings',
        //     args: [poolIdsToClaimFrom, walletAddresses],
        // })
        // } catch (error) {
        //     console.log('claimWinnings Error', error)
        // }
    }
    // useEffect(() => {
    //     if (claimablePools?.[0].length === 0) {
    //         setBottomBarContent(null)
    //     } else {
    //         setBottomBarContent(
    //             <Button
    //                 onClick={() => onClaimFromPoolsButtonClicked(claimablePools)}
    //                 className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'>
    //                 <span>Claim</span>
    //             </Button>,
    //         )
    //         showBar()
    //     }
    // }, [claimablePools, wallets])

    return (
        <Container>
            <SectionTitle />
            <SectionContent>
                ClaimablePrizesList
                {/* {poolIdsToClaimFrom?.map((pool, index) => <PoolCardRow key={index} poolId={pool} />)} */}
            </SectionContent>
        </Container>
    )
}
