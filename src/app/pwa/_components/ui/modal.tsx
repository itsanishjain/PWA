'use client'

import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/25'>
            <div className='rounded-lg bg-white p-6'>
                <button type='button' name='close' onClick={() => router.back()}>
                    Close
                </button>
                {children}
            </div>
        </div>
    )
}
