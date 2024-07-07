import route from '@/lib/utils/routes'
import Link from 'next/link'

export default function RequestRefundPage() {
    return (
        <div>
            <h1>Request Refund Page</h1>
            <Link href={route['/profile']}>Go back to profile</Link>
        </div>
    )
}
