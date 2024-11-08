'use client'

import Lottie from 'lottie-react'
import animationData from '@/public/app/animations/loading.json'
import {
    DrawerContent,
    DrawerHeader,
    Drawer,
    DrawerTrigger,
    DrawerTitle,
    DrawerDescription,
} from '../_components/ui/drawer'
import { useAppStore } from '../_client/providers/app-store.provider'

export default function TransactionProgressModal() {
    const open = useAppStore(s => s.transactionInProgress)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    }

    return (
        <Drawer open={open}>
            <DrawerTrigger asChild></DrawerTrigger>
            <DrawerContent className='bg-white'>
                <DrawerHeader className='text-left'>
                    <DrawerTitle className='mb-6 text-center text-xl'>Transaction in Progress</DrawerTitle>
                    <DrawerDescription>
                        Please wait while we process your transaction. This may take a few seconds.
                    </DrawerDescription>

                    <div className='mb-6 flex w-full flex-row items-center justify-center'>
                        <div className='max-w-96'>
                            <Lottie {...defaultOptions} width='100%' />
                        </div>
                    </div>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    )
}
