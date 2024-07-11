'use client'

import { on } from 'events'
import { QrCode, ShareIcon, EditIcon } from 'lucide-react'

import { usePathname, useRouter } from 'next/navigation'
import ShareDialog from './share.dialog'
interface PoolDetailsBannerButtonProps {
    isAdmin?: boolean | null
}
export default function PoolDetailsBannerButtons({ isAdmin }: { isAdmin: boolean | null }) {
    const pathname = usePathname()
    const router = useRouter()
    const buttons = [
        { element: QrCode, adminOnly: true, onClick: () => router.push(`${pathname}/check-in`) },
        { element: ShareDialog, adminOnly: false, onClick: () => console.log('Share Dialog') },
        { element: EditIcon, adminOnly: true, onClick: () => router.push(`${pathname}/edit`) },
    ]
    return (
        <div className='absolute right-4 top-4 flex h-full flex-col gap-2'>
            {buttons.map((Button, index) => (
                <div key={index} className='cursor-pointer items-center justify-center rounded-full bg-black/40 p-2'>
                    {(!Button.adminOnly || isAdmin) && (
                        <Button.element className='size-5 text-white' onClick={Button.onClick} />
                    )}
                </div>
            ))}
        </div>
    )
}
