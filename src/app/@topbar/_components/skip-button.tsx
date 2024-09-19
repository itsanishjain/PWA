'use client'

import { Button } from '@/app/_components/ui/button'
import { useRouter, usePathname } from 'next/navigation'

export default function SkipButton() {
    const router = useRouter()
    const pathname = usePathname()

    const handleSkip = () => {
        if (pathname.startsWith('/pool/')) {
            // Extract the pool ID and navigate back to the pool page
            const poolId = pathname.split('/')[2]
            router.push(`/pool/${poolId}`)
        } else {
            // Default behavior: go to /pools
            router.push('/pools')
        }
    }

    return (
        <Button variant='ghost' className='self-end text-xs font-medium text-[#2989EC]' onClick={handleSkip}>
            Skip
        </Button>
    )
}
