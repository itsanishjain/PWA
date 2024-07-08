'use client'

import { useSettingsStore } from '@/app/pwa/_client/providers/settings.provider'
import { Button } from '@/app/pwa/_components/ui/button'
import { useReadPoolWhitelistedHost } from '@/types/contracts'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

export default function BottomBarHandler() {
    const setBottomBarContent = useSettingsStore(state => state.setBottomBarContent)

    useEffect(() => {
        setBottomBarContent(
            <Button
                className='mb-3 h-[46px] w-full rounded-[2rem] bg-cta px-6 py-[11px] text-center text-base font-semibold leading-normal text-white shadow-button active:shadow-button-push'
                onClick={() => {
                    console.log('Create pool')
                }}>
                Create pool
            </Button>,
        )
        return () => {
            setBottomBarContent(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return null

    // const handleClaimWinnings = async () => {
    //     toast('Claiming winnings...')
    //     void writeContract({ args: [poolId, address] })
    // }

    /*
    States:
    - Enable deposits
    - Start pool
    - End pool
    - Join pool
    */
}
