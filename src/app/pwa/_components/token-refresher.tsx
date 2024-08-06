'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TokenRefresher() {
    const { getAccessToken } = usePrivy()
    const router = useRouter()

    useEffect(() => {
        getAccessToken().then(token => {
            console.log('token refreshed:', token)
            router.refresh()
        })
    }, [])

    return (
        <div className='flex h-[100vh] items-center justify-center'>
            <div className='flex flex-col items-center'>
                <p className='mt-4 text-lg'>Refreshing...</p>
            </div>
        </div>
    )
}
