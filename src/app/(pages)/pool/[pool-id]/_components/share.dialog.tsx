'use client'

import useMediaQuery from '@/app/_client/hooks/use-media-query'
import { Button } from '@/app/_components/ui/button'
import { Dialog } from '@/app/_components/ui/dialog'
import { Drawer } from '@/app/_components/ui/drawer'
import { ShareIcon } from 'lucide-react'

import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import { useState } from 'react'
import ShareForm from './share.form'

const ShareDialog = () => {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery('(min-width: 768px)')

    // if (isDesktop) {
    //     return (
    //         <Dialog open={open} onOpenChange={setOpen}>
    //             <Dialog.Trigger asChild>
    //                 <Button
    //                     type='button'
    //                     title='Share with Friends'
    //                     className='flex size-8 items-center justify-center rounded-full bg-black/40 p-2 md:size-10 md:p-3'>
    //                     {/* <Image className='flex size-6' src={ShareIcon as StaticImport} alt='Share with Friends' /> */}
    //                     <ShareIcon className='size-6' />
    //                 </Button>
    //             </Dialog.Trigger>
    //             <Dialog.Content className='bg-white sm:max-w-[425px]'>
    //                 <Dialog.Header>
    //                     <Dialog.Title>Share with Friends</Dialog.Title>
    //                     <Dialog.Description>
    //                         Invites are best attended with friends. The more the merrier.
    //                     </Dialog.Description>
    //                 </Dialog.Header>
    //                 <ShareForm />
    //             </Dialog.Content>
    //         </Dialog>
    //     )
    // }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <Drawer.Trigger asChild>
                {/* <button
                    title='Share with Friends'
                    type='button'
                    className='size-8 rounded-full bg-black/40 p-2 md:size-10 md:p-3'>
                    <Image className='flex size-full' src={shareIcon as StaticImport} alt='Share with Friends' />
                </button> */}
                <ShareIcon className='size-5 text-white' />
            </Drawer.Trigger>
            <Drawer.Content className='bg-white'>
                <Drawer.Header className='text-left'>
                    <Drawer.Title>Share with Friends</Drawer.Title>
                    <Drawer.Description>
                        Invites are best attended with friends. The more the merrier.
                    </Drawer.Description>
                </Drawer.Header>
                <ShareForm className='px-4' />
                <Drawer.Footer className='pt-2'>
                    <Drawer.Close asChild>
                        <Button variant='outline'>Cancel</Button>
                    </Drawer.Close>
                </Drawer.Footer>
            </Drawer.Content>
        </Drawer>
    )
}

export default ShareDialog
