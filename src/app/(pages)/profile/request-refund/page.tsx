import route from '@/lib/utils/routes'
import { Route } from 'next'
import Link from 'next/link'

export default function RequestRefundPage() {
    return (
        <div>
            <h1>Request Refund Page</h1>
            <Link href={'/profile' as Route}>Go back to profile</Link>
        </div>
    )
}
