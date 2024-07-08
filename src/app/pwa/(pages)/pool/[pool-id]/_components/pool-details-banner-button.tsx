'use client'

import { QrCode, ShareIcon, EditIcon } from 'lucide-react'

export default function PoolDetailsBannerButtons() {
    const buttons = [QrCode, ShareIcon, EditIcon]
    return (
        <div className='absolute right-4 top-4 flex h-full flex-col gap-2'>
            {buttons.map((Button, index) => (
                <div key={index} className='items-center justify-center rounded-full bg-black/40 p-2'>
                    <Button className='size-5 text-white' />
                </div>
            ))}
        </div>
    )
}
