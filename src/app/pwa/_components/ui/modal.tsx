'use client'

import { XIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './button'
import { Route } from 'next'

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <div className='z- fixed inset-0 flex items-center justify-center'>
            <div className='relative h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6'>{children}</div>
        </div>
    )
}
